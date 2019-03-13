import React, { Component } from 'react';
import { Icon, Picker, Form } from "native-base";
import { connect } from 'react-redux';

class UCs extends Component {
  constructor(props) {
    super(props);
    this.state = {
        school: undefined
    };
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value) {
    this.setState({
        school: value
      });
      this.props.updateSchoolType(value)
  }

  render() {
    return (
          <Form>
            <Picker
              mode="dropdown"
              iosHeader="School"
              placeholder="Select your school"
              iosIcon={<Icon name="ios-arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.school}
              onValueChange={this.onValueChange}
            >
              <Picker.Item label="UC Berkeley" value="UCB" />
              <Picker.Item label="UC Davis" value="UCD" />
              <Picker.Item label="UC Irvine" value="UCI" />
              <Picker.Item label="UC Los Angeles" value="UCLA" />
              <Picker.Item label="UC Merced" value="UCM" />
              <Picker.Item label="UC Riverside" value="UCR" />
              <Picker.Item label="UC Santa Barbara" value="UCSB" />
              <Picker.Item label="UC Santa Cruz" value="UCSC" />
              <Picker.Item label="UC San Diego" value="UCSD" />
            </Picker>
          </Form>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
      updateSchoolType: (school) => dispatch({
        type: 'SCHOOL_TYPE',
        payload: {
          school
        }
      })
    }
  }
  
  
  export default connect(null, mapDispatchToProps)(UCs);