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
      list: [],
      loading: false,
     };
    this.gotoProfile = this.gotoProfile.bind(this);
    this.getSales = this.getSales.bind(this);
  }

  gotoProfile(){
    this.props.navigation.navigate('ProfileScreen');
  }

  gotoItem(item, index){
    this.props.updateItem(item)
    this.props.updateItemIndex(index)
    this.props.navigation.navigate('ItemScreen');
  }

  componentDidMount(){
    this.getSales();
  }

  getSales(){
    const { schoolid } = this.props;
    this.setState({ loading: true })
    axios.get(`http://localhost:3000/getSales/${schoolid}`, {})
    .then(response => {
      if (response.status == 200) {
        this.setState({
          list: response.data,
          loading: false
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

  gotoCategory(category){
    this.setState({
      list: [],
      loading: true
    })
    const { schoolid } = this.props;
    axios.get(`http://localhost:3000/getSalesCategory/${schoolid}/${category}`, {})
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

  renderList = ({item, index}) => {
    if (!item) {
      return null;
    }
    const { postDate, title, description, category, image } = item;
    const dateString = new Date(postDate).toString().substring(0, 10)
    return (
      <TouchableWithoutFeedback onPress={() => this.gotoItem(item, index)}>
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
            <Button transparent small info onPress={() => this.gotoCategory(category)}
            ><Text>{category}</Text></Button>
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
          <ScrollView refreshControl={<RefreshControl
          refreshing={this.state.loading}
          onRefresh={this.getSales}
          />}>
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
    }),
    updateItem: (saleItem) => dispatch({
      type: 'SALE_ITEM',
      payload: {
        saleItem
      }
    }),
    updateItemIndex: (itemIndex) => dispatch({
      type: 'ITEM_INDEX',
      payload: {
        itemIndex
      }
    }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sales);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
  });