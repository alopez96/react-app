import React, { Component } from 'react';
import {Container, Content, Text, Header } from 'native-base';
import PostForm from './PostForm';


class CreatePost extends Component {

  constructor(props){
    super(props);
    this.state = { };
    this.gotoPosts = this.gotoPosts.bind(this);
  }
 
  gotoPosts() {
    this.props.navigation.navigate('Posts')
  }


  render() {
    return (
        <Container>
          <Header style={{marginTop: -35}}>
            <Text>Add New Post</Text>
          </Header>
        <Content>
          <PostForm gotoPosts={this.gotoPosts} />
        </Content>
      </Container>
    );
  }
}



export default (CreatePost);