import React from 'react';
import { createStackNavigator, createAppContainer,
     createSwitchNavigator, createBottomTabNavigator } 
     from 'react-navigation';
import { Icon } from 'native-base';

import Login from './Login/Login';
import Signup from './SignUp/Signup';
import Home from './Home/Home';
import CreatePost from './Post/CreatePost';
import Welcome from './Welcome/Welcome';
import Interest from './Welcome/Interest';
import Sales from './Home/Sales';
import OpenForum from './Home/OpenForum';
import Profile from './Home/Profile';


export const AppBottomNavigator = createBottomTabNavigator({
    Home:{
        screen: Home,
            navigationOptions: {
                tabBarLabel: () => { },
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-home" size={40} color={tintColor} />
                ),
            }
    },
    Add:{
        screen: CreatePost,
            navigationOptions:{
                tabBarLabel: () => { },
                tabBarIcon: ( { tintColor }) => {
                    <Icon name="ios-add-circle" size={40} color={tintColor} />
                }
            }
    }
    
},  {
    order: ['Home', 'Add']
})

export const AppStackNavigator = createStackNavigator({
    WelcomeScreen: Welcome,
    InterestScreen: Interest,
    Main: AppBottomNavigator,
    SalesScreen: Sales,
    ForumScreen: OpenForum,
    ProfileScreen: Profile
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
