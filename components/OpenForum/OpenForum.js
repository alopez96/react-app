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
      list: []
    };
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

  renderList = ({item, index}) => {
    if (!item) {
      return null;
    }
    const { postDate, body, imageurl, likeList, user } = item;
    const dateString = new Date(postDate).toString().substring(0, 10)
    return (
      <Card>
        <CardItem>
          <Left>
            <TouchableOpacity onPress={() => this.props.userClicked(userid)}>
            <Thumbnail
              source= {{uri: awsPrefix+user.imageurl}}/>
            </TouchableOpacity>
            <Body>
              <Text style={{fontWeight:"700"}}> {user.name} </Text>
              <Text note>• {dateString} </Text>
            </Body>
          </Left>
        </CardItem>
        {imageurl.length > 10
        ?<CardItem cardBody>
        <TouchableWithoutFeedback onPress={() => this.gotoItem(item, index)}>
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
    updateItem: (post) => dispatch({
      type: 'SELECT_POST',
      payload: {
        post
      }
    })
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