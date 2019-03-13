import React, { Component } from 'react';
import { Icon, Picker, Form } from "native-base";
import { connect } from 'react-redux';

class CSUs extends Component {
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
              <Picker.Item label="CSU Bakersfield" value="CSUB" />
              <Picker.Item label="CSU Channel Island" value="CSUCI" />
              <Picker.Item label="CSU Chico" value="CSUC" />
              <Picker.Item label="CSU Dominguez Hills" value="CSUDH" />
              <Picker.Item label="CSU East Bay" value="CSUEB" />
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
  
  
  export default connect(null, mapDispatchToProps)(CSUs);