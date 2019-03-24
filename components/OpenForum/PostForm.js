import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Content, Form, Item, Root, Toast,
    Textarea, Input, Icon, Thumbnail } from 'native-base';
import { RNS3 } from 'react-native-aws3';
import { connect } from 'react-redux';
import { ImagePicker, Permissions } from 'expo';
import { myAccessKey, mySecretKey, awsPrefix } from '../../s3';
import v1 from 'uuid/v1';
import axios from 'axios';

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        body: '',
        imageurl: '',
        uri: 'https://facebook.github.io/react/logo-og.png'
    };
    this.createPostAction = this.createPostAction.bind(this);
  }

  askPermissionsAsync = async () => {
    // await Permissions.askAsync(Permissions.CAMERA);
    Permissions.askAsync(Permissions.CAMERA_ROLL);
  };

useLibraryHandler = async () => {
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
                uri: awsPrefix + response.body.postResponse.key,
            });
        }).catch((err) => { console.log(err) });
    } catch (error) {
    console.log(error);
    };
};

verifyInput = () => {
    const { body } = this.state;
    let errors = [];
    if (body.length == 0){
        errors.push('Post cannot be blank')
    }
    if (Object.keys(errors).length == 0){
        this.createPostAction();
    }
    else {
        console.log(errors)
        Toast.show({
            text: errors.toString(),
            duration: 3000
        })
  }
}

createPostAction = () => {
    const { body, imageurl } = this.state;
    axios.post('http://localhost:3000/newPost', {
        body, imageurl,
        school: this.props.school,
        user: this.props.user._id,
        postDate: new Date()
    })
    .then(response => {
    if (response.status == 200) {
        this.setState({
            body: ''
        })
        this.props.postList.push(response.data)
        this.props.updatePostList(this.props.postList)
        this.props.gotoPosts();
    }
    else{
        console.log('error', response)
    }
    })
    .catch( err => console.log(err));
}

  render() {
      const { body } = this.state;
    return (
        <Content>
        <Root>
        <Form>
        <Textarea rowSpan={10} bordered placeholder="What would you like to share?"
            label="body" 
            onChangeText={(body) => this.setState({ body })} 
            value={body}/>
      </Form>
      <Content>
            <TouchableOpacity onPress={this.useLibraryHandler}>
                <Thumbnail square large style={styles.cameraIcon}
                 source= {{uri: this.state.uri}}/>
            </TouchableOpacity>
        </Content>   
        <View style={styles.buttons}>
        <TouchableOpacity onPress={() => this.props.gotoPosts()}>
            <Icon name="ios-close-circle-outline"
            style={styles.button}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.verifyInput() }>
                <Icon name="ios-checkbox-outline"
                style={styles.button}/>
        </TouchableOpacity>
        </View>
    </Root>
    </Content>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        school: state.school,
        postList: state.postList
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

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);

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