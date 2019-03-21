import React, { Component } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Button, Text } from 'native-base';
import { connect } from 'react-redux';
import axios from 'axios';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: false,
        list: []
    };
    this.gotoCategory = this.gotoCategory.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  componentDidMount(){
    this.getSales();
  }

  getSales(){
    const { schoolid } = this.props;
    this.setState({ isLoading: true })
    axios.get(`http://localhost:3000/getCategories/${schoolid}`, {})
    .then(response => {
      if (response.status == 200) {
        this.setState({
          list: response.data,
          isLoading: false
        })
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
          })
          const { schoolid } = this.props;
          axios.get(`http://localhost:3000/getSalesCategory/${schoolid}/${category}`, {})
          .then(response => {
            if (response.status == 200) {
              this.props.updateCategoryList(response.data)
              this.props.navigation.navigate('SalesScreen')
            }
            else{
              console.log('error', response.data)
            }
          })
          .catch( err => console.log(err));
    }

    renderList({item}){
        if (!item) {
            return null
        }
        return (
            <Button full info style={{ margin: 20, borderRadius: 5 }}
                onPress={() => this.gotoCategory(item)}>
                <Text>{item}</Text>
            </Button>
        )
  }

  render() {
    return (
      <View>
        <ScrollView style={{marginTop:50, marginBottom:20}}>
              <FlatList
                data={this.state.list}
                renderItem={this.renderList}
                horizontal={false}
                numColumns={1}
                keyExtractor={item => item}
                extraData={this.state}
              />
            </ScrollView>
      </View>
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
      updateCategoryList: (saleList) => dispatch({
        type: 'SALE_LIST',
        payload: {
          saleList
        }
      })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);