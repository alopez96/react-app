import React, { Component } from 'react';
import { FlatList, ScrollView, RefreshControl, TouchableWithoutFeedback,
  View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';

const { height: HEIGHT } = Dimensions.get('window');
const CLUB_HEIGHT = HEIGHT / 4;

class CCs extends Component {
  constructor(props) {
    super(props);
    this.state = {
        school: undefined,
        category: 'CC',
        list: []
    };
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value) {
    this.setState({
        school: value
      });
      this.props.updateSchoolType(value)
      this.props.selectSchool(value)
  }

  componentDidMount(){
    const { category } = this.state;
    axios.get(`http://localhost:3000/getSchool/${category}`, {
    
    })
    .then(response => {
    if (response.status == 200) {
      this.setState({
        list: response.data
      })
    }
    else{
      console.log('login error', response.data)
      Toast.show({
        text: response.data,
        duration: 3000
      })
    }
    })
    .catch( err => console.log(err));
  }

  renderList = ({item}) => {
    if (item.empty) {
      return null;
    }
    return (
      <TouchableWithoutFeedback onPress={() => this.onValueChange(item.name)}
        style={{ flexDirection: 'row' }}>
        <View style={styles.eventContainer} >
          <Image style={styles.containerImage} source={{ uri: item.image }} />
          <View style={{ margin: 10 }}>
            <Text allowFontScaling numberOfLines={1}
              style={styles.eventTitle}> {item.name}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>);
  }

  render() {
    return (
      <View>
      <ScrollView 
        refreshControl={<RefreshControl
        refreshing={this.state.loading}
        onRefresh={this.getUserClubs}/>}
      >
        <FlatList
          data={this.state.list.slice(0, 40)}
          renderItem={this.renderList}
          horizontal={false}
          numColumns={2}
          keyExtractor={school => school._id}
          extraData={this.state}
        />
      </ScrollView>
    </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
      updateSchoolType: (school) => dispatch({
        type: 'SCHOOL_TYPE',
        payload: {
          school
        }
      })
    }
}
  
  
export default connect(null, mapDispatchToProps)(CCs);

const styles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    height: CLUB_HEIGHT,
    position: 'relative',
    backgroundColor: '#e8e8e8',
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
  row: {
    flex: 1,
    flexDirection: 'row'
  },
});