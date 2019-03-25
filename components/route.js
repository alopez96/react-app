import React from 'react';
import { createStackNavigator, createAppContainer,
     createSwitchNavigator, createBottomTabNavigator } 
     from 'react-navigation';
import { Icon } from 'native-base';

import Login from './Login/Login';
import Signup from './Login/Signup';
import Home from './Home/Home';
import CreateSaleItem from './Sales/CreateSaleItem';
import Welcome from './Welcome/Welcome';
import Interest from './Welcome/Interest';
import Sales from './Sales/Sales';
import Menu from './Sales/Menu';
import ItemComponent from './Sales/ItemComponent';
import OpenForum from './OpenForum/OpenForum';
import CreatePost from './OpenForum/CreatePost';
import PostComponent from './OpenForum/PostComponent';
import Profile from './Home/Profile';



export const SalesBottomNavigator = createBottomTabNavigator({
    Sales:{
        screen: Sales,
            navigationOptions: {
                tabBarLabel: () => { },
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-home" size={40} color={tintColor} />
                ),
            }
    },
    Add:{
        screen: CreateSaleItem,
            navigationOptions: {
                tabBarLabel: () => { },
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-add" size={40} color={tintColor} />
                ),
            }
    },
},  {
    order: ['Sales', 'Add']
})

export const PostsBottomNavigator = createBottomTabNavigator({
    Posts:{
        screen: OpenForum,
            navigationOptions: {
                tabBarLabel: () => { },
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-home" size={40} color={tintColor} />
                ),
            }
    },
    Add:{
        screen: CreatePost,
            navigationOptions: {
                tabBarLabel: () => { },
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-add" size={40} color={tintColor} />
                ),
            }
    },
},  {
    order: ['Posts', 'Add']
})

export const AppStackNavigator = createStackNavigator({
    WelcomeScreen: Welcome,
    InterestScreen: Interest,
    Main: Home,
    SalesScreen: SalesBottomNavigator,
    ForumScreen: PostsBottomNavigator,
    ProfileScreen: Profile,
    ItemScreen: ItemComponent,
    PostScreen: PostComponent,
    MenuScreen: Menu
})


export const SwitchNavigation = createSwitchNavigator({
    LoginScreen: {
        screen: Login
    },
    SignupScreen: {
        screen: Signup
    },
    AppScreen: {
        screen: AppStackNavigator
    },
});


export default createAppContainer(SwitchNavigation);
