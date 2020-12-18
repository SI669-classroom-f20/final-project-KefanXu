import React,{useState} from 'react';
import { TextInput, Text, View, Image, TouchableOpacity,
KeyboardAvoidingView, Alert, Modal, TouchableHighlight,
LayoutAnimation, Button, Animated, Platform} from 'react-native';

import { getDataModel } from './DataModel';
import {registStyle, planningPage, trackingPage} from './Styles';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';

import NumericInput from 'react-native-numeric-input'
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment, { min } from 'moment';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const options = {
  container: {
    backgroundColor: '#FF0000',
    padding: 5,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: '#FFF',
    marginLeft: 7,
  }
  };
// Notifications.setNotificationCategoryAsync("interaction", [{
//     actionId:"test1",
//     identifier:"test1",
//     buttonTitle:"test1",
//   },{
//     actionId:"test2",
//     identifier:"test2",
//     buttonTitle:"test2",
// }]);
//Notifications.setNotificationCategoryAsync
// Notifications.createCategoryAsync("A_OR_B", [
//   {
//     actionId: "a",
//     buttonTitle: "A",
//   },
//   {
//     actionId: "b",
//     buttonTitle: "B",
//   },
// ]);


export class TrackingPage extends React.Component {
  constructor(props) {
    super(props);
    // this.notificationType;
    // this.activityName;
    this.currentTime;
    //this.headerButtonIsDisabled = true;

    this.currentUser = this.props.route.params.currentUser;
    this.plan = this.props.route.params.plan;
    this.startingEnergy = this.props.route.params.startingEnergy;
    this.baselineEnergy = this.props.route.params.baselineEnergy;
    console.log("==================plan==================");
    for (let activity of this.plan) {
      activity.isDeny = false;
      activity.isUndo = false;
      activity.isCurrent = false;
      activity.isStop = false;
      activity.isLastActivity = false;
      activity.duration = "";
    }
    console.log(this.plan);
    console.log("==================energy level==================");
    console.log(this.startingEnergy, this.baselineEnergy);

    this.activityStatusWaitToBeChanged;
    this.state = {
      notification: false,
      expoPushToken:"",
      currentActivity:"",
      currentEnergy: this.startingEnergy,
      planList: this.plan,
      isDeny:false, 
      activtyState:"",
      headerButtonIsDisabled:true,
      timerStart: false,
      stopwatchStart: false,
      totalDuration: 0,
      timerReset: false,
      stopwatchReset: false,
      isStopwatchDisable:true,
      stopwatchTextStyle: trackingPage.countUpTimerTextStyleNotAble,

    }
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
  }
  componentWillUnmount() {
    this.focusUnsubscribe();
  }
  onFocus = () => {
    this.currentUser = this.props.route.params.currentUser;
    this.plan = this.props.route.params.plan;
    this.startingEnergy = this.props.route.params.startingEnergy;
    this.baselineEnergy = this.props.route.params.baselineEnergy;
    console.log("==================plan==================");
    for (let activity of this.plan) {
      activity.isDeny = false;
      activity.isUndo = false;
      activity.isCurrent = false;
      activity.isStop = false;
      activity.isLastActivity = false;
      activity.duration = "";
    }
    console.log(this.plan);
    console.log("==================energy level==================");
    console.log(this.startingEnergy, this.baselineEnergy);

    this.activityStatusWaitToBeChanged = "";
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
    this.setState({
      notification: false,
      expoPushToken:"",
      currentActivity:"",
      currentEnergy: this.startingEnergy,
      planList: this.plan,
      isDeny:false, 
      activtyState:"",
      headerButtonIsDisabled:true,
      timerStart: false,
      stopwatchStart: false,
      totalDuration: 0,
      timerReset: false,
      stopwatchReset: false,
      isStopwatchDisable:true,
      stopwatchTextStyle: trackingPage.countUpTimerTextStyleNotAble,

    });
    this.componentDidMount();
  }
  async componentDidMount() {
    let token = await this.registerForPushNotificationsAsync();
    this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    //console.log("token", token);
    //this.setState({expoPushToken:token});
    // console.log("============Tracking============");
    // console.log(this.currentUser);
    Notifications.addNotificationReceivedListener(this._handleNotification);
    Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
    this.setNotificationsFromPlan();
    this.props.navigation.setOptions({
    headerRight: () => (
      <Button
        title="Next"
        color="blue"
        //disabled={this.state.headerButtonIsDisabled}
        disabled={false}
        onPress={() => {
          this.props.navigation.navigate("Reflective Planning", {
            currentUser: this.currentUser,
            plan: this.state.planList,
            startingEnergy: this.startingEnergy,
            baselineEnergy: this.baselineEnergy
        });
          //console.log(this.state.dailyPlanList);
          //this.dataModel.addPlans(this.currentUser.key, this.state.dailyPlanList);
        }}
      />
    ),});
    return () => {
      Notifications.removeNotificationSubscription(this._handleNotification);
      Notifications.removeNotificationSubscription(this._handleNotificationResponse);
    }
  }
  // componentWillUnmount() {
  //   Notifications.removeNotificationSubscription(this._handleNotification);
  //   Notifications.removeNotificationSubscription(this._handleNotificationResponse);
  // }
  setNotificationsFromPlan = () => {
    let count = 1;
    let planLength = this.plan.length;
    //console.log("this.plan.lenghth",this.plan.length);
    for (let activity of this.plan) {
      
      //this.schedulePushNotification(activity.startTime, "start", activity.name);
      //this.schedulePushNotification(activity.endTime, "end", activity.name);
      this.setNotificationTimer(activity.startTime, "start", activity.name);
      this.setNotificationTimer(activity.endTime, "end", activity.name);
      if (count == planLength) {
        activity.isLastActivity = true;
        //setTimeout(() => {this.schedulePushNotification(notificationType,notificationName)},secondsInt*1000);
        this.setEnableNext(activity.endTime);

      }
      count ++;

    }
    //console.log("==============this.plan");
    //console.log(this.plan);
  }

  _handleNotification = (notification) => {
    this.setState({notification:notification});
  }
  _handleNotificationResponse = (response) => {
    //response.get
    //this.setState({stopwatchStart: false, stopwatchReset: true});
    this.resetStopwatch();
    this.setState({isStopwatchDisable:true});
    this.setState({stopwatchTextStyle:trackingPage.countUpTimerTextStyleNotAble});
    if (response.actionIdentifier === "startAction") {
      
      console.log("Deny");
      this.isDeny = true;
      let newPlan = this.state.planList;
      for (let activity of newPlan) {
        if (activity.name === this.state.currentActivity) {
          activity.isDeny = true;
          activity.isCurrent = false;
          activity.isComplete = false;
          activity.duration = "N/A";
        }
        //console.log("Denied activity:",activity)
      }
      console.log("New plan:",newPlan)
      this.setState({planList:newPlan});
      this.setState({activtyState:"Denied"});
      console.log(this.state.planList);
    } else if (response.actionIdentifier === "endAction") {
      //this.setState({stopwatchStart: false, stopwatchReset: true});
      //console.log(this.activityStatusWaitToBeChanged);
      console.log("Undo");
      let newPlanUndo = this.state.planList;
      console.log("undo get new plan");
      for (let activity of newPlanUndo) {
        if (activity.name === this.activityStatusWaitToBeChanged) {
          activity.isUndo = true;
          activity.isCurrent = false;
          activity.duration = "N/A";
          console.log("undo set to true");
        }

      }
      this.setState({planList:newPlanUndo});
      console.log("undo set state");
      
      console.log(this.state.planList);
        
    }
  }
  setEnableNext = (scheduledTime) => {
    let date = moment(Date.now()).format("YYYY-MM-DD");
    let dateTime = date + "T" + scheduledTime + "Z";
    let prasedDate = new Date(dateTime);
    let prasedDateToNum = prasedDate.getTime() + 5*60*60*1000;
    //this.notificationType = notificationType;
    //this.activityName = notificationName;
    //let theTrigger = new Date(prasedDateToNum);
    //console.log(prasedDate.toString());
    //console.log(prasedDate.toString());

    let interval = prasedDateToNum - Date.now();
    //console.log("interval", interval);
    let seconds;
    if (interval > 0) {
      seconds = interval / (1000);
      let secondsInt = Math.round(seconds);
      //console.log("seconds", secondsInt);
      setTimeout(() => {
        this.setState({headerButtonIsDisabled:false});
        this.componentDidMount();
        },secondsInt*1000 + 3*1000);
    }
  }
  setNotificationTimer = (scheduledTime,notificationType,notificationName) => {
    let date = moment(Date.now()).format("YYYY-MM-DD");
    let dateTime = date + "T" + scheduledTime + "Z";
    let prasedDate = new Date(dateTime);
    let prasedDateToNum = prasedDate.getTime() + 5*60*60*1000;
    //this.notificationType = notificationType;
    //this.activityName = notificationName;
    //let theTrigger = new Date(prasedDateToNum);
    console.log(prasedDate.toString());
    //console.log(prasedDate.toString());

    let interval = prasedDateToNum - Date.now();
    console.log("interval", interval);
    let seconds;
    if (interval > 0) {
      seconds = interval / (1000);
      let secondsInt = Math.round(seconds);
      console.log("seconds", secondsInt);
      setTimeout(() => {this.schedulePushNotification(notificationType,notificationName)},secondsInt*1000);
    }
  }

  schedulePushNotification = async (notificationType,activityName) => {
    //let trigger = new Date(Date.now() + 1 * 1000);
    // let date = moment(Date.now()).format("YYYY-MM-DD");
    // let dateTime = date + "T" + scheduledTime + "Z";
    // let prasedDate = new Date(dateTime);
    // let prasedDateToNum = prasedDate.getTime() + 5*60*60*1000;

    // //let theTrigger = new Date(prasedDateToNum);
    // console.log(prasedDate.toString());
    // //console.log(prasedDate.toString());

    // let interval = prasedDateToNum - Date.now();
    // console.log("interval", interval);
    // let seconds;
    // let notificationType = this.notificationType;
    // let activityName = this.activityName;
    
    let title;
    let body;
    let actionId;
    let identifier;
    let buttonTitle;
    // if (interval > 0) {
    //   seconds = interval / (1000);
    //   let secondsInt = Math.round(seconds);
    //   console.log("seconds", secondsInt);

      if (notificationType === "start") {
        this.setState({isStopwatchDisable:false});
        this.setState({stopwatchTextStyle:trackingPage.countUpTimerTextStyle});

        this.isDeny = false;
        title = "start " + activityName;
        body = "It's time for " + activityName + "\n" + "Long press to deny";
        actionId = "startAction";
        identifier = "startAction";
        buttonTitle = "Deny";
        this.setState({currentActivity:activityName});
        let newList = this.state.planList;
        for (let activity of newList) {
          if (activity.name === activityName) {
            activity.isCurrent = true;
          } else {
            activity.isCurrent = false;
          }
        }
        this.setState({planList:newList});
        this.setState({activtyState:"Ongoing"});
        this.setState({stopwatchStart: true, stopwatchReset: false});
        // Notifications.setNotificationCategoryAsync("interaction", [{
        //   actionId:"startAction",
        //   identifier:"startAction",
        //   buttonTitle:"Deny",
        // }]);
        console.log("start notice scheduled");
        
      } else if (notificationType === "end" && this.isDeny != true) {
        title = "finish " + activityName;
        body = "You complete " + activityName + "\n" + "Long press to undo";
        // Notifications.setNotificationCategoryAsync("interaction", [{
        //   actionId:"endAction",
        //   identifier:"endAction",
        //   buttonTitle:"Undo",
        // }]);
        actionId = "endAction";
        identifier = "endAction";
        buttonTitle = "Undo";
        let newEnergyLevel = this.state.currentEnergy;
        let activityEnergy;
        for (let activity of this.plan) {
          if (activity.name === activityName) {
            activityEnergy = activity.energyValueNum;
          }
        }
        if (activityName != "Break") {
          newEnergyLevel -= activityEnergy;
        } else {
          newEnergyLevel += activityEnergy;
        }
        this.setState({currentEnergy:newEnergyLevel});
        //console.log("end notice scheduled");
        this.activityStatusWaitToBeChanged = activityName;
        let newList = this.state.planList;
        this.setState({stopwatchStart: false, stopwatchReset: false});
        for (let activity of newList) {
          if (activity.name === activityName){
            activity.isCurrent = false;
            activity.duration = this.currentTime;
            activity.isComplete = true;
          }
            
        }
        this.setState({planList:newList});
        this.setState({currentActivity:"N/A"});
        this.setState({isStopwatchDisable:true});
        this.setState({activtyState:"N/A"});
        this.setState({stopwatchTextStyle:trackingPage.countUpTimerTextStyleNotAble});

        //console.log(newList);
        //console.log(this.currentTime);
      } 
      else if (notificationType === "end" && this.isDeny == true) {
        let newList = this.state.planList;
        for (let activity of newList) {
          if (activity.name === activityName){
            activity.isCurrent = false;
          }
        }
        this.setState({planList:newList});
        this.setState({isStopwatchDisable:true});
        this.setState({stopwatchTextStyle:trackingPage.countUpTimerTextStyleNotAble});
        this.setState({activtyState:"N/A"});
        this.setState({currentActivity:"N/A"});
      }
      console.log("button identifier",buttonTitle)
      Notifications.setNotificationCategoryAsync("interaction", [{
        actionId:actionId,
        identifier:identifier,
        buttonTitle:buttonTitle,
      }]);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body:body,
          data:{data:"testing"},
          categoryIdentifier: "interaction",
        },
        //trigger,
        trigger:{seconds:1, repeats:false}
      });
    }

  
  registerForPushNotificationsAsync = async() => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }
  toggleTimer = () => {
    this.setState({timerStart: !this.state.timerStart, timerReset: false});
  }
 
  resetTimer = () => {
    this.setState({timerStart: false, timerReset: true});
  }
 
  toggleStopwatch = () => {
    this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
  }
 
  resetStopwatch = () => {
    this.setState({stopwatchStart: false, stopwatchReset: true});
  }
  
  getFormattedTime = (time) => {
      this.currentTime = time;
  };
  onPressStopTimer = () => {
    let newList = this.state.planList;
    for (let activity of newList) {
      if (activity.name === this.state.currentActivity) {
        activity.isStop = true;
        activity.isCurrent = false;
        activity.duration = this.currentTime;
      }
    }
    this.isDeny = true;
    this.setState({planList:newList});
    this.setState({activtyState:"Stopped"});
    this.setState({stopwatchTextStyle:trackingPage.countUpTimerTextStyleNotAble});
    this.setState({isStopwatchDisable:true});
    console.log(newList);
    this.resetStopwatch();

  }

  render() {
    return (
      // <View
      //   style={{
      //     flex: 1,
      //     alignItems: 'center',
      //     justifyContent: 'space-around',
      //   }}>
      //   <Text>Your expo push token: {this.state.expoPushToken}</Text>
      //   <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      //     <Text>Title: {this.state.notification && this.state.notification.request.content.title} </Text>
      //     <Text>Body: {this.state.notification && this.state.notification.request.content.body}</Text>
      //     <Text>Data: {this.state.notification && JSON.stringify(this.state.notification.request.content.data)}</Text>
      //   </View>
      //   <Button
      //     title="Press to Send Notification"
      //     onPress={async () => {
      //       this.setNotificationTimer("12:28","start","test");
      //      // await this.setNotificationTimer("12:17","end","test");
      //     }}
      //   />
      //   <Button
      //     title="Press to Send Notification"
      //     onPress={async () => {
      //       await this.sendPushNotification(this.state.expoPushToken);
      //     }}
      //   />
      // </View>
      <View style={registStyle.contatiner}>

        {/* <TouchableHighlight onPress={this.onPressStopTimer}>
          <Text style={{fontSize: 30}}>Reset</Text>
        </TouchableHighlight> */}

        <View style={planningPage.promptBox2Vis}>
          <View style={trackingPage.promptBoxTextContainer}>
            <Text style={planningPage.promptBoxText}>
              My current activity is {this.state.currentActivity},
              {"\n"}My energy level is {this.state.currentEnergy}
            </Text> 
              <Stopwatch laps start={this.state.stopwatchStart}
              reset={this.state.stopwatchReset}
              options={options}
              getTime={this.getFormattedTime} />
          </View>
          <View style={trackingPage.countUpTimerStyle}>
            <TouchableOpacity 
              disabled={this.state.isStopwatchDisable}
              onPress={this.onPressStopTimer}>
              <Ionicons name="md-stopwatch" size={30} color="black" />
            </TouchableOpacity>
            <Text style={this.state.stopwatchTextStyle}>Stop</Text>
          </View>

        </View>
        <View style={planningPage.progressTextContainer}>
          <Text style={planningPage.progressText}>Activity State: {this.state.activtyState}</Text>
        </View>
        <View style = {registStyle.dailyPlanList}>
          <FlatList
            data = {this.state.planList}
            renderItem={({item}) => {
              return (
                <View>
                  {item.isCurrent === true ? (   
                    <View>   
                      <View style={registStyle.planningTimeText}>
                        <Text style={trackingPage.planningTimeTextStyle}>Current {item.startTime} - {item.endTime}</Text>
                      </View>           
                      <View style={trackingPage.slidePanelListItemWarning}> 
                        <View style={registStyle.slidePanelListItemTextContainter}>
                            <Text style={registStyle.slidePanelListItemText}>{item.name}</Text>
                          </View>
                          <View style={registStyle.slidePanelListItemIcon}>
                            <View style={registStyle.slidePanelListItemEnergyContainter}>
                              <Text style={registStyle.slidePanelListItemText}>{item.energyValue}</Text>
                            </View>
                        </View>
                      </View>
                    </View>

                  ) : (
                    <View>
                      <View style={registStyle.planningTimeText}>
                        <Text style={registStyle.planningTimeTextStyle}>{item.startTime} - {item.endTime}</Text>
                      </View>
                      <View style={registStyle.slidePanelListItem}> 
                        <View style={registStyle.slidePanelListItemTextContainter}>
                          <Text style={registStyle.slidePanelListItemText}>{item.name}</Text>
                        </View>
                        <View style={registStyle.slidePanelListItemIcon}>
                          <View style={registStyle.slidePanelListItemEnergyContainter}>
                            <Text style={registStyle.slidePanelListItemText}>{item.energyValue}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            }}/>
        </View>
      </View>
    );

  }
}