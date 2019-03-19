import React, { Component } from 'react';
import { View, Text } from 'react-native';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Text> This item </Text>
      </View>
    );
  }
}

export default Item;