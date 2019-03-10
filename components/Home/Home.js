import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Text } from 'native-base';

class Home extends Component {

  constructor(props){
    super(props);
    this.state = {   
    }; 
  }

  render() {
    return (
        <Container style={styles.container}>
            <Text>Home Page</Text>
        </Container>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})