import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, Image,
  TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Container, Card, CardItem, Body, Icon, Form, Spinner, H1,
  Item, Input, Button, Thumbnail, Left, Right, Content, Text, View } from "native-base";
  import { connect } from 'react-redux';
  import Modal from 'react-native-modal';
import { RNS3 } from 'react-native-aws3';
import axios from 'axios';
import { ImagePicker, Permissions } from 'expo';
import { myAccessKey, mySecretKey, awsPrefix } from './../../s3';
import v1 from 'uuid/v1';

//ItemComponent displays the item selected, and lets verified user edit
class ItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: false,
      title: '',
      description: '',
      image: '',
      category: '',
      postDate: '',
      lastEditDate: '',
      isModalVisible: false,
      imageUpdating: false,
      verified: false,
      sold: false,
      showDeleteButton: false
    };
    this.markSold = this.markSold.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  toogleModal = () => {
    this.setState({
        isModalVisible: !this.state.isModalVisible
    })
  }

  showButton = () => {
    this.setState({
        showDeleteButton: true
    })
  }

  askPermissionsAsync = async () => {
    // await Permissions.askAsync(Permissions.CAMERA);
    Permissions.askAsync(Permissions.CAMERA_ROLL);
  };

  onChangePicture = async () => {
    await this.askPermissionsAsync();
    try {
      this.setState({
        imageUpdating: true
      })
    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: false,
    });
    if (result.cancelled)
        return;
    const key = `${v1()}.jpeg`;
    const file = {
        uri: result.uri,
        type: 'image/jpeg',
        name: key
    };
    const options = {
      keyPrefix: 'sales/',
      bucket: 'react-college',
      region: 'us-east-2',
        accessKey: myAccessKey,
        secretKey: mySecretKey,
        successActionStatus: 201
    }
    await RNS3.put(file, options)
    .progress((e) => console.log(e.loaded / e.total))
    .then((response) => {
        this.setState({
          image: response.body.postResponse.key,
          imageurl: awsPrefix + response.body.postResponse.key
        });
        this.submitChanges();
    }).catch((err) => { console.log(err) });
    } 
    catch (error) { console.log(error) };
    };


  submitChanges = () => {
    const { _id } = this.props.item;
    const { title, description, category, image } = this.state;
    const userid = this.props.item.userid._id;
    const lastEditDate = new Date();
    if(this.props.user._id != this.props.item.userid._id){
        console.log('user does not have permission to edit')
    }
    else{
        axios.put(`http://localhost:3000/editSale/${_id}`, {
          userid,
          title,
          description,
          category, 
          lastEditDate,
          image
        })
        .then(item => {
            if(item){
                this.setState({
                    isModalVisible: !this.state.isModalVisible,
                    imageUpdating: false
                })
            }
            else{
                console.log('error updating user')
            }
            })
        .catch( err => console.log(err));
    }
  }

  markSold(){
    const { _id } = this.props.item;
    const userid = this.props.item.userid._id;
    if(this.props.user._id != this.props.item.userid._id){
        console.log('user does not have permission to edit')
    }
    else{
        axios.put(`http://localhost:3000/sales/${_id}/markSold`, {
          userid
        })
        .then(item => {
            if(item){
                this.setState({
                    sold: true,
                    isModalVisible: false
                })
            }
            else{
                console.log('error updating user')
            }
            })
        .catch( err => console.log(err));
    }
  }

  deleteItem(){
    const { _id } = this.props.item;
    const userid = this.props.item.userid._id;
    if(this.props.user._id != this.props.item.userid._id){
        console.log('user does not have permission to delete')
    }
    else{
        axios.put(`http://localhost:3000/sales/${_id}/removeSale`, {
          userid
        })
        .then(item => {
            if(item){
                this.setState({ 
                    isModalVisible: false
                })
                this.props.updateSaleItems(this.props.saleList)
                this.props.navigation.navigate('SalesScreen')
            }
            else{
                console.log('error updating user')
            }
            })
        .catch( err => console.log(err));
    }
  }


  componentDidMount(){
    const { title, description, category, image, postDate, lastEditDate, sold } = this.props.item;
    this.setState({
        title, description, category, 
        image, postDate, lastEditDate, sold
    })
    //check userid for access to edit
    if(this.props.user._id == this.props.item.userid._id){
      this.setState({ verified: true })
    }
  }

  render() {
    const { image, title, description, postDate, category, lastEditDate } = this.state;
    const dateString = new Date(postDate).toString().substring(0, 10)
    return (
      <View>
      <Card>
        <CardItem>
          <Left>
          <CardItem cardBody>
            <Thumbnail square style={{height:200, width:null, flex:1}}
            source= {{uri: awsPrefix+image}}/>
          </CardItem>
          </Left>
          <Right>
          <CardItem>
          <Body>
            <Button bordered small info>
              <Text>{category}</Text>
            </Button>
            <Text style={{fontWeight:"900"}}>{title}</Text>
              <Text>{description} </Text>
          </Body>
        </CardItem>
          </Right>
        </CardItem>
        <CardItem>
        <Body>
            <Text>
             {this.props.item.userid.name} first posted sale on {dateString}
             </Text>
             {lastEditDate && lastEditDate.length > 0 
              ?<Text>
              It was last edited {dateString}
              </Text>
              :null}
        </Body>
        </CardItem>
      </Card>
      {this.state.sold
      ?<H1 style={{margin:20, color: 'red'}}>Item has been sold!</H1>
      :(this.state.verified
      ?<Button transparent onPress={this.toogleModal}>
        <Text>Edit</Text>
      </Button>
      :null)}

      <View>
      <Modal isVisible={this.state.isModalVisible}
            style={styles.modalStyle}>
            <View style={{ flex: 1, margin: 20 }}>
            <Form>
                <Item>
                    <Input placeholder="title"
                    label='title'
                    onChangeText={(title) => this.setState({ title })}
                    value={title}
                        />
                </Item>
                <Item>
                    <Input placeholder="description"
                    label='description'
                    onChangeText={(description) => this.setState({ description })}
                    value={description}
                        />
                </Item>
                <Item>
                    <Input placeholder="category"
                    label='category'
                    onChangeText={(category) => this.setState({ category })}
                    value={category}
                        />
                </Item>
                </Form>   
                <View style={styles.modalButtons}>
                <Button transparent info onPress={()=> this.toogleModal()}>
                  <Text>Cancel</Text>
                </Button>
                <Button transparent onPress={() => this.submitChanges() }>
                  <Text>Submit</Text>
                </Button>
                </View>
                {this.state.verified
                ?(this.state.imageUpdating == false
                ?<Button transparent info onPress={this.onChangePicture}>
                  <Text>Change Picture</Text>
                </Button>
                :<Spinner color='blue'/>
                )
                :null}
                {this.state.verified
                ?<Button transparent success onPress={this.markSold}>
                  <Text>Mark item as sold</Text>
                </Button>
                :null}
                {this.state.verified
                ?<Button transparent danger onPress={() => this.showButton()}>
                  <Text>Delete this item</Text>
                </Button>
                :null}
                {this.state.showDeleteButton
                ?<Button danger onPress={this.deleteItem}>
                  <Text>Delete!</Text>
                </Button>
                :null}
            </View>
            </Modal>
        </View>
      </View>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    updateSaleItems: (saleList) => dispatch({
      type: 'SALE_LIST',
      payload: {
        saleList
      }
    })
  }
}

const mapStateToProps = (state) => {
    return {
        item: state.saleItem,
        user: state.user,
        saleList: state.saleList
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemComponent);

const styles = StyleSheet.create({
  modalStyle:{
      backgroundColor: 'white',
      padding: 10,
      marginTop: 50,
      marginRight: 20,
      marginBottom: 30,
      marginLeft: 20,
      borderRadius: 10 
  },
  modalButtons:{
      
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  modalButton:{
      color:'black', 
      fontSize:40,
      margin: 10
  }
});