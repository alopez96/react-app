import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, View, Image,
  TouchableWithoutFeedback, RefreshControl, Dimensions, Animated } from 'react-native';
import { Container, Content, Button, Text, Card, CardItem, Thumbnail, Body, Left } from "native-base";
import axios from 'axios';
import { connect } from 'react-redux';
import { awsPrefix } from './../../s3';

const { height: HEIGHT } = Dimensions.get('window');
const CLUB_HEIGHT = HEIGHT / 4;

class OpenForum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      username: '',
      userimage: ''
    };
  }
  
  //click listener for card -> go to PostComponent
  gotoPost(post, index){
    //mapDispatchToProps to select specific post
    this.props.updatePost(post)
    this.props.postIndex(index)
    //go to PostComponent
    this.props.navigation.navigate('PostScreen');
  }

  componentDidMount(){
    this.getPosts();
  }

  getPosts(){
    const { schoolid } = this.props;
    this.setState({ loading: true })
    axios.get(`http://localhost:3000/getPosts/${schoolid}`, {})
    .then(response => {
      if (response.status == 200) {
        this.setState({
          list: response.data,
          loading: false
        })
        this.props.updatePostList(response.data)
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

  //handle post variables, and render
  renderList = ({item, index}) => {
    if (!item) {
      return null;
    }
    var newPost = false
    if(item.post){
      item = item.post;
      newPost = true;
    }
    const { postDate, body, imageurl, likeList } = item;
    //if user just added post, name and image wont be in object
    if(typeof(item.user) == 'string'){
      //get user info
      axios.get(`http://localhost:3000/getUser/${item.user}`, {})
      .then(response => {
        if (response.status == 200) {
          //convert user string to object
          item.user = {
            name: response.data.name,
            imageurl: response.data.imageurl
          }
          //above not working, saving value in string
          this.setState({
            username: response.data.name,
            userimage: response.data.imageurl
          })
        }
        else{
          console.log('error', response.data)
        }
      })
      .catch( err => console.log(err));
    }
    //return the card display
    const dateString = new Date(postDate).toString().substring(0, 10)
    return (
      <TouchableOpacity onPress={() => this.gotoPost(item, index)}>
      <Card>
        <CardItem>
          <Left>
            <TouchableWithoutFeedback>
            {!newPost
            ?<Thumbnail
              source= {{uri: awsPrefix+item.user.imageurl}}/>
            :<Thumbnail
            source= {{uri: awsPrefix+this.state.userimage}}/>
            }
            </TouchableWithoutFeedback>
            <Body>
              {!newPost
              ?<Text style={{fontWeight:"700"}}> {item.user.name} </Text>
              :<Text style={{fontWeight:"700"}}> {this.state.username} </Text>
              }
              <Text note>• {dateString} </Text>
            </Body>
          </Left>
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
          <Body style={{height:100, width:null, flex:1}}>
            <Text style={styles.eventTitle}>{body}</Text>
          </Body>
        </CardItem>
        <View  style={{ borderBottomColor:'#c0c0c0', borderBottomWidth:1}}>
          </View>
      </Card>
      </TouchableOpacity>
      );
  }

  render() {
    return (
      <Container style={styles.container}>
          <Content>
          <ScrollView
          refreshControl={<RefreshControl
          refreshing={this.state.loading}
          onRefresh={this.getPosts}
          />}
          onContentSizeChange={(w, h) => { this.contentHeight = h }}
          onLayout={(ev) => { this.scrollViewHeight = ev.nativeEvent.layout.height }}
          onScroll={this.onScrollMoveFooter}
          scrollEventThrottle={16}>
              <FlatList
                data={this.props.postList.slice(0, 10)}
                renderItem={this.renderList}
                horizontal={false}
                numColumns={1}
                keyExtractor={item => item._id}
                extraData={this.state}
              />
            </ScrollView>
            </Content>
        </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      postList: state.postList,
      schoolid: state.school
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePostList: (postList) => dispatch({
      type: 'POST_LIST',
      payload: {
        postList
      }
    }),
    updatePost: (post) => dispatch({
      type: 'SELECT_POST',
      payload: {
        post
      }
    }),
    postIndex: (index) => dispatch({
      type: 'POST_INDEX',
      payload: {
        index
      }
    }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (OpenForum);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    eventContainer: {
      flex: 1,
      height: CLUB_HEIGHT,
      position: 'relative',
      backgroundColor: '#fff',
      marginTop: 20,
      marginRight: 5,
      marginLeft: 5,
      borderRadius: 5,
    },
    containerImage: {
      alignItems: 'center',
      borderColor: '#d6d7da',
      flex: 1,
      borderRadius: 5,
    },
    eventTitle: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
      textAlignVertical: 'center'
    },
    categoryButton: {
      fontSize: 14,
      alignSelf: 'center'
    }
  });