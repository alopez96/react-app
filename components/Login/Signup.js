import React, { Component } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Dimensions, Image } from 'react-native';
import { Container, Button, Text, Root, Toast,
        Form, Item, Input } from 'native-base';
import axios from 'axios';

const { width: WIDTH } = Dimensions.get('window');

class Signup extends Component {

  constructor(props){
    super(props);
    this.state = {
        name: '',  
        email: '',
        password: ''
    };
    this.validateInput = this.validateInput.bind(this)
  }

  validateInput = () => {
    const { email, password } = this.state;
    let errors = [];
    if (email == null || !email.includes('.edu')){
        errors.push('email must be an EDU email')
    }
    if (password == null || password.length < 3){
        errors.push(' password must be at least 3 letters')
        this.setState({ errors });
    }
    if (Object.keys(errors).length == 0){
        this.registerUser()
    }
    else {
        console.log(errors)
        Toast.show({
          text: errors.toString(),
          duration: 3000
        })
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
        <Root>
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
        <Button light rounded style={styles.button}
        onPress={() => this.validateInput()}>
            <Text>Register!</Text>
          </Button>
        <Button transparent style={styles.button}
        onPress={() => this.props.navigation.navigate('LoginScreen')}>
            <Text style={{color:'#000'}}>Back to Login</Text>
          </Button>
          </View>
        </Container>
        </Root>
        </KeyboardAvoidingView>
    );
  }
}


export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    width: 300,
    height: 300
  }
  ,title:{
      color: '#fff',
      marginTop: 10,
      opacity: 0.9
  },
  button:{
    padding: 20,
    margin: 20,
    width: WIDTH/2,
    justifyContent: 'center'
  },
})