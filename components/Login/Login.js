import React from 'react';
import { StyleSheet, KeyboardAvoidingView  } from 'react-native';
import { Container, Button, Text } from 'native-base';

class Login extends React.Component {

  constructor(props){
    super(props);
    this.state = {  
        email: 'arturo@ucsc.edu',
        password: '123',
    };
}

validateInput = () => {
  console.log('login clicked')
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
  this.props.navigation.navigate('AppScreen')
  }

  render() {
    
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Container style={{justifyContent: 'center', alignSelf: 'center'}}> 
        <Button style={styles.button}
        onPress={() => this.validateInput() }>
            <Text>Login!</Text>
          </Button>
        <Button transparent style={styles.button}
        onPress={() => this.props.navigation.navigate('SignupScreen')}>
            <Text>Sign Up!</Text>
          </Button>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}


export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button:{
    padding: 20,
    margin: 20
  }
});
