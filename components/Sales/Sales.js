import React, { Component } from 'react';
import { Container, Content, Icon, Picker, Form, Header,
    Item, Input, Button, Text, Thumbnail, Left } from "native-base";
import { StyleSheet, TouchableOpacity } from 'react-native';
import TopSearchBar from '../Home/TopSearchBar';
import axios from 'axios';
import { connect } from 'react-redux';

import CardComponent from './CardComponent';

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

  render() {    
    return (
        <Container style={styles.container}>
          <TopSearchBar gotoProfile={this.gotoProfile}/>
          <CardComponent/>
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