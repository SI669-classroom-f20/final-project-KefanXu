import React from 'react';
import { TextInput, Text, View, Image, TouchableOpacity, 
KeyboardAvoidingView, Alert, LayoutAnimation, Button, FlatList} from 'react-native';

import { getDataModel } from './DataModel';
import {registStyle, setUpStyle} from './Styles';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Ionicons } from '@expo/vector-icons';

export class AllSetScreen extends React.Component {
   constructor(props) {
    super(props);
    this.currentUser = this.props.route.params.currentUser;
    this.userName = this.currentUser.displayName;
   }
    componentDidMount = () => {
      this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          title="Next"
          color="blue"
          onPress={() => this.props.navigation.navigate("Plan Your Day", {
            currentUser: this.currentUser
          })}
        />
      ),});
  }
   render() {
     return(
        <View style={registStyle.contatiner}>
          <View style={setUpStyle.promptBox}>
            <View style={setUpStyle.promptBoxTextContainer}>
              <Text style={setUpStyle.promptBoxText}>Hi {this.userName}, 
              {"\n"}You are all set!</Text> 
            </View>
            <View style={setUpStyle.promptBoxIcon}>
              <Ionicons name="ios-checkmark-circle"
              size={50}
              color={"green"} />    
            </View>     
          </View>
        </View>
     );
   }
}