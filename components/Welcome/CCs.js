import React, { Component } from 'react';
import { Icon, Picker, Form } from "native-base";
import { connect } from 'react-redux';

class CCs extends Component {
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
              <Picker.Item label="City College of San Francisco" value="Santa Monica College" />
              <Picker.Item label="De Anza College" value="Santa Monica College" />
              <Picker.Item label="Diable Valley College" value="Santa Monica College" />
              <Picker.Item label="East Los Angeles College" value="" />
              <Picker.Item label="El Camino Community College District" value="Santa Monica College" />
              <Picker.Item label="Fullerton" value="Santa Monica College" />
              <Picker.Item label="Fresno City College" value="Santa Monica College" />
              <Picker.Item label="Santa Monica College" value="Santa Monica College" />
              <Picker.Item label="Santa Ana College" value="Santa Ana College" />
              <Picker.Item label="Santa Rosa Junior College" value="Santa Monica College" />
              <Picker.Item label="Sacramento City College" value="Santa Monica College" />
              <Picker.Item label="San Diego Mesa College" value="Santa Monica College" />
              <Picker.Item label="Long Beach City College" value="Santa Monica College" />
              <Picker.Item label="Los Angeles Pierce College" value="Santa Monica College" />
              <Picker.Item label="Mt. San Antonio College" value="Mt. San Antonio College" />
              <Picker.Item label="Orange Coast College" value="Santa Monica College" />
              <Picker.Item label="Pasadena City College" value="Santa Monica College" />
              <Picker.Item label="Palomar" value="Santa Monica College" />
              <Picker.Item label="Sanddleback College" value="Santa Monica College" />
              <Picker.Item label="Chaffey College" value="Santa Monica College" />
              <Picker.Item label="Bakersfield College" value="Santa Monica College" />
              <Picker.Item label="Modesto Junior College" value="Santa Monica College" />
              <Picker.Item label="Southwestern College (Chula Vista)" value="Santa Monica College" />
              <Picker.Item label="Los Angeles City College" value="Santa Monica College" />
              <Picker.Item label="Los Angeles Valley College" value="Santa Monica College" />
              <Picker.Item label="San Joaquin Delta College" value="Santa Monica College" />
              <Picker.Item label="Sierra College" value="Santa Monica College" />
              <Picker.Item label="Riverside City College" value="Santa Monica College" />
              <Picker.Item label="Grossmont College" value="Santa Monica College" />
              <Picker.Item label="Santa Barbara City College" value="Santa Monica College" />
              <Picker.Item label="College of the Canyons" value="Santa Monica College" />
              <Picker.Item label="San Bernardino Valley College" value="Santa Monica College" />
              <Picker.Item label="Santa Diego City College" value="Santa Monica College" />
              <Picker.Item label="Rio Hondo College" value="Santa Monica College" />
              <Picker.Item label="Cypress College" value="Santa Monica College" />
              <Picker.Item label="Glendale Community College" value="Santa Monica College" />
              <Picker.Item label="Foothill College" value="Santa Monica College" />
              <Picker.Item label="Los Angeles Trade Technical College" value="Santa Monica College" />
              <Picker.Item label="MiraCosta College" value="Santa Monica College" />
              <Picker.Item label="Consumnes River College" value="Santa Monica College" />
              <Picker.Item label="Reedley College" value="Santa Monica College" />
              <Picker.Item label="Mt San Jacinto Community College Disctrict" value="Santa Monica College" />
              <Picker.Item label="Cabrillo" value="Santa Monica College" />
              <Picker.Item label="Los Medanos College Brentwood/Pittsburg" value="Santa Monica College" />
              <Picker.Item label="Diable Valley College Pleasant Hill/San Ramon" value="Santa Monica College" />
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
  
  
  export default connect(null, mapDispatchToProps)(CCs);