import React, { Component } from 'react';
import { View, StyleSheet,
    TouchableOpacity,KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { Thumbnail, Form, Item, Input, Toast, Button, Text, Content,
     Icon, Container, Root } from 'native-base';
import { RNS3 } from 'react-native-aws3';
import { ImagePicker, Permissions } from 'expo';
import { myAccessKey, mySecretKey, awsPrefix } from './../../s3';
import v1 from 'uuid/v1';
import axios from 'axios';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            imageurl: '',
            bio: '',
            isModalVisible: false,
            uri: ''
        }
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
            keyPrefix: 'profile-images/',
            bucket: 'react-college',
            region: 'us-east-2',
            accessKey: myAccessKey,
            secretKey: mySecretKey,
            successActionStatus: 201
        }
        await RNS3.put(file, options)
        .progress((e) => console.log(e.loaded / e.total))
        .then((response) => {
            console.log(response.body)
            this.setState({
                imageurl: awsPrefix + response.body.postResponse.key
            });
            this.uploadImage(response.body.postResponse.key)
        }).catch((err) => { console.log(err) });
        } catch (error) {
        console.log(error);
        };
  };

  uploadImage = (imageurl) => {
    const { _id } = this.props.user;
    axios.put(`http://localhost:3000/user/${_id}/uploadImage`, {
        imageurl
    })
    .then(response => {
    if (response.status == 200) {
      console.log('response', response.data)
        this.props.updateUser(response.data.user)
    }
    else{
      console.log('upload error', response.data)
      Toast.show({
        text: response.data,
        duration: 3000
      })
    }
    })
    .catch( err => console.log(err));
    }

    toogleModal = () => {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        })
    }

    submitChanges = () => {
        const { _id } = this.props.user;
        const { name, email, bio } = this.state;
        axios.put(`http://localhost:3000/user/${_id}/editProfile`, {
        name, email, bio
    })
    .then(response => {
    if (response.status == 200) {
        console.log('response', response.data)
        this.setState({
            isModalVisible: false
        })
        Toast.show({
            text: 'account updated',
            duration: 3000,
            position: "bottom"
          })
    }
    else{
      console.log('upload error', response.data)
      Toast.show({
        text: response.data,
        duration: 3000
      })
    }
    })
    .catch( err => console.log(err));
    }

    async componentDidMount(){
        this.setState({
            name: this.props.user.name,
            email: this.props.user.email,
            bio: this.props.user.bio,
            uri: awsPrefix + this.props.user.imageurl
        })
    }

    render() {
        const { name, email, bio } = this.state;
        return (
            
            <Container style={styles.container}>
            <Root>
            <Content>
            <Button style={styles.editButton} transparent
                onPress={this.toogleModal}>
                <Text>Edit</Text>
            </Button>
                <TouchableOpacity style={styles.avatar} 
                    onPress={() => this.onChangePicture()}>
                    <Thumbnail style={styles.image} 
                    source= {{uri: awsPrefix + this.props.user.imageurl }}/>
                </TouchableOpacity>

            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.aboutText}>{email}</Text>
            {bio && (bio.length > 0)
                ?<Text style={{marginLeft: 10}}>
                   Bio: <Text style={styles.aboutText}>{bio} </Text>
                </Text>
                :null
            }              
            </Content>
            <View>
                <Modal isVisible={this.state.isModalVisible}
                style={styles.modalStyle}>
                <View style={{ flex: 1, margin: 20 }}>
                    <Form>
                    <Item>
                        <Input placeholder="name"
                        label='name'
                        onChangeText={(name) => this.setState({ name })}
                        value={name}
                        />
                    </Item>
                    <Item last>
                        <Input placeholder="email"
                        label='email'
                        onChangeText={(email) => this.setState({ email })}
                        value={email}
                        />
                    </Item>
                    <Item last>
                        <Input placeholder="tell your friends about you"
                        label='bio'
                        onChangeText={(bio) => this.setState({ bio })}
                        value={bio}
                        />
                    </Item>
                    </Form>   
                    <View style={styles.modalButtons}>
                        <Button transparent style={styles.modalButton}
                        onPress={this.toogleModal}>
                            <Text> Back </Text>
                        </Button>
                        <Button transparent style={styles.modalButton}
                        onPress={() => this.submitChanges()}>
                            <Text> Submit </Text>
                        </Button>
                    </View>
                </View>
                </Modal>
            </View>
            </Root>
            </Container>
    
    );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Profile);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
     avatar: {
        borderRadius: 60,
        borderWidth: 2,
        borderColor: "#fff",
        marginBottom: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 110
    },
    image: {    
        width:100,
        height: 100,
        margin: 4,
        borderRadius: 50,
    },
    nameText:{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold'
    },
    aboutText:{
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold'
    },
    editButton:{
        top: 5,
        right: 5,
        alignSelf: 'flex-end',
        position: 'absolute',
    },
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalButton:{
        color:'black', 
        fontSize:40,
        margin: 10
    }
});