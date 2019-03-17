import React, { Component } from 'react';
import { Container, Content, Icon, Picker, Form, Header,
    Item, Input, Button, Text, Thumbnail, Left } from "native-base";
import { StyleSheet, TouchableOpacity } from 'react-native';
import TopSearchBar from '../Home/TopSearchBar';
import axios from 'axios';
import { connect } from 'react-redux';

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
        console.log('response', response.data)
        this.setState({
          list: response.data
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

  render() {    
    return (
        <Container style={styles.container}>
          <TopSearchBar gotoProfile={this.gotoProfile}/>
        </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      schoolid: state.school
  }
}

export default connect(mapStateToProps)(Sales);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
  });