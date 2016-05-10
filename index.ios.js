import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS
} from 'react-native';
import Login from './Login';
import AuthService from './AuthService';

class GithubBrowser extends Component {
  constructor(props, context) {
    super(props);
    this.state = { isLoggedIn: false, checkingAuth: true }
  }

  componentDidMount() {
    AuthService.getAuthInfo((err, authInfo) => {
      this.setState({
        checkingAuth: false, 
        isLoggedIn: !!authInfo})
    });
  }

  render() {
    const { checkingAuth, isLoggedIn } = this.state;

    if(checkingAuth) {
      return (
        <View style={styles.container}>
          <ActivityIndicatorIOS
            animating={true}
            size="large"
            style={styles.loader} />
        </View>
      );
    }

    if(isLoggedIn) {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Logged In</Text>
        </View>
      );
    } else {
      return <Login onLogin={this.onLogin}/>;
    }
  }

  onLogin = () => {
    this.setState({isLoggedIn: true});
    console.log('successfully logged in, can show different view');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('GithubBrowser', () => GithubBrowser);
