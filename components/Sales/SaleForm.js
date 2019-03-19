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

class SaleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        category: '',
        title: '',
        description: '',
        school: '',
        imageurl: '',
        sold: false,
        uri: 'https://facebook.github.io/react/logo-og.png'
    };
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
                imageurl: response.body.postResponse.key,
                uri: awsPrefix + response.body.postResponse.key,
            });
        }).catch((err) => { console.log(err) });
    } catch (error) {
    console.log(error);
    };
};

verifyInput = () => {
    const { category, title, description } = this.state;
    let errors = [];
    if (category.length == 0){
        errors.push('Category must not be blank')
    }
    if (title.length == 0){
        errors.push('Title must not be blank')
    }
    if (description.length == 0){
        errors.push('Description must not be blank')
    }
    if (Object.keys(errors).length == 0){
        this.createEventAction();
    }
    else {
        console.log(errors)
        Toast.show({
            text: errors.toString(),
            duration: 3000
        })
  }
}

createEventAction = () => {
    const { category, title, description, imageurl } = this.state;
    axios.post('http://localhost:3000/newSale', {
        category,
        title,
        description,
        image: imageurl,
        schoolid: this.props.school,
        userid: this.props.user._id,
        postDate: new Date(),
        lastDateEdit: new Date(),
        sold: false
    })
    .then(response => {
    if (response.status == 200) {
        this.setState({
            category: '',
            title: '',
            description: ''
        })
        this.props.gotoSales();
        }
        else{
        console.log('error', response.status)
        }
    })
    .catch( err => console.log(err));
}

  render() {
      const { category, title, description } = this.state;
    return (
        <Content>
        <Root>
        <Form>
        <Item>
          <Input placeholder="category"
                    label='category'
                    onChangeText={(category) => this.setState({ category })}
                    value={category}/>
        </Item>
        <Item>
          <Input placeholder="title"
                    label='title'
                    onChangeText={(title) => this.setState({ title })}
                    value={title}/>
        </Item>
        <Textarea rowSpan={5} bordered placeholder="description"
            label="description" 
            onChangeText={(description) => this.setState({ description })} 
            value={description}/>
      </Form>
      <Content>
            <TouchableOpacity onPress={this.useLibraryHandler}>
                <Thumbnail square large style={styles.cameraIcon}
                 source= {{uri: this.state.uri}}/>
            </TouchableOpacity>
        </Content>   
        <View style={styles.buttons}>
        <TouchableOpacity onPress={() => this.props.gotoSales()}>
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
        school: state.school
    }
}

export default connect(mapStateToProps)(SaleForm);

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