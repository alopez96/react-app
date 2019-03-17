import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Card, CardItem, Thumbnail, 
        Body, Left, Button, Icon } from 'native-base';

class CardComponent extends Component {
  constructor() {
    super();
    this.state = {
        uid: '',
        name: 'jose',
        imageurl: '',
    }
  }


  render() {    
    return (
      <Card>
        <CardItem>
          <Left>
            <TouchableOpacity>
            <Thumbnail
              source= {{uri: this.state.imageurl}}/>
            </TouchableOpacity>
            <Body>
              <Text style={{fontWeight:"700"}}> {this.state.name} </Text>
              <Text note> Date here </Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
        <Thumbnail square style={{height:200, width:null, flex:1}}
         source= {{uri: this.state.imageurl}}/>
        </CardItem>
        <CardItem>
          <Body>
            <Text>
              <Text style={{fontWeight:"900"}}> title </Text>
              Description of post             
            </Text>
          </Body>
        </CardItem>
      </Card>
    );
  }
}


export default CardComponent;