import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, View, Image,
  TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Container, Card, CardItem, Body, Icon, Form,
  Item, Input, Button, Text, Thumbnail, Left, Right, Content } from "native-base";
  import { connect } from 'react-redux';
  import Modal from 'react-native-modal';
import { RNS3 } from 'react-native-aws3';
import axios from 'axios';
import { ImagePicker, Permissions } from 'expo';
import { myAccessKey, mySecretKey, awsPrefix } from './../../s3';
import v1 from 'uuid/v1';


class ItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      name: '',
      userimage: '',
      match: false,
      mytitle: '',
      mydescription: '',
      image: '',
      mycategory: '',
      isModalVisible: false,
      imageUpdated: false,
      verified: false
    };
  }

  toogleModal = () => {
    this.setState({
        isModalVisible: !this.state.isModalVisible
    })
  }

askPermissionsAsync = async () => {
    // await Permissions.askAsync(Permissions.CAMERA);
    Permissions.askAsync(Permissions.CAMERA_ROLL);
  };

onChangePicture = async () => {
    await this.askPermissionsAsync();
    try {
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
          myimageurl: awsPrefix + response.body.postResponse.key
        });
    }).catch((err) => { console.log(err) });
    } 
    catch (error) { console.log(error) };
    };


  submitChanges = () => {
    const { _id, schoolid } = this.props.item;
    const { mytitle, mydescription, mycategory } = this.state;
    const userid = this.props.item.userid._id;
    const lastEditDate = new Date();
    if(this.props.user._id != this.props.item.userid._id){
        console.log('user does not have permission to delete')
    }
    else{
        axios.put(`http://localhost:3000/editSale/${_id}`, {
          userid,
          title: mytitle,
          description: mydescription,
          category: mycategory, 
          schoolid, 
          lastEditDate
        })
        .then(item => {
            if(item){
                this.setState({
                    isModalVisible: !this.state.isModalVisible
                })
            }
            else{
                console.log('error updating user')
            }
            })
        .catch( err => console.log(err));
    }
  }


  componentDidMount(){
    const { title, description, category } = this.props.item;
    this.setState({
        mytitle: title,
        mydescription: description,
        mycategory: category
    })
    //check userid for access to edit
    console.log(this.props.user._id)
    console.log(this.props.item.userid._id)
    if(this.props.user._id == this.props.item.userid._id){
      this.setState({ verified: true })
    }
  }

  render() {
    const { image, title, description, postDate, category } = this.props.item;
    const {mytitle, mydescription, mycategory } = this.state;
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
            <Button transparent small info>
            <Text>{category}</Text></Button>
            <Text style={{fontWeight:"900"}}>{title}</Text>
              <Text>{description} </Text>
          </Body>
        </CardItem>
          </Right>
        </CardItem>
        <Body>
            <Text>
             {this.props.item.userid.name} posted sale on {dateString}
             </Text>
        </Body>
      </Card>
      {this.state.verified
      ?<Button transparent onPress={this.toogleModal}>
        <Text>Edit</Text>
      </Button>
      :null}


      <View>
      <Modal isVisible={this.state.isModalVisible}
            style={styles.modalStyle}>
            <View style={{ flex: 1, margin: 20 }}>
            <Form>
                <Item>
                    <Input placeholder="title"
                    label='title'
                    onChangeText={(mytitle) => this.setState({ mytitle })}
                    value={mytitle}
                        />
                </Item>
                <Item>
                    <Input placeholder="description"
                    label='description'
                    onChangeText={(mydescription) => this.setState({ mydescription })}
                    value={mydescription}
                        />
                </Item>
                <Item>
                    <Input placeholder="category"
                    label='category'
                    onChangeText={(mycategory) => this.setState({ mycategory })}
                    value={mycategory}
                        />
                </Item>
                </Form>   
                <View style={styles.modalButtons}>
                <Button transparent onPress={()=> this.toogleModal()}>
                  <Text>Cancel</Text>
                </Button>
                <Button transparent onPress={() => this.submitChanges() }>
                  <Text>Submit</Text>
                </Button>
                </View>
            </View>
            </Modal>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        item: state.saleItem,
        user: state.user
    }
}

export default connect(mapStateToProps)(ItemComponent);

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