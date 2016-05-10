import buffer from 'buffer';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';

const authKey = 'auth';
const userKey = 'user';

class AuthService {
  getAuthInfo(cb) {
    AsyncStorage.multiGet([authKey, userKey], (err, val) => {
      if(err) return cb(err);
      if(!val) return cb();

      let zippedObj = _.zipObject(val);

      if(!zippedObj[authKey]) return cb();

      let authInfo = {
        header: {
          Authorization: 'Basic ' + zippedObj[authKey]
        },
        user: JSON.parse(zippedObj[userKey])
      }

      return cb(null, authInfo);
    });
  }

  login(creds, cb) {
    let {username, password} = creds;
    let b = new buffer.Buffer(`${username}:${password}`);
    let encodedAuth = b.toString('base64');

    fetch('https://api.github.com/user', {
      headers: { 'Authorization': 'Basic ' + encodedAuth }
    })
    .then(res => {
      if(res.status >= 200 && res.status < 300) return res;
      
      throw {
        badCredentials: res.status == 401,
        unknownError: res.status != 401
      }
    })
    .then(res => {
      return res.json();
    })
    .then(results => {
      AsyncStorage.multiSet([
        [authKey, encodedAuth],
        [userKey, JSON.stringify(results)]
      ], (err) => {
        if(err) throw err;
        return cb({success: true});
      })
    })
    .catch(err => {
      return cb(err);
    })
  }
}

export default new AuthService();
