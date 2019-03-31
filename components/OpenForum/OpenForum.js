import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, View, Image,
  TouchableWithoutFeedback, RefreshControl, Dimensions, Animated } from 'react-native';
import { Container, Content, Button, Text, Card, CardItem, Thumbnail,
  Icon, Body, Left } from "native-base";
import axios from 'axios';
import { connect } from 'react-redux';
import { awsPrefix } from './../../s3';

const { height: HEIGHT } = Dimensions.get('window');
const CLUB_HEIGHT = HEIGHT / 4;

class OpenForum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleLike = this.handleLike.bind(this);
  }

  handleLike(post, user, index){
    //get postList from store
    var newList = this.props.postList

    if(newList[index].likeList){
      //check if the user has already liked
      var hasLiked = newList[index].likeList.includes(this.props.user._id)
      //user has already liked, so unlike
      if(hasLiked){
        //remove user from likeList array
        newList[index].likeList
          .splice(newList[index].likeList
          .findIndex(e => e == this.props.user._id),1)
        //update the postList
        this.props.postList.splice(index, 1, newList[index])
        //trigger dispatch to updateList
        this.props.updatePostList(this.props.postList)
      }
      //user has not liked, so like
      else{
        //add user to array
        newList[index].likeList.splice(0, 0, this.props.user._id)
        //update the postList
        this.props.postList.splice(index, 1, newList[index])
        //trigger dispatch to updateList
        this.props.updatePostList(this.props.postList)
      }
    }

    //update the likeList on db
    axios.put(`http://localhost:3000/likePost/${post._id}`, {
      user: this.props.user._id
    })
    .then(response => {
      if (response.status == 200) {
        
      }
      else{
        console.log('error', response.data)
      }
    })
    .catch( err => console.log(err));
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
    //get the list of posts from db
    axios.get(`http://localhost:3000/getPosts/${schoolid}`, {})
    .then(response => {
      if (response.status == 200) {
        this.setState({
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

  //handle variables, and render method of each card
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
    
    //declare varaibles
    var hasLiked
    var likeCount

    //check if the user has already liked
    if(likeList){
      hasLiked = likeList.includes(this.props.user._id)
      //get count of likes
      likeCount = likeList.length
    }
  
    //return the card display
    const dateString = new Date(postDate).toString().substring(0, 10)
    return (
      <TouchableOpacity onPress={() => this.gotoPost(item, index)}>
      <Card>
        <CardItem>
          <Left>
            <TouchableWithoutFeedback>
            {newPost
            ?<Thumbnail
              source= {{uri: awsPrefix+this.props.user.imageurl}}/>
            :<Thumbnail
            source= {{uri: awsPrefix+item.user.imageurl}}/>
            }
            </TouchableWithoutFeedback>
            <Body>
              {newPost
              ?<Text style={{fontWeight:"700"}}> {this.props.user.name} </Text>
              :<Text style={{fontWeight:"700"}}> {item.user.name} </Text>
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
          <Body style={{height:100, width:null, flex:1, 
          justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.eventTitle}>{body}</Text>
          </Body>
        </CardItem>
        <CardItem>
        {hasLiked
        ?<Icon onPress={() => this.handleLike(item, item.user, index)}
        name="ios-heart" style={{marginLeft: 50, color:'red', marginBottom: 5,}}/>
        :<Icon onPress={() => this.handleLike(item, item.user, index)}
        name="ios-heart" style={{marginLeft: 50, marginBottom: 5,}}/>
        }
        {likeCount
        ?<Text style={{marginBottom: 6}} >{likeCount}</Text>
        :null
        } 
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
      //get list of posts from store
      postList: state.postList,
      //get the id of the school from store
      schoolid: state.school,
      //get the user object from store
      user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    //used to update list of posts, pass array of posts
    updatePostList: (postList) => dispatch({
      type: 'POST_LIST',
      payload: {
        postList
      }
    }),
    //used to select post, pass single post object
    updatePost: (post) => dispatch({
      type: 'SELECT_POST',
      payload: {
        post
      }
    }),
    //used to update the index value of the post selected, pass single num value
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
      fontSize: 20,
      textAlign: 'center'
    },
    categoryButton: {
      fontSize: 14,
      alignSelf: 'center'
    }
  });