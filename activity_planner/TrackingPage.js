import React,{useState} from 'react';
import { TextInput, Text, View, Image, TouchableOpacity,
KeyboardAvoidingView, Alert, Modal,
LayoutAnimation, Button, Animated, Platform} from 'react-native';

import { getDataModel } from './DataModel';
import {registStyle, planningPage} from './Styles';
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
    this.currentUser = this.props.route.params.currentUser;
    this.plan = this.props.route.params.plan;
    console.log("==================plan==================");
    console.log(this.plan);
    this.state = {
      notification: false,
      expoPushToken:""
    }
  }
  async componentDidMount() {
    let token = await this.registerForPushNotificationsAsync();
    //console.log("token", token);
    //this.setState({expoPushToken:token});
    // console.log("============Tracking============");
    // console.log(this.currentUser);
    Notifications.addNotificationReceivedListener(this._handleNotification);
    Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
    this.setNotificationsFromPlan();
    return () => {
      Notifications.removeNotificationSubscription(this._handleNotification);
      Notifications.removeNotificationSubscription(this._handleNotificationResponse);
    }
  }
  componentWillUnmount() {
    Notifications.removeNotificationSubscription(this._handleNotification);
    Notifications.removeNotificationSubscription(this._handleNotificationResponse);
  }
  setNotificationsFromPlan = () => {
    for (let activity of this.plan) {
      //this.schedulePushNotification(activity.startTime, "start", activity.name);
      //this.schedulePushNotification(activity.endTime, "end", activity.name);
      this.setNotificationTimer(activity.startTime, "start", activity.name);
      this.setNotificationTimer(activity.endTime, "end", activity.name);
    }
  }

  _handleNotification = (notification) => {
    this.setState({notification:notification});
  }
  _handleNotificationResponse = (response) => {
    //response.get
    if (response.actionIdentifier === "startAction") {
      console.log("Deny");
    } else if (response.actionIdentifier === "endAction") {
      console.log("Undo");
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
        title = "start " + activityName;
        body = "It's time for " + activityName + "\n" + "Long press to deny";
        actionId = "startAction";
        identifier = "startAction";
        buttonTitle = "Deny";
        // Notifications.setNotificationCategoryAsync("interaction", [{
        //   actionId:"startAction",
        //   identifier:"startAction",
        //   buttonTitle:"Deny",
        // }]);
        console.log("start notice scheduled");
        
      } else if (notificationType === "end") {
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
        console.log("end notice scheduled");
      }
      console.log("button title",buttonTitle)
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

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text>Your expo push token: {this.state.expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {this.state.notification && this.state.notification.request.content.title} </Text>
          <Text>Body: {this.state.notification && this.state.notification.request.content.body}</Text>
          <Text>Data: {this.state.notification && JSON.stringify(this.state.notification.request.content.data)}</Text>
        </View>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            this.setNotificationTimer("12:28","start","test");
           // await this.setNotificationTimer("12:17","end","test");
          }}
        />
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            await this.sendPushNotification(this.state.expoPushToken);
          }}
        />
      </View>
    );

  }
}