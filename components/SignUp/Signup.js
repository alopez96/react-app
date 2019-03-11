import React, { Component } from 'react';
import { StyleSheet, KeyboardAvoidingView, View } from 'react-native';
import { Container, Button, Text,
        Form, Item, Input } from 'native-base';
import axios from 'axios';

class Signup extends Component {

  constructor(props){
    super(props);
    this.state = {
        name: '',  
        email: '',
        password: ''
    };
  }

  validateInput = () => {
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
        this.registerUser()
    }
    else {
        console.log(errors)
    }
  }

  registerUser = () => {
    const { name, email, password } = this.state;
    axios.post('http://localhost:3000/register', {
        name: name,
        email: email,
        password: password,
        joined: new Date()
    })
    .then(response => {
    if (response.status == 200) {
        console.log(response.data)
        this.props.navigation.navigate('AppScreen');
      }
      else{
        console.log('error', response.status)
      }
    })
    .catch( err => console.log(err));
  }

  render() {
      var { name, email, password } = this.state;
    return (
        <KeyboardAvoidingView style={styles.container}>
        <Container> 
        <Form>
            <Item>
                <Input placeholder="name"
                label='name'
                autoCapitalize='none'
                onChangeText={(name) => this.setState({ name })}
                value={name}
                    />
            </Item>
            <Item>
                <Input placeholder="email"
                label='email'
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={(email) => this.setState({ email })}
                value={email}
                    />
            </Item>
            <Item last>
                <Input placeholder="password"
                label='password'
                autoCapitalize='none'
                secureTextEntry
                onChangeText={(password) => this.setState({ password })}
                value={password}
                    />
            </Item>
        </Form>
        <View style={{justifyContent: 'center', alignSelf: 'center'}}>
        <Button style={styles.button}
        onPress={() => this.validateInput()}>
            <Text>Register!</Text>
          </Button>
        <Button transparent style={{margin: 10}}
        onPress={() => this.props.navigation.navigate('LoginScreen')}>
            <Text>Go back to Login</Text>
          </Button>
          </View>
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
  button: {
      margin: 20,
      padding: 10
  }
})