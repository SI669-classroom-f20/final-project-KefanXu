import firebase from 'firebase';
import '@firebase/firestore';
import '@firebase/storage';
import { firebaseConfig } from './Secrets';
import moment from 'moment';
class DataModel {
  constructor(){
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }

    this.usersRef = firebase.firestore().collection('users');
    this.sampleActivities = ["Exercise","Housework","Break"];

    this.users = [];
    this.asyncInit();
    this.activityKey = 0;
  }
  asyncInit = async() => {
    await this.loadUsers();
    //console.log("this.users",this.users);
  }
  loadUsers = async() => {
    let querySnap = await this.usersRef.get();
    querySnap.forEach(async qDocSnap => {
      let key = qDocSnap.id;
      let data = qDocSnap.data();
      data.key = key;
      //console.log("data",data);
      let activities = [];
      let activityQuerySnap = await this.usersRef.doc(key).collection("activities").get();
      activityQuerySnap.forEach(activityQDocSnap => {
        let activity = activityQDocSnap.data();
        //console.log("activities",activity);
        activity.key = this.activityKey + "";
        activity.isDisabled = false,
        this.activityKey++;
        activities.push(activity);
        //console.log("activities",activities);
      });
      data.activities = activities;
      console.log("data",data);
      this.users.push(data);
    });
    
  }
  loadActivities = async() => {
    
  }
  addActivity = async(userID, activity) => {
    let currentUserActivityCollectionRef =  this.usersRef.doc(userID).collection("activities");
    let newUserDefinedActivity = {
      name: activity,
    }
    currentUserActivityCollectionRef.add(newUserDefinedActivity);
  }
  createUser = async (email, pass, dispName) => {
    // assemble the data structure
    let newUser = {
      email: email,
      password: pass,
      displayName: dispName
    }

    // add the data to Firebase (user collection)
    let newUserDocRef = await this.usersRef.add(newUser);

    // get the new Firebase ID and save it as the local "key"
    let key = newUserDocRef.id;
    let newUserActivityRef = await newUserDocRef.collection("activities");
    let newUserDailyPlanRef = await newUserDocRef.collection("daily_plans")
    for (let activity of this.sampleActivities) {
      let newActivity = {
        name: activity,
      }
      await newUserActivityRef.add(newActivity);
    }
    newUser.key = key;
    newUser.activities = this.sampleActivities;
    this.users.push(newUser);
    return newUser;
  }
  addEnergy = async(userID, energyNum, energyNumBase, date) => {
    // console.log(energyNum);
    // await this.usersRef.add("userID");
    let newEnergyEntry = {
      date: date,
      energyNum: energyNum,
      energyNumBase: energyNumBase
    }
    let targetId;
    let isEntryExsist = false;
    let energyCollectionRef = await this.usersRef.doc(userID).collection("energy_collection");
    let energyCollectionRefSnap = await this.usersRef.doc(userID).collection("energy_collection").get();
    energyCollectionRefSnap.forEach(energyEntry => {
      let energyEntryData = energyEntry.data();
      if (energyEntryData.date === date) {
        targetId = energyEntry.id;
        console.log("find id",targetId);

        isEntryExsist = true;
      }
      //console.log(energyEntryData);
    });
    //await energyCollectionRef.add(newEnergyEntry);
    if (isEntryExsist) {
      await energyCollectionRef.doc(targetId).set({date:date, energyNum:energyNum, energyNumBase:energyNumBase});
    } else {
      console.log("added new energy entry");

      await energyCollectionRef.add(newEnergyEntry);
    }

  }
  addPlans = async (userID, activityList) => {
    console.log(userID, activityList);
    let timeStamp = new Date();
    let timeStampText =  moment(timeStamp).format("YYYY:HH:mm");
    let newDayPlanDoc = {
      date: timeStampText,
    }

    let dailyPlansRef = await this.usersRef.doc(userID).collection("daily_plans");
    await dailyPlansRef.add(newDayPlanDoc);
    let targetId;
    let dailyPlansRefSnap = await this.usersRef.doc(userID).collection("daily_plans").get();
    dailyPlansRefSnap.forEach(planEntries => {
      console.log(planEntries.id);
      if (planEntries.data().date === timeStampText) {
        targetId = planEntries.id;
      }
    });
    let thisDailyPlanRef = await this.usersRef.doc(userID).collection("daily_plans")
                                  .doc(targetId).collection("planned_activities");
    for (let activity of activityList) {
      let energyValToAdd = activity.energyValue;
      //console.log(energyValToAdd);
      let activityToAdd = {
        name: activity.name,
        startTime: activity.startTime,
        endTime:activity.endTime,
        energyVal: energyValToAdd,
      };
      
      await thisDailyPlanRef.add(activityToAdd);
    }
  }
  getUsers = () => {
    return this.users;
  }
}

let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}