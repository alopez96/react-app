import React, { Component } from 'react';
import { Container, Content, Icon, Picker, Form, Header,
       Item, Input, Button, Text } from "native-base";
import Schools from './Schools';
import axios from 'axios';
import { connect } from 'react-redux';
import { screenWidth, screenHeight } from './../Dimensions';

const WIDTH = screenWidth;
const HEIGHT = screenHeight;

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
        type: undefined,
        list: [],
        nameSearch: '',
        school: {}
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.selectSchool = this.selectSchool.bind(this);
  }

  onValueChange(value) {
    this.setState({
        type: value
      });
    //fetch the list of schools, based on category
    axios.get(`http://localhost:3000/getSchools/${value}`, {})
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

  search = () => {
    const name = this.state.nameSearch
    //query db for school keyword
    axios.get(`http://localhost:3000/school/${name}`, {})
    .then(response => {
      if (response.status == 200) {
        if(response.data.school.length == 1){
          this.props.updateSchool(response.data.school[0]._id)
        }
        else if(response.data.school.length < 1){
          console.log('no result found')
        }
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

  render() {
    //destruct the state
    const { type, list } = this.state;
    return (
        <Container>
          <Header style={{ marginTop:-35 }}>
          <Text style={{fontSize: 30, alignSelf:'center'}}>Find your school</Text>
          </Header>
          <Item style={{borderRadius:5}}>
            <Input placeholder="School name"
              label="nameSearch"
              onChangeText={(nameSearch) => this.setState({ nameSearch })}
              value={this.state.nameSearch}/>
            <Button transparent onPress={() => this.search()}>
              <Icon name="ios-search" />
            </Button>
            <Form>
            <Picker
              mode="dropdown"
              iosHeader="School"
              placeholder="School category"
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
          </Item>      
        <Content>  
          {type
          ?<Schools selectSchool={this.selectSchool} list={list}/>
          :null}
        </Content>
      </Container>
      
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSchool: (school) => dispatch({
      type: 'UPDATE_SCHOOL',
      payload: {
        school
      }
    })
  }
}

export default connect(null, mapDispatchToProps)(Welcome);
