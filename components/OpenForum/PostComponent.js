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

import PostForm from './PostForm';

//PostComponent displays the item selected, and lets verified user edit
class PostComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      imageurl: '',
      uri: '',
      postDate: '',
      editDate: '',
      isModalVisible: false,
      imageUpdating: false,
      verified: false,
      showDeleteButton: false
    };
    this.deletePost = this.deletePost.bind(this);
    this.onChangePicture = this.onChangePicture.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.gotoPosts = this.gotoPosts.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.showDelete = this.showDelete.bind(this);
  }

  showDelete(){
    this.setState({ showDeleteButton: true })
  }

  gotoPosts(){
    this.setState({
      isModalVisible: false
  })
    this.props.navigation.navigate('ForumScreen')
  }

  toggleModal = () => {
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
      keyPrefix: 'posts/',
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
          imageurl: response.body.postResponse.key,
          uri: awsPrefix + response.body.postResponse.key
        });
        this.submitChanges();
    }).catch((err) => { console.log(err) });
    } 
    catch (error) { console.log(error) };
    };


  submitChanges = () => {
    const { _id } = this.props.post;
    const { body, imageurl } = this.state;
    const userid = this.props.post.user._id;
    const editDate = new Date();
    if(this.props.user._id != this.props.post.user._id){
        console.log('user does not have permission to edit')
    }
    else{
        axios.put(`http://localhost:3000/editPost/${_id}`, {
          user,
          body,
          imageurl, 
          lastEditDate
        })
        .then(post => {
            if(post){
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


  deletePost(){
    const { _id } = this.props.post;
    const user = this.props.post.user._id;
    if(this.props.user._id != this.props.post.user._id){
        console.log('user does not have permission to delete')
    }
    else{
        axios.put(`http://localhost:3000/deletePost/${_id}`, {
          user
        })
        .then(post => {
            if(post){
                this.setState({ 
                    isModalVisible: false
                })
                //remove the post at index
                const { index } = this.props;
                this.props.postList.splice(index, 1)
                this.props.updatePostList(this.props.postList)
                //go to main screen, OpenForum.js
                this.props.navigation.navigate('ForumScreen')
            }
            else{
                console.log('error updating user')
            }
            })
        .catch( err => console.log(err));
    }
  }


  componentDidMount(){
    const { body, imageurl, postDate, editDate } = this.props.post;
    this.setState({
        body, imageurl, postDate, editDate
    })
    //check userid for access to edit
    if(this.props.user._id == this.props.post.user._id){
      this.setState({ verified: true })
    }
  }

  render() {
    const { imageurl, body, postDate, editDate } = this.state;
    const dateString = new Date(postDate).toString().substring(0, 10)
    return (
      <View>
      <Card>
        <CardItem>
          <Left>
            <TouchableWithoutFeedback>
            <Thumbnail
              source= {{uri: awsPrefix+this.props.user.imageurl}}/>
            </TouchableWithoutFeedback>
            <Body>
            <Text style={{fontWeight:"700"}}> {this.props.user.name} </Text>
              <Text note>• {dateString} </Text>
            </Body>
          </Left>
        </CardItem>
        {imageurl.length > 10
        ?<CardItem cardBody>
        <TouchableWithoutFeedback onPress={() => this.gotoPost(item)}>
        <Thumbnail square style={{height:200, width:null, flex:1}}
         source={{ uri: awsPrefix+imageurl }}/>
         </TouchableWithoutFeedback>
        </CardItem>
        :null}
        <CardItem>
          <Body style={{height:100, width:null, flex:1}}>
            <Text style={styles.eventTitle}>{body}</Text>
          </Body>
        </CardItem>
        <View  style={{ borderBottomColor:'#c0c0c0', borderBottomWidth:1}}>
          </View>
      </Card>
      {this.state.verified
      ?<View>
      <Button transparent onPress={this.toggleModal}>
        <Text>Edit</Text>
      </Button>
      <Button transparent danger onPress={this.showDelete}>
        <Text>Delete</Text>
      </Button>
      </View>
      :null}
      {this.state.showDeleteButton
      ?<Button danger onPress={this.deletePost}
      style={{margin:5}}>
        <Text>Delete!</Text>
      </Button>
      :null
      }


      <View>
      <Modal isVisible={this.state.isModalVisible}
            style={styles.modalStyle}>
            <PostForm edit={true}
            gotoPosts={this.gotoPosts}
            toggleModal={this.toggleModal}/>
            </Modal>
        </View>
      </View>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    updatePostList: (postList) => dispatch({
        type: 'POST_LIST',
        payload: {
          postList
        }
      })
  }
}

const mapStateToProps = (state) => {
    return {
        post: state.post,
        user: state.user,
        postList: state.postList,
        index: state.index
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostComponent);

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