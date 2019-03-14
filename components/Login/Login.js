import React from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Dimensions, Image } from 'react-native';
import { Button, Text, Container, Root,
        Form, Item, Input, Toast } from 'native-base';
import axios from 'axios';
import { connect } from 'react-redux';

const { width: WIDTH } = Dimensions.get('window');

class Login extends React.Component {

  constructor(props){
    super(props);
    this.state = {  
        email: 'arturo@ucsc.edu',
        password: '123',
    };
    this.validateInput = this.validateInput.bind(this)
}

validateInput = () => {
  const { email, password } = this.state;
  let errors = [];
  if (email == null || !email.includes('.edu')){
      errors.push('Email must be an edu email')
  }
  if (Object.keys(errors).length == 0){
      this.signInUser()
  }
  else {
      console.log(errors)
      Toast.show({
        text: errors.toString(),
        duration: 3000
      })
  }
}

signInUser = () => {
  const { email, password } = this.state;
    axios.post('http://localhost:3000/login', {
        email: email,
        password: password
    })
    .then(response => {
    if (response.status == 200) {
      console.log('response', response.data)
        this.props.updateUser(response.data.user)
        this.props.navigation.navigate('AppScreen');
    }
    else{
      console.log('login error', response.data)
      Toast.show({
        text: response.data,
        duration: 3000
      })
    }
    })
    .catch( err => console.log(err));
  }

  render() {
    
    var { email, password } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
      <Root>
        <View style={styles.logoContainer} >
              <Image style={styles.logo}
              source= {require('./../../images/logo.png')}/>
              <Text style={styles.title} > Unite </Text>
        </View>
        <Form>
          <Item>
              <Input placeholder="email"
              label='email'
              onChangeText={(email) => this.setState({ email })}
              value={email}
                  />
          </Item>
          <Item last>
              <Input placeholder="password"
              label='password'
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              value={password}
                  />
          </Item>
      </Form>
      <View style={{justifyContent: 'center', alignSelf: 'center'}}>
        <Button dark rounded style={styles.button}
        onPress={() => this.validateInput() }>
            <Text>Login!</Text>
          </Button>
        <Button transparent style={styles.button}
        onPress={() => this.props.navigation.navigate('SignupScreen')}>
            <Text style={{color:'#000'}}>Sign Up!</Text>
          </Button>
        </View>
        </Root>
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch({
      type: 'LOAD_USER',
      payload: {
        user
      }
    })
  }
}

export default connect(null, mapDispatchToProps)(Login);


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
