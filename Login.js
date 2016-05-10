'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS
} from 'react-native';
import buffer from 'buffer';

export default class Login extends Component {
  constructor(props, context) {
    super(props);
    this.state = { showProgress: false }
  }

  render() {
    var errorCtrl = <View />;

    if(this.state.badCredentials) {
      errorCtrl = <Text style={styles.error}>
          That username and password combination did not work
        </Text>;
    }

    if(this.state.unknownError) {
      errorCtrl = <Text style={styles.error}>
          We experienced an unexpected issue
        </Text>;
    }

    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('image!Octocat')} />
        <Text style={styles.heading}>Github Browser</Text>
        <TextInput 
          style={styles.input} 
          autoCapitalize={('none')} 
          autoCorrect={false} 
          placeholder="Github username" 
          onChangeText={(text) => this.setState({username: text})} />
        <TextInput 
          style={styles.input} 
          placeholder="Github password" 
          secureTextEntry={true} 
          onChangeText={(text) => this.setState({password: text})} />

        <TouchableHighlight style={styles.button} onPress={this.onLoginPressed}>
          <Text style={styles.buttonText}>
            Log In 
          </Text> 
        </TouchableHighlight>

        {errorCtrl}

        <ActivityIndicatorIOS
          animating={this.state.showProgress}
          size="large" 
          style={styles.loader} />
      </View>
    );
  }

  onLoginPressed = () => {
    this.setState({showProgress: true});
    let { username, password } = this.state;

    let authService = require('./AuthService').default;
    authService.login({username, password}, (results) => {
      this.setState(Object.assign({ showProgress: false }, results));

      if(results.success && this.props.onLogin) {
        this.props.onLogin();
      }
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 40,
    alignItems: 'center',
    padding: 10
  },
  logo: {
    width: 66,
    height: 55
  },
  heading: {
    fontSize: 30,
    marginTop: 10
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  loader: {
    marginTop: 20
  },
  error: {
    color: 'red',
    paddingTop: 10,
    fontSize: 12
  }
});
