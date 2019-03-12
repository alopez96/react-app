import React, { Component } from 'react';
import { Container, Header, Content, Icon, Picker, Form } from "native-base";
import { View, Text } from 'react-native';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selected: undefined
    };
    this.onValueChange = this.onValueChange.bind(this);
    
  }

  onValueChange(value) {
    this.setState({
        selected: value
      });
  }

  render() {
    return (
      
        <Container>
        <Header />
        <Content>
          <Form>
            <Picker
              mode="dropdown"
              iosHeader="Select your school type"
              placeholder="Select your SIM"
              iosIcon={<Icon name="ios-arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.selected}
              onValueChange={this.onValueChange}
            >
              <Picker.Item label="Uinveristy of California (UC)" value="key0" />
              <Picker.Item label="California State University" value="key1" />
              <Picker.Item label="Private College" value="key2" />
              <Picker.Item label="Community College" value="key3" />
            </Picker>
          </Form>
        </Content>
      </Container>
      
    );
  }
}


export default Welcome;