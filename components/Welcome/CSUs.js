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
              <Picker.Item label="CSU Fresno" value="CSUFresno" />
              <Picker.Item label="CSU Fullerton" value="CSUFuller" />
              <Picker.Item label="Humboldt State University" value="HumboldtState" />
              <Picker.Item label="CSU Long Beach" value="CSULB" />
              <Picker.Item label="CSU Los Angeles" value="CSULA" />
              <Picker.Item label="CSU Maritime Academy" value="CSUMartitime" />
              <Picker.Item label="CSU Monterey Bay" value="CSUMonterey" />
              <Picker.Item label="CSU Northridge" value="CSUNorthridge" />
              <Picker.Item label="CSU Sacramento" value="CSUSac" />
              <Picker.Item label="CSU San Bernardino" value="CSUSanBernardino" />
              <Picker.Item label="San Francisco State University" value="SFState" />
              <Picker.Item label="San José State University" value="SJSU" />
              <Picker.Item label="CalPoly San Luis Obispo" value="CalPloySLO" />
              <Picker.Item label="California State University San Marcos" value="CSU San Marcos" />
              <Picker.Item label="Sonoma State University" value="SSU" />
              <Picker.Item label="CSU Stanislaus" value="CSUStanislaus" />
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