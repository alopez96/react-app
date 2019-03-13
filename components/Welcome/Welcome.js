import React, { Component } from 'react';
import { Container, Content, Icon, Picker, Form } from "native-base";
import UCs from './UCs';
import CSUs from './CSUs';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
        type: undefined,
        school: null
    };
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value) {
    this.setState({
        type: value
      });
  }

  render() {
    const { type } = this.state;
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
          {(type == 'UC')
            //UC
            ? <UCs></UCs>
            //CSU
            : ((type == 'CSU')
                ? <CSUs></CSUs>
                //none
                : null
          )}
        </Content>
      </Container>
      
    );
  }
}



export default (Welcome);
