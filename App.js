import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import store from './store';
import SwitchNavigation from './components/route';

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container} 
      forceInset={{'bottom': 'never'}}>
        <Provider store={store}> 
          <SwitchNavigation/>
        </Provider>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
});
