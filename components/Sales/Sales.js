import React, { Component } from 'react';
import { Container, Content, Icon, Picker, Form, Header,
    Item, Input, Button, Text, Thumbnail, Left } from "native-base";
import { StyleSheet, TouchableOpacity } from 'react-native';
import TopSearchBar from '../Home/TopSearchBar';

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.gotoProfile = this.gotoProfile.bind(this);
  }

  gotoProfile(){
    this.props.navigation.navigate('ProfileScreen');
}

  render() {    
    return (
        <Container style={styles.container}>
          <TopSearchBar gotoProfile={this.gotoProfile}/>
        </Container>
    );
  }
}

export default Sales;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
  });