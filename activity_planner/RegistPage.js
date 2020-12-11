import React from 'react';
import { TextInput, Text, View, Image, TouchableOpacity, 
KeyboardAvoidingView, Alert, LayoutAnimation, Button, FlatList} from 'react-native';

import { getDataModel } from './DataModel';
import {registStyle} from './Styles';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Ionicons } from '@expo/vector-icons';



export class RegistPage extends React.Component {

 constructor(props) {
    super(props);
    //console.log("constructor");
    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser;
    this.userName = this.currentUser.displayName;


    this.addActivityKey = 0;

    this.isPlanning = false;
    this.headerButtonIsDisabled = true;
    this.state = {
      mode: 'login',
      emailInput: '',
      newActivityInput: '',
      passwordInput: '',
      passwordCheckInput: '',
      activityList: this.currentUser.activities,
      dailyPlanList: [],
      
      //panelListButtomDisabled: false,
    }

    // this.props.navigation.setOptions({
    // headerRight: () => (
    //   <Button
    //     title="Next"
    //     color="blue"
    //     disabled={this.state.headerButtonIsDisabled}
    //     onPress={() => alert('This is a button!')}
    //   />
    // ),});
  }

  componentDidMount = () => {
    //console.log("componentDidMount");
    //console.log(this.state.headerButtonIsDisabled);
    
    this.props.navigation.setOptions({
    headerRight: () => (
      <Button
        title="Next"
        color="blue"
        disabled={this.headerButtonIsDisabled}
        onPress={() => this.props.navigation.navigate("All Set!", {
          currentUser: this.currentUser
        })}
      />
    ),});
  }
  checkIfEmptyList = () => {
    //this.componentDidMount();
    if (this.state.dailyPlanList.length != 0) {
      //console.log("not empty list",this.state.headerButtonIsDisabled);
      //this.setState({headerButtonIsDisabled:true});
      this.headerButtonIsDisabled = false;
      //console.log("setstate",this.state.headerButtonIsDisabled);
    } else {
      //console.log("empty list",this.state.headerButtonIsDisabled);
      this.headerButtonIsDisabled = true;
      this.setState({headerButtonIsDisabled:false});
    }
    this.componentDidMount();
  }

  addUserDefinedActivity = () => {
    let activityName = this.state.newActivityInput;


    if (activityName != "") {
      let newActivity = {
        name: activityName,
        key: this.dataModel.activityKey + "",
        isDisabled: true,
      }
      this.onAddingActivity(newActivity);
      this.dataModel.activityKey++;
      let userID = this.currentUser.key;
      let newActivityList = this.state.activityList;
      newActivityList.push(newActivity);
      this.setState({activityList:newActivityList});
      this.setState({newActivityInput:""});
      this.dataModel.addActivity(userID, activityName);
      
    }
    this.checkIfEmptyList();

  }

  onAddingActivity = (activity) => {
    let randomKey = '_' + Math.random().toString(36).substr(2, 9);
    //console.log("randomKey",randomKey);
    let activityToAdd = Object.create(activity);
    activityToAdd.key = randomKey;
    //this.addActivityKey++;
    console.log("add activity",activityToAdd);
    if (this.isPlanning == false) {
      let newList = this.state.dailyPlanList;
      let updateActivityList = this.state.activityList;
      for (let activityItem of updateActivityList) {
        if (activityItem.name == activity.name) {
          activityItem.isDisabled = true;
        }
      }
      
      this.setState({activityList:updateActivityList});
      newList.push(activityToAdd);
      console.log("add activity to list",newList);
      this.setState({dailyPlanList:newList});
    }
    this.checkIfEmptyList();
  }
  onRemoveItem = (activity) => {
    let newList = this.state.dailyPlanList;
    let index = 0;
    for (let activityItem of newList) {
      if (activityItem.name == activity.name) {
        newList.splice(index,1);
        console.log("remove activity from list",newList);
      }
      index++;
    }
    this.setState({dailyPlanList:newList});

    let updateActivityList = this.state.activityList;
    for (let activityItem of updateActivityList) {
        if (activityItem.name == activity.name) {
          activityItem.isDisabled = false;
        }
      }
    this.setState({activityList:updateActivityList});
    this.checkIfEmptyList();
  }

  render() {
    return (
      <View style={registStyle.contatiner}>
        <View style={registStyle.promptBox}>
          <Text style={registStyle.promptBoxText}>Hi {this.userName}, 
          {"\n"}let us know your daily activities</Text>          
        </View>
        <View style = {registStyle.dailyPlanList}>
          <FlatList
            data = {this.state.dailyPlanList}
            renderItem={({item}) => {
              return (
                <View style={registStyle.slidePanelListItem}> 
                  <View style={registStyle.slidePanelListItemTextContainter}>
                    <Text style={registStyle.slidePanelListItemText}>{item.name}</Text>
                  </View>
                  <View style={registStyle.slidePanelListItemIcon}>
                    
                    <TouchableOpacity
                      
                      onPress={() => this.onRemoveItem(item)}>
                      <Ionicons name="ios-remove-circle"
                        size={30}
                        color={"white"} />
        
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}/>
        </View>
        <View style={registStyle.buttom}>
          <TouchableOpacity
            onPress={() => this._panel.show()}>
            <Ionicons name="md-add-circle" 
              size={30} 
              color={"black"} />
            
          </TouchableOpacity>
        </View>
        <SlidingUpPanel 
        draggableRange={{top:500, bottom:100}}
        showBackdrop={false}
        ref={c => this._panel = c}>
          <View style={registStyle.slidePanel}>
            <Text style={registStyle.addButtomTextStyle}>Add Daily Activities</Text>
            <View style={registStyle.slidePanelList}>
              <FlatList
                data={this.state.activityList}
                renderItem={({item}) => {
                  return (
                    <View style={registStyle.slidePanelListItem}> 
                      <View style={registStyle.slidePanelListItemTextContainter}>
                        <Text style={registStyle.slidePanelListItemText}>{item.name}</Text>
                      </View>
                      <View style={registStyle.slidePanelListItemIcon}>
                      {item.isDisabled === true ? (
                        <TouchableOpacity
                          disabled = {item.isDisabled}
                          onPress={() => this.onAddingActivity(item)}>
                          <Ionicons name="ios-add-circle"
                            size={30}
                            color={"black"} />
            
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          disabled = {item.isDisabled}
                          onPress={() => this.onAddingActivity(item)}>
                          <Ionicons name="ios-add-circle"
                            size={30}
                            color={"white"} />
            
                        </TouchableOpacity>

                      )}

                      </View>
                    </View>
                  );
                }}/>
            </View>
            <View style={registStyle.inputTextBox}>
            <TextInput
                style={registStyle.inputTextField}
                placeholder="define your own activity"
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.newActivityInput}
                onChangeText={(text)=>{this.setState({newActivityInput: text})}}
            />
            <View style={registStyle.slidePanelListItemIcon}>
              <TouchableOpacity 
                  onPress={() => this.addUserDefinedActivity()}>
                  <Ionicons name="ios-add-circle"
                    size={30}
                    color={"black"} />
    
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={registStyle.closeButtom} 
              onPress={() => this._panel.hide()}>
              <Ionicons name="md-close-circle"
                size={30}
                color={"white"} />
            
          </TouchableOpacity>
          </View>
        </SlidingUpPanel>
      </View>
    );
  }
}