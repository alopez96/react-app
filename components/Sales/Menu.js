import React, { Component } from 'react';
import { View, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Button, Text, H1 } from 'native-base';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import axios from 'axios';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: false,
        isModalVisible: false,
    };
    this.gotoCategory = this.gotoCategory.bind(this);
    this.renderList = this.renderList.bind(this);
    this.viewAllAction = this.viewAllAction.bind(this);
  }

  componentDidMount(){
    this.getSales();
  }

  getSales(){
    const { schoolid } = this.props;
    this.setState({ isLoading: true })
    axios.get(`http://localhost:3000/getCategories/${schoolid}`, {})
    .then(response => {
      if (response.status == 200) {
        this.setState({
          isLoading: false
        })
        this.props.updateCategoryList(response.data)
      }
      else{
        console.log('error', response.data)
        Toast.show({
          text: response.data,
          duration: 3000
        })
      }
    })
    .catch( err => console.log(err));
    }

    gotoCategory(category){
      this.props.toggleModal(false)
      const { schoolid } = this.props;
      axios.get(`http://localhost:3000/getSalesCategory/${schoolid}/${category}`, {})
        .then(response => {
          if (response.status == 200) {
            this.props.updateList(response.data)
          }
          else {
            console.log('error', response.data)
          }
        })
        .catch(err => console.log(err));
    }

    renderList({item}){
        if (!item) {
            return null
        }
        return (
            <Button full info style={{ margin: 20, borderRadius: 5 }}
                onPress={() => this.gotoCategory(item)}>
                <Text>{item}</Text>
            </Button>
        )
  }

  viewAllAction(){
    this.props.getSales()
    this.props.toggleModal(false)
  }

  render() {
    return (
      <View>
        <Modal isVisible={this.props.isModalVisible}
                style={styles.modalStyle}>
        <View style={{ flex: 1, margin: 20 }}>
        <H1 style={{alignSelf:'center', marginBottom:-20}}>Select a category</H1>
        <ScrollView style={{marginTop:50, marginBottom:20}}>
              <FlatList
                data={this.props.saleCategory}
                renderItem={this.renderList}
                horizontal={false}
                numColumns={1}
                keyExtractor={item => item}
                extraData={this.state}
              />
            </ScrollView>
            <Button transparent onPress={this.viewAllAction}>
              <Text>View all items</Text>
            </Button>
            </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        schoolid: state.school,
        isModalVisible: state.isModalVisible,
        saleCategory: state.saleCategory
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      updateList: (saleList) => dispatch({
        type: 'SALE_LIST',
        payload: {
          saleList
        }
      }),
      toggleModal: (isModalVisible) => dispatch({
        type: 'TOGGLE_MODAL',
        payload: {
          isModalVisible
        }
      }),
      updateCategoryList: (saleCategory) => dispatch({
        type: 'SALE_CATEGORY',
        payload: {
          saleCategory
        }
      }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

const styles = StyleSheet.create({
  modalStyle:{
      backgroundColor: 'white',
      padding: 10,
      marginTop: 50,
      marginRight: 20,
      marginBottom: 30,
      marginLeft: 20,
      borderRadius: 10 
  }
});