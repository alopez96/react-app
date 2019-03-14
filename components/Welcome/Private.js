import React, { Component } from 'react';
import { Icon, Picker, Form } from "native-base";
import { connect } from 'react-redux';

class Private extends Component {
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
              <Picker.Item label="Santa Clara University" value="SCU" />
              <Picker.Item label="University of Southern California" value="USF" />
              <Picker.Item label="San Francisco University" value="SFU" />
              <Picker.Item label="Brown University" value="Brown" />
              <Picker.Item label="Columbia University" value="Columbia" />
              <Picker.Item label="Cornell University" value="Cornell" />
              <Picker.Item label="DartMouth" value="Darmouth" />
              <Picker.Item label="Harvard" value="Harvard" />
              <Picker.Item label="Pennsylvania" value="Pen" />
              <Picker.Item label="Princeton" value="Princeton" />
              <Picker.Item label="Yale" value="Yale" />
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
  
  
  export default connect(null, mapDispatchToProps)(Private);