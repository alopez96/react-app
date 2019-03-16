import React, { Component } from 'react';
import { Container, Content, Icon, Picker, Form, Header,
    Item, Input, Button, Text, Thumbnail, Left } from "native-base";
import { StyleSheet, TouchableOpacity } from 'react-native';

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
        titleSearch: '',
        uri: 'https://amp.businessinsider.com/images/5c896948daa507206211a3f3-750-375.jpg'
    };
    this.search = this.search.bind(this);
    this.gotoProfile = this.gotoProfile.bind(this);
  }

  search(){
      const { titleSearch } = this.state;
      console.log('search', titleSearch);
  }

  gotoProfile(){
      this.props.navigation.navigate('ProfileScreen');
  }

  render() {    
    return (
        <Container style={styles.container}>
          <Header searchBar style={{marginTop: -35}}>
          <TouchableOpacity onPress={() => this.gotoProfile()}>
            <Thumbnail small button style={{margin:5}}
            source={{uri: this.state.uri}}/>
           </TouchableOpacity>
          <Item style={{borderRadius:5}}>
            <Input placeholder="Find item"
              label="titleSearch"
              onChangeText={(titleSearch) => this.setState({ titleSearch })}
              value={this.state.titleSearch}/>
          </Item>
          <Button transparent onPress={() => this.search()}>
              <Icon name="ios-search" />
            </Button>
        </Header>
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