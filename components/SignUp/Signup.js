import React, { Component } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Container, Button, Text } from 'native-base';

class Signup extends Component {

  constructor(props){
    super(props);
    this.state = {  
       email: '',
       password: ''
    };
  }

  validateInput = () => {
    console.log('signup clicked')
    const { email, password } = this.state;
    let errors = {};
    if (email == null || !email.includes('.edu')){
        errors['email'] = 'Email must be an edu email'
    }
    if (password == null || password.length < 3){
        errors['password'] = 'Password must be at least 3 letters'
        this.setState({ errors });
    }
    if (Object.keys(errors).length == 0){
        this.signInUser()
    }
    else {
        console.log(errors)
    }
  }

  render() {
    return (
        <KeyboardAvoidingView style={styles.container}>
        <Container style={{justifyContent: 'center', alignSelf: 'center'}}> 
        <Button style={styles.button}
        onPress={() => this.validateInput()}>
            <Text>Register!</Text>
          </Button>
        <Button transparent style={styles.button}
        onPress={() => this.props.navigation.navigate('LoginScreen')}>
            <Text>Go back to Login</Text>
          </Button>
        </Container>
        </KeyboardAvoidingView>
    );
  }
}


export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
})