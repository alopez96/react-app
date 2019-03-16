import React, { Component } from 'react';
import { Icon, Picker, Form } from "native-base";
import { connect } from 'react-redux';

class Interest extends Component {
  constructor(props) {
    super(props);
    this.state = {
        interest: undefined
    };
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value) {
    this.setState({
        interest: value
      });
    this.props.updateInterest(value)
    if (value && value.length > 0){
      if(value == 'sales'){
        this.props.navigation.navigate('SalesScreen')
      }
      else if(value == 'forum'){
        this.props.navigation.navigate('ForumScreen')
      }
      else{
        this.props.navigation.navigate('Main')
      }
    }
  }

  render() {
    return (
          <Form>
            <Picker
              mode="dropdown"
              iosHeader="Interest"
              placeholder="Select interest"
              iosIcon={<Icon name="ios-arrow-down" />}
              style={{ width: undefined }}
              selectedValue={this.state.interest}
              onValueChange={this.onValueChange}
            >
              <Picker.Item label="Sales" value="sales" />
              <Picker.Item label="Open Forum" value="forum" />
              <Picker.Item label="Information" value="info" />
              <Picker.Item label="News" value="news" />
              <Picker.Item label="Scholarships" value="scholarships" />
            </Picker>
          </Form>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
      updateInterest: (interest) => dispatch({
        type: 'INTEREST_TYPE',
        payload: {
          interest
        }
      })
    }
  }
  
  
  export default connect(null, mapDispatchToProps)(Interest);