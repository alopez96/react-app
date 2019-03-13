import React from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Dimensions, Image } from 'react-native';
import { Button, Text,
        Form, Item, Input } from 'native-base';
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
      this.signInUser()
  }
  else {
      console.log(errors)
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
        this.props.updateUser(response.data.user)
        this.props.navigation.navigate('AppScreen');
      }
      else{
        console.log('error', response.status)
      }
    })
    .catch( err => console.log(err));
  
  }

  render() {
    
    var { email, password } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
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
