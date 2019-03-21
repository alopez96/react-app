import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, FlatList, View, Image,
  TouchableWithoutFeedback, RefreshControl, Dimensions, Animated } from 'react-native';
import { Container, Card, CardItem, Body, Icon, Content,
    Item, Input, Button, Text, Thumbnail, Left, Right } from "native-base";
import TopSearchBar from '../Home/TopSearchBar';
import axios from 'axios';
import { connect } from 'react-redux';
import { awsPrefix } from './../../s3';

const { height: HEIGHT } = Dimensions.get('window');
const CLUB_HEIGHT = HEIGHT / 4;


class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: false,
      scrollY: new Animated.Value(0),
     };
     this.gotoMenu = this.gotoMenu.bind(this);
    this.gotoProfile = this.gotoProfile.bind(this);
    this.getSales = this.getSales.bind(this);
    this.gotoCategory = this.gotoCategory.bind(this);
    this.onScrollMoveFooter = this.onScrollMoveFooter.bind(this)
  }

  gotoMenu(){
    this.props.navigation.navigate('MenuScreen');
  }

  gotoProfile(){
    this.props.navigation.navigate('ProfileScreen');
  }

  gotoItem(item, index){
    this.props.updateItem(item)
    this.props.updateItemIndex(index)
    this.props.navigation.navigate('ItemScreen');
  }

  componentDidMount(){
    this.getSales();
  }

  getSales(){
    const { schoolid } = this.props;
    this.setState({ loading: true })
    axios.get(`http://localhost:3000/getSales/${schoolid}`, {})
    .then(response => {
      if (response.status == 200) {
        this.setState({
          list: response.data,
          loading: false
        })
        this.props.updateSaleItems(response.data)
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

  gotoCategory(category){
    this.setState({
      list: [],
      loading: true
    })
    const { schoolid } = this.props;
    axios.get(`http://localhost:3000/getSalesCategory/${schoolid}/${category}`, {})
    .then(response => {
      if (response.status == 200) {
        this.setState({
          list: response.data
        })
        this.props.updateSaleItems(response.data)
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
    const { postDate, title, description, category, image } = item;
    const dateString = new Date(postDate).toString().substring(0, 10)
    return (
      <TouchableWithoutFeedback onPress={() => this.gotoItem(item, index)}
        style={{ flexDirection: 'row' }}>
        <View style={styles.eventContainer} >
          <Image style={styles.containerImage} source={{ uri: awsPrefix+image }} />
          <View style={{ margin: 10 }}>
            <Text allowFontScaling numberOfLines={1}
              style={styles.eventTitle}>{title}</Text>
            <Button transparent small style={styles.categoryButton}
             info onPress={() => this.gotoCategory(category)}>
              <Text>{category}</Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
      );
  }

  onScrollMoveFooter(event) {
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = currentOffset > this.offset ? 'down' : 'up'
    const distance = this.offset ? (this.offset - currentOffset) : 0
    const newPosition = this.state.scrollY._value - distance
    
    if (currentOffset > 0 && currentOffset < (this.contentHeight - this.scrollViewHeight)) { // Don't react at iOS ScrollView Bounce
      if (direction === 'down') {
        if (this.state.scrollY._value < 50) {
          this.state.scrollY.setValue(newPosition > 50 ? 50 : newPosition)
        }
      }
      if (direction === 'up') {
        if (this.state.scrollY._value >= 0) {
          this.state.scrollY.setValue(newPosition < 0 ? 0 : newPosition)
        }
      }
      this.offset = currentOffset
    }
  }

  render() {  
    return (
        <Container style={styles.container}>
          <Content>
          <ScrollView style={{marginTop:50, marginBottom:20}}
          refreshControl={<RefreshControl
          refreshing={this.state.loading}
          onRefresh={this.getSales}
          />}
          onContentSizeChange={(w, h) => { this.contentHeight = h }}
          onLayout={(ev) => { this.scrollViewHeight = ev.nativeEvent.layout.height }}
          onScroll={this.onScrollMoveFooter}
          scrollEventThrottle={16}>
              <FlatList
                data={this.props.saleList.slice(0, 10)}
                renderItem={this.renderList}
                horizontal={false}
                numColumns={2}
                keyExtractor={item => item._id}
                extraData={this.state}
              />
            </ScrollView>
            <Animated.View
            style={[
            styles.fixedHeader,
            { transform: [{ translateY: this.state.scrollY }] },
            ]}
            >
            <TopSearchBar gotoMenu={this.gotoMenu}
            gotoProfile={this.gotoProfile}/>
            </Animated.View>
            </Content>
        </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      schoolid: state.school,
      saleCategory: state.saleCategory,
      saleList: state.saleList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSaleItems: (saleList) => dispatch({
      type: 'SALE_LIST',
      payload: {
        saleList
      }
    }),
    updateItem: (saleItem) => dispatch({
      type: 'SALE_ITEM',
      payload: {
        saleItem
      }
    }),
    updateItemIndex: (itemIndex) => dispatch({
      type: 'ITEM_INDEX',
      payload: {
        itemIndex
      }
    }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sales);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
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
    categoryButton: {
      fontSize: 14,
      alignSelf: 'center'
    },
    fixedHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 50,
    }
  });