import React, { Component } from 'react';
import { Icon, Header, Item, Input, Button,
     Text, Thumbnail, Left } from "native-base";
    import { StyleSheet, TouchableOpacity } from 'react-native';
import { awsPrefix } from './../../s3';
import { connect } from 'react-redux';


class TopSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        titleSearch: '',
        uri: ''
    };
    this.search = this.search.bind(this);
  }

  search(){
        const { titleSearch } = this.state;
        console.log('search', titleSearch);
    }
   

  render() {
    return (
        <Header searchBar style={{marginTop: -35}}>
        <TouchableOpacity onPress={() => this.props.gotoProfile()}>
          <Thumbnail small button style={{margin:5}}
          source={{uri: awsPrefix + this.props.user.imageurl }}/>
         </TouchableOpacity>
        <Item style={{borderRadius:5}}>
          <Input placeholder="Find item"
            label="titleSearch"
            onChangeText={(titleSearch) => this.setState({ titleSearch })}
            value={this.state.titleSearch}/>
        </Item>
        <Button transparent onPress={() => this.search()}>
            <Icon name="ios-search" />
          </Button>
      </Header>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(TopSearchBar);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
  });