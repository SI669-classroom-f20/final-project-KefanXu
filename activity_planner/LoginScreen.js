import React from 'react';
import { TextInput, Text, View, 
  Image, TouchableOpacity, KeyboardAvoidingView, Alert, LayoutAnimation} 
  from 'react-native';

import {loginStyles} from './Styles';
import { getDataModel } from './DataModel';

export class LoginScreen extends React.Component {
  
  constructor(props) {
    super(props);

    

    this.state = {
      mode: 'login',
      emailInput: '',
      displayNameInput: '',
      passwordInput: '',
      passwordCheckInput: ''
    }

  }
  componentDidMount = () => {
    this.dataModel = getDataModel();
  }
  
  onLogin = () => {
    let users = this.dataModel.getUsers();
    console.log(users);
    let userName = this.state.displayNameInput;
    let email = this.state.emailInput;
    let pass = this.state.passwordInput;

    for (let user of users) {
      if (user.email === email && user.displayName === userName) {
        if (user.password === pass) {
          // success!
          console.log("login user",user);
          this.props.navigation.navigate("Plan Your Day", {
            currentUser: user
          });
          return;
        }
      }
    }
    Alert.alert(
      'Login Failed',
      'No match found for this email and password.',
      [{ text: 'OK',style: 'OK'}]
    );

  }
  onRegist = async () => {
    let users = this.dataModel.getUsers();

    for (let user of users) {
      if (user.email === this.state.emailInput) {
        console.log("found matching user");
        Alert.alert(
          'Duplicate User',
          'User ' + this.state.emailInput + ' already exists.',
          [{ text: 'OK',style: 'OK'}]
        );
        return;
      } 
    }
    let newUser = await this.dataModel.createUser(
      this.state.emailInput,
      this.state.passwordInput,
      this.state.displayNameInput
    ); 
    let updatedActivityList = []
    let initKey = 0;
    for (let activity of newUser.activities) {
      let updatedActivity = {
        name:activity,
        key:initKey + "",
        isDisabled:false,
      } 
      updatedActivityList.push(updatedActivity);
      initKey++;
    }
    newUser.activities = updatedActivityList;
    console.log("newUser",newUser);
    this.props.navigation.navigate("SignUp", {
      currentUser: newUser
    });
  }
  render() {
    return (
      <View
          style={loginStyles.inputContatiner}
          behavior={"height"}
          keyboardVerticalOffset={1}>
          <View style={loginStyles.inputField}>
            <Text style={loginStyles.inputFont}>Name</Text>
            <View style={loginStyles.inputText}>
              <TextInput
                style={loginStyles.inputTextField}
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.displayNameInput}
                onChangeText={(text)=>{this.setState({displayNameInput: text})}}
              />
            </View>
            <Text style={loginStyles.inputFont}>Email Address</Text>
            <View style={loginStyles.inputText}>
              <TextInput
                style={loginStyles.inputTextField}
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="email"
                textContentType="emailAddress"
                value={this.state.emailInput}
                placeholder=""
                onChangeText={(text) => this.setState({emailInput:text})}
              />
            </View>
            <Text style={loginStyles.inputFont}>Password</Text>
            <View style={loginStyles.inputText}>
              <TextInput
                style={loginStyles.inputTextField}
                autoCapitalize='none'
                autoCorrect={false}
                textContentType='password'
                value={this.state.passwordInput}
                onChangeText={(text)=>{this.setState({passwordInput: text})}}
              />
            </View>
            
          </View>
          <View style={loginStyles.buttonArea}>
            <TouchableOpacity 
              style={loginStyles.buttonStyle}
              onPress={() => this.onRegist()}>
              <Text style={loginStyles.buttonFont}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={loginStyles.buttonStyle}
              onPress={() => this.onLogin()}>
              <Text style={loginStyles.buttonFont}>Log in</Text>
            </TouchableOpacity>
          </View>

          

      </View>


    );
  }
}