import React, { Component } from 'react';
import { Container, Content, Icon, Picker, Form } from "native-base";
import Schools from './Schools';
import axios from 'axios';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
        type: undefined,
        list: []
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.selectSchool = this.selectSchool.bind(this);
  }

  onValueChange(value) {
    this.setState({
        type: value
      });
    //fetch the list of schools, based on category
    axios.get(`http://localhost:3000/getSchool/${value}`, {})
    .then(response => {
      if (response.status == 200) {
        this.setState({
          list: response.data
        })
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

  selectSchool(value) {
    this.props.navigation.navigate('InterestScreen')
  }

  render() {
    //destruct the state
    const { type, list } = this.state;
    return (
        <Container>
        <Content>
          <Form>
            <Picker
              mode="dropdown"
              iosHeader="School"
              placeholder="Select your school type"
              iosIcon={<Icon name="ios-arrow-down" />}
              style={{ width: undefined }}
              selectedValue={type}
              onValueChange={this.onValueChange}
            >
              <Picker.Item label="Uinveristy of California (UC)" value="UC" />
              <Picker.Item label="California State University" value="CSU" />
              <Picker.Item label="Private College" value="Private" />
              <Picker.Item label="Community College" value="CC" />
            </Picker>
          </Form>
          {type
          ?<Schools selectSchool={this.selectSchool} list={list}/>
          :null}
        </Content>
      </Container>
      
    );
  }
}

export default Welcome;
