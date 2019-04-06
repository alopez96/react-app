import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, View, Image,
    TouchableWithoutFeedback, RefreshControl, Dimensions, Animated } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { Thumbnail, Form, Item, Input, Toast, Button, Text, Content,
     Icon, Container, Root, Card, CardItem, Body } from 'native-base';
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
            uri: '',
            verified: false,
            loading: false,
            posts: []
        }
        this.fetchUser = this.fetchUser.bind(this);
        this.viewItems = this.viewItems.bind(this);
        this.viewPosts = this.viewPosts.bind(this);
    }

    viewPosts(){
        const { _id } = this.props.post.user;
        axios.get(`http://localhost:3000/userPosts/${_id}`, {})
        .then(response => {
        if (response.status == 200) {
            this.setState({posts: response.data})
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

    //render list of posts (this.state.posts)
    renderPostList = ({item, index}) => {
        //descture each post
        const { postDate, body, imageurl } = item;
        //convert date to readable string
        const dateString = new Date(postDate).toString().substring(0, 10)
        return (
            <TouchableWithoutFeedback>
            <Card>
                <CardItem>
                    <Text note>• {dateString}</Text>
                </CardItem>
                {imageurl.length > 10
                ?<CardItem cardBody>
                <TouchableWithoutFeedback>
                <Thumbnail square style={{height:200, width:null, flex:1}}
                source={{ uri: awsPrefix+imageurl }}/>
                </TouchableWithoutFeedback>
                </CardItem>
                :null}
                <CardItem>
                <Body style={{marginTop:10, marginBottom:10, width:null, flex:1, 
                justifyContent: 'center', alignItems: 'center'}}>
                    <Text>{body}</Text>
                </Body>
                </CardItem>
            </Card>
            </TouchableWithoutFeedback>
        );
    }

    viewItems(){
        console.log('view items')
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

    fetchUser(){
        const { _id } = this.props.post.user;
        axios.get(`http://localhost:3000/getUser/${_id}`, {})
        .then(response => {
        if (response.status == 200) {
            this.setState({
                name: response.data.name,
                email: response.data.email,
                bio: response.data.bio,
                uri: awsPrefix +  response.data.imageurl
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
        //fetch user from db
        this.fetchUser();
        
        //check if post.user is the user logged in
        if(this.props.post.user._id == this.props.user._id){
            this.setState({ verified: true })
        }
        else{
            this.setState({ verified: false })
        }
    }

    render() {
        const { name, email, bio, verified } = this.state;
        return (
            
            <Container style={styles.container}>
            <Root>
            <Content>
                {verified
                ?<Button style={styles.editButton} transparent
                onPress={this.toogleModal}>
                <Text>Edit</Text>
                </Button>
                :null}
                <TouchableOpacity style={styles.avatar} 
                    onPress={() => this.onChangePicture()}>
                    <Thumbnail style={styles.image} 
                    source= {{uri: awsPrefix + this.props.post.user.imageurl }}/>
                </TouchableOpacity>
                <View style={{flexDirection: 'column'}}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.aboutText}>{email}</Text>
                {bio && (bio.length > 0)
                    ?<Text style={{marginLeft: 10}}>
                    Bio: <Text style={styles.aboutText}>{bio} </Text>
                    </Text>
                    :null
                }    
                </View>          
                </Content>

                <Content>
                <View >
                <View style={styles.bottomHalf}>
                        <Button style={styles.mainButtons}
                        onPress={this.viewPosts}>
                            <Text>Posts</Text>
                        </Button>
                        <Button style={styles.mainButtons}
                        onPress={this.viewItems}>
                            <Text>Items</Text>
                        </Button>
                        </View>
                    </View>
                
                    <View style={styles.modalButtons}>
                    <Content>
                    <ScrollView
                    refreshControl={<RefreshControl
                    refreshing={this.state.loading}
                    onRefresh={this.viewItems}
                    />}
                    >
                        <FlatList
                            data={this.state.posts.slice(0, 10)}
                            renderItem={this.renderPostList}
                            horizontal={false}
                            numColumns={1}
                            keyExtractor={item => item._id}
                            extraData={this.state}
                        />
                        </ScrollView>
                        </Content>
                        <View>
                            <Text>Left</Text>
                        </View>
                            
                    </View>             
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
        user: state.user,
        post: state.post
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      updateUser: (user) => dispatch({
        type: 'LOAD_USER',
        payload: {
          user
        }
      })
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

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
    },
    mainButtons:{
        fontSize:40,
        margin: 10,
        width: 100,
        justifyContent: 'center'
    },
    bottomHalf:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});