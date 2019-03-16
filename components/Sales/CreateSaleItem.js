import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {Container, Content, Text, Header } from 'native-base';
import SaleForm from './SaleForm';


class CreateSaleItem extends Component {

  constructor(props){
    super(props);
    this.state = { };
    this.gotoSales = this.gotoSales.bind(this);
  }
 
  gotoSales() {
    this.props.navigation.navigate('Sales')
  }


  render() {
    return (
        <Container>
          <Header style={{marginTop: -35}}>
            <Text>Add Item For Sale</Text>
          </Header>
        <Content>
          <SaleForm gotoSales={this.gotoSales} />
        </Content>
      </Container>
    );
  }
}



export default (CreateSaleItem);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttons:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
},
button:{
    color:'black', 
    fontSize:40,
    margin: 50
},
cameraIcon:{
  margin:20,
  borderRadius: 2,
  alignSelf: 'center',
},
})