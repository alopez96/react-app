import React, { Component } from 'react';
import { Container, Content, Icon, Picker, Form } from "native-base";
import { connect } from 'react-redux';
import UCs from './UCs';
import CSUs from './CSUs';
import Interest from './Interest';
import Private from './Private';
import CCs from './CCs';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
        type: undefined
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.selectSchool = this.selectSchool.bind(this);
  }

  onValueChange(value) {
    this.setState({
        type: value
      });
  }

  selectSchool(value) {
    this.props.navigation.navigate('InterestScreen')
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
            ? <UCs selectSchool={this.selectSchool}/>
            //CSU
            : ((type == 'CSU')
                ? <CSUs selectSchool={this.selectSchool}/>
                //private
                : ((type == 'Private')
                ? <Private selectSchool={this.selectSchool}/>
                //CC
                : ((type == 'CC')
                 ? <CCs selectSchool={this.selectSchool}/>
                 //none
                 : null))
          )}
        </Content>
      </Container>
      
    );
  }
}


const mapStateToProps = (state) => {
  return {
      school: state.school
  }
}

export default connect(mapStateToProps)(Welcome);
