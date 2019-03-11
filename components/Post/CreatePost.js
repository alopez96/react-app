import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {Container, Content, Form, Item,
    Textarea, Input, Icon, Thumbnail } from 'native-base';
import { RNS3 } from 'react-native-aws3';
import { ImagePicker, Permissions } from 'expo';
import { myAccessKey, mySecretKey, awsPrefix } from '../../s3';
import v1 from 'uuid/v1';
import axios from 'axios';

class CreatePost extends Component {

  constructor(props){
    super(props);
    this.state = {  
        category: '',
        description: '',
        imageurl: '',
        uri: 'https://facebook.github.io/react/logo-og.png'
    };
  }

  askPermissionsAsync = async () => {
    // await Permissions.askAsync(Permissions.CAMERA);
    Permissions.askAsync(Permissions.CAMERA_ROLL);
  };

useLibraryHandler = async () => {
    console.log('change image')
    await this.askPermissionsAsync();
    try {
    console.log('inside try')
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
        keyPrefix: 'post-images/',
        bucket: 'mentorsdb-images',
        region: 'us-west-2',
        accessKey: myAccessKey,
        secretKey: mySecretKey,
        successActionStatus: 201
    }
    await RNS3.put(file, options)
    .progress((e) => console.log(e.loaded / e.total))
    .then((response) => {
        console.log('image response', response);
        this.setState({
            imageurl: response.body.postResponse.key,
            uri: awsPrefix + response.body.postResponse.key,
        });
    }).catch((err) => { console.log(err) });
    } catch (error) {
    console.log(error);
    };
};

  cancelCreateEvent = () => {
    this.props.navigation.navigate('Home')
  }

  createEventAction = () => {
    console.log('create event action')

    axios.post('http://localhost:3000/post/create', {
      user: 'uid here',
      category: this.state.category,
      description: this.state.description,
      imageurl: this.state.imageurl,
      postDate: new Date()
    })
    .then(response => {
    if (response.status == 200) {
        console.log(response.data)
        this.setState({
          category: '',
          description: '',
          imageurl: ''
        })
        this.props.navigation.navigate('Home')
      }
      else{
        console.log('error', response.status)
      }
    })
    .catch( err => console.log(err));
  }

  render() {
      var { category, description } = this.state;
    return (
        <Container>
        <Content>
          <Form>
            <Item>
              <Input placeholder="category"
                        label='category'
                        onChangeText={(category) => this.setState({ category })}
                        value={category}/>
            </Item>
            <Textarea rowSpan={5} bordered placeholder="description"
                label="description" onChangeText={(description) => this.setState({ description })} 
                value={description}/>
          </Form>

          <Content>
            <TouchableOpacity onPress={this.useLibraryHandler}>
                <Thumbnail square large style={styles.cameraIcon}
                 source= {{uri: this.state.uri}}/>
            </TouchableOpacity>
          </Content>    

          <View style={styles.buttons}>
                <TouchableOpacity onPress={() => this.cancelCreateEvent()}>
                    <Icon name="ios-close-circle-outline"
                    style={styles.button}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.createEventAction() }>
                    <Icon name="ios-checkbox-outline"
                    style={styles.button}/>
                </TouchableOpacity>
            </View>
        </Content>
      </Container>
    );
  }
}



export default (CreatePost);


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