import React, { Component } from 'react';
import { Container, Card, CardItem, Body, Icon, 
    Item, Input, Button, Text, Thumbnail, Left, Right } from "native-base";
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, View, Image,
      TouchableWithoutFeedback, RefreshControl } from 'react-native';
import TopSearchBar from '../Home/TopSearchBar';
import axios from 'axios';
import { connect } from 'react-redux';
import { awsPrefix } from './../../s3';


class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
     };
    this.gotoProfile = this.gotoProfile.bind(this);
  }

  gotoProfile(){
    this.props.navigation.navigate('ProfileScreen');
  }

  gotoItem(){
    this.props.navigation.navigate('ItemScreen');
  }

  componentDidMount(){
    const { schoolid } = this.props;
    axios.get(`http://localhost:3000/getSales/${schoolid}`, {})
    .then(response => {
      if (response.status == 200) {
        this.setState({
          list: response.data
        })
        this.props.updateSaleItems(response.data)
      }
      else{
        console.log('error', response.data)
        Toast.show({
          text: response.data,
          duration: 3000
        })
      }
    })
    .catch( err => console.log(err));
  }

  renderList = ({item}) => {
    if (!item) {
      return null;
    }
    const { postDate, title, description, category, image } = item;
    const dateString = new Date(postDate).toString().substring(0, 10)
    return (
      <TouchableWithoutFeedback onPress={() => this.gotoItem()}>
      <Card>
        <CardItem>
          <Left>
          <CardItem cardBody>
            <Thumbnail square style={{height:100, width:null, flex:1}}
            source= {{uri: awsPrefix+image}}/>
          </CardItem>
          </Left>
          <Right>
          <CardItem>
          <Body>
            <Button inactive small light><Text>{category}</Text></Button>
            <Text style={{fontWeight:"900"}}> {title}</Text>
              <Text>{description} </Text>
          </Body>
        </CardItem>
          </Right>
        </CardItem>
        <Body>
            <Text>
             {item.userid.name} posted sale on {dateString}
             </Text>
        </Body>
       
      </Card>
      </TouchableWithoutFeedback>
      );
  }

  render() {    
    return (
        <Container style={styles.container}>
          <TopSearchBar gotoProfile={this.gotoProfile}/>
          <ScrollView>
              <FlatList
                data={this.state.list.slice(0, 10)}
                renderItem={this.renderList}
                horizontal={false}
                keyExtractor={item => item._id}
                extraData={this.state}
              />
            </ScrollView>
        </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      schoolid: state.school
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSaleItems: (saleList) => dispatch({
      type: 'SALE_LIST',
      payload: {
        saleList
      }
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sales);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
  });