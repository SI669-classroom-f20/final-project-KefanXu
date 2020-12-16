import React,{useState} from 'react';
import { TextInput, Text, View, Image, TouchableOpacity,
KeyboardAvoidingView, Alert, Modal,
LayoutAnimation, Button, Animated} from 'react-native';

import { getDataModel } from './DataModel';
import {registStyle, planningPage} from './Styles';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';

import NumericInput from 'react-native-numeric-input'
//import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker';

import moment from 'moment';


export class PlanningPage extends React.Component {

  constructor(props) {
    super(props);

    this.dataModel = getDataModel();
    this.currentUser = this.props.route.params.currentUser;
    this.userName = this.currentUser.displayName;

    this.isPlanning = false;
    this.position =  new Animated.ValueXY({x:0,y:0});

    this.energyNum;
    this.accEnergy = 0;
    this.trackEnergy = 0;

    this.energyNumBase;
    this.activityWaitToAdd;

    this.timeInputField = 0;

    this.headerButtonIsDisabled = true;
    //this.didUpdate = false;
    //this.prePosition =  new Animated.ValueXY({x:-500,y:0});

    this.state = {
      isDatePickerVisible:null,
      mode: 'login',
      emailInput: '',
      newActivityInput: '',
      passwordInput: '',
      passwordCheckInput: '',
      activityList: this.currentUser.activities,
      dailyPlanList: [],
      nextButtonState: "Step1",
      titleText: "1/3",
      energyValue:0,
      initInputVal: 0,
      leftButtonStyle: planningPage.progressIconContainerLeftHide,
      rightButtonStyle: planningPage.progressIconContainerVis,
      numInputStyle: planningPage.promptBoxNumInputContainterVis,
      promptText: "Tell us your energy level at the start of the day",
      //promptBox1Style:planningPage.promptBox2Vis,
      promptBox2Style:planningPage.promptBox2Vis,
      modalVisable: null,
      modalActivityTitleName:"",
      timeInputButton1: "00:00",
      date: new Date(),
      date2: new Date(),
      dateOnText: "00:00",
      dateOnText2: "00:00",
      startTimeStamp: new Date(),
      slideButtonVal:10,
      headerButtonIsDisabled:true,
      
      //setDatePickerVisibility:false
      //fadeValue: new Animated.Value(0),
    }
  }

  // _start = () => {
  //   // Animated.timing(this.state.fadeValue, {
  //   //   toValue: 1,
  //   //   duration: 1000,
  //   //   useNativeDriver: true,
  //   // }).start();
  //   Animated.spring( this.position , {
  //     useNativeDriver: false,
  //     toValue: { x: 500, y: 0 },
      
  //   } ).start()
  // };
  // _start2 = () => {
  //     Animated.spring( this.prePosition , {
  //     useNativeDriver: false,
  //     toValue: { x: 0, y: 0 },
      
  //   } ).start()
  // }

  nextbuttonClick = () => {
    let date = Date().slice(0,15).replace(/ /g,'-')
    if (this.state.nextButtonState === "Step1") {
      console.log(this.currentUser);
      this.energyNum = this.state.energyValue;
      this.setState({promptText:"Let us know the energy level you are comfortable with"});
      this.setState({leftButtonStyle:planningPage.progressIconContainerLeftVis});
      this.setState({nextButtonState:"Step2"});
      this.setState({titleText:"2/3"});
      this.setState({initInputVal:0});
    } else {
      this.energyNumBase = this.state.energyValue;
      this.setState({nextButtonState:"Step3"})
      this.setState({promptText:"Now add activities into your plan!"});
      this.setState({rightButtonStyle:planningPage.progressIconContainerHide});
      this.setState({numInputStyle:planningPage.promptBoxNumInputContainterHide});
      this.setState({titleText:"3/3"});
      this.setState({slideButtonVal:100});
      this._panel.show();
      this.accEnergy = this.energyNum;
      this.trackEnergy = this.energyNum;
      this.dataModel.addEnergy(this.currentUser.key, this.energyNum, this.energyNumBase, date);

    }
  }
  previousButtonClick = () => {
    if (this.state.nextButtonState === "Step2") {
      this.setState({promptText:"Tell us your energy level at the start of the day"});
      this.setState({nextButtonState:"Step1"});
      this.setState({leftButtonStyle:planningPage.progressIconContainerLeftHide});
      this.setState({titleText:"1/3"});

    } else if (this.state.nextButtonState === "Step3") {
      this.setState({promptText:"Let us know the energy level you are comfortable with"});
      this.setState({nextButtonState:"Step2"});
      this.setState({rightButtonStyle:planningPage.progressIconContainerVis});
      this.setState({numInputStyle:planningPage.promptBoxNumInputContainterVis});
      this.setState({titleText:"2/3"});
      this.setState({slideButtonVal:10});
      this._panel.hide();
    }
  }

  addUserDefinedActivity = () => {
    let activityName = this.state.newActivityInput;


    if (activityName != "") {
      let newActivity = {
        name: activityName,
        key: this.dataModel.activityKey + "",
        isDisabled: true,
      }
      //this.onAddingActivity(newActivity);
      this.setModal(newActivity);
      this.dataModel.activityKey++;
      let userID = this.currentUser.key;
      let newActivityList = this.state.activityList;
      newActivityList.push(newActivity);
      this.setState({activityList:newActivityList});
      this.setState({newActivityInput:""});
      this.dataModel.addActivity(userID, activityName);
      
    }
    //this.checkIfEmptyList();
    this.checkIfEmptyList();

  }

  onAddingActivity = (activity) => {
    let randomKey = '_' + Math.random().toString(36).substr(2, 9);
    console.log("activity",activity);
    let activityToAdd = Object.create(activity);
    activityToAdd.key = randomKey;
    activityToAdd.name = activity.name;
    activityToAdd.startTime = this.state.dateOnText;
    activityToAdd.endTime =  this.state.dateOnText2;
    activityToAdd.energyValueNum = this.state.energyValue;
    activityToAdd.startDate = (this.state.date).toString();
    activityToAdd.isBelowBaseline = false;
    //this.addActivityKey++;
    console.log("add activity",activityToAdd);
    if (this.isPlanning == false) {
      if (activityToAdd.name === "Break") {
        this.accEnergy += this.state.energyValue;
        activityToAdd.energyValue = "+" + this.state.energyValue;
      } else {
        this.accEnergy -= this.state.energyValue;
        activityToAdd.energyValue = "-" + this.state.energyValue;
      }
      
      console.log("this.accEnergy", this.accEnergy);
      console.log("this.energyNumBase", this.energyNumBase);
      if (this.accEnergy >= this.energyNumBase) {
        this.addActivityToList(activityToAdd);
        this.setState({modalVisable:null});
      } else if (this.energyNumBase > this.accEnergy && this.accEnergy > 0) {
        Alert.alert(
          "Warning:Exceed the energy baseline",
          "Are you sure to add?",
          [{
            text:"Cancel",
            onPress: () => {
              this.accEnergy += this.state.energyValue;
              this.setState({modalVisable:null});}, 
            style:"cancel"
          },{
            text:"Add", 
            onPress: () => {
              this.addActivityToList(activityToAdd);
              this.setState({modalVisable:null});},
          }],{
            cancelable:false
          }
        );
        
      } else if (this.accEnergy <= 0) {
        Alert.alert(
          "Warning: Exceed the total energy",
          "Consider change the total energy or add other activity",
          [{
            text:"Cancel",
            onPress: () => {
              this.accEnergy -= this.state.energyValue;
              this.setState({modalVisable:null});}, 
            style:"cancel"
          }],{
            cancelable:false
          }
        );
      }

    }
    //console.log(this.accEnergy);
    this.checkIfEmptyList();
    
    //this.checkIfEmptyList();
  }
  addActivityToList = (activityToAdd) => {
    let newList = this.state.dailyPlanList;
    console.log("new list",newList);

    newList.push(activityToAdd);
    newList.sort(function(a,b){
      return new Date(a.startDate) - new Date(b.startDate);
    });
    let newListUpdated = this.updateActivityColorStatus(newList)

    console.log("add activity to list",newListUpdated);
    this.setState({dailyPlanList:newListUpdated});
    }
  updateActivityColorStatus = (list) => {
    let newList = list;
    let trackEnergyNum = this.trackEnergy;
    for (let activity of newList) {
      //console.log("activity.energyValueNum",activity.energyValueNum);
      if (activity.name === "Break") {
        trackEnergyNum += activity.energyValueNum;
      } else {
        trackEnergyNum -= activity.energyValueNum;
      } 
      console.log("trackEnergyNum",trackEnergyNum);
      if (trackEnergyNum < this.energyNumBase) {
        activity.isBelowBaseline = true;
      } else {
        activity.isBelowBaseline = false;
      }
      
    }
    return newList;
  }
  onRemoveItem = (activity) => {
    let newList = this.state.dailyPlanList;
    let index = 0;
    for (let activityItem of newList) {
      if (activityItem.name == activity.name) {
        newList.splice(index,1);
        //console.log("remove activity from list",newList);
        if (activityItem.name === "Break") {
          this.accEnergy -= activityItem.energyValueNum;
        } else {
          this.accEnergy += activityItem.energyValueNum;
        }
      }
      index++;
    }
    let updatedNewList = this.updateActivityColorStatus(newList);
    this.setState({dailyPlanList:updatedNewList});

    let updateActivityList = this.state.activityList;
    for (let activityItem of updateActivityList) {
        if (activityItem.name == activity.name) {
          activityItem.isDisabled = false;
        }
      }
    this.setState({activityList:updateActivityList});
    //this.checkIfEmptyList();
    this.checkIfEmptyList();
  }
  setModal = (activity) => {
    this.setState({modalVisable:!null});
    this.activityWaitToAdd = activity;
    this.setState({modalActivityTitleName:activity.name});
    
  }
  comfirmModal = () => {
    this.onAddingActivity(this.activityWaitToAdd);
    
  }

  // hideDatePicker = () => {
  //   this.setDatePickerVisibility(false)
  // }

  handleDatePickerComfirm = (date) => {
    let dateText = moment(date).format('HH:mm').toString();
    if (this.timeInputField === 1) {
      this.setState({timeInputButton1:dateText});
    }
    this.hideDatePicker();
    //this.componentDidMount();
    this.setState({modalVisable:!null});
    //this.setModal(this.activityWaitToAdd);
  }
  hideDatePicker = () => {
    this.setState({isDatePickerVisible:null});
  }

  showDatePicker = () => {
    console.log("show picker");
    this.timeInputField = 1;
    this.setState({modalVisable:null});
    this.setState({isDatePickerVisible:!null}); 

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
        onPress={() => {
          this.props.navigation.navigate("Tracking", {
            currentUser: this.currentUser,
            plan: this.state.dailyPlanList,
            startingEnergy: this.energyNum,
            baselineEnergy: this.energyNumBase
        });
          //console.log(this.state.dailyPlanList);
          this.dataModel.addPlans(this.currentUser.key, this.state.dailyPlanList);
        }}
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
      //this.setState({headerButtonIsDisabled:false});
    }
    this.componentDidMount();
  }

  render() {
    return (
      <View style={registStyle.contatiner}>
      {/* <DateTimePickerModal
        date={new Date()}
        mode="time"
        isVisible={this.state.isDatePickerVisible}
        onConfirm={this.handleDatePickerComfirm}
        onCancel={this.hideDatePicker}
      /> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisable}
        onRequestClose={()=>{Alert.alert("Modal has been closed");}}>
        <View style={planningPage.modalCenterStyle}>
          <View style={planningPage.modalViewStyle}>
            <View style={planningPage.modalTitleTextContainer}>
              <Text style={planningPage.modalTitleStyle}>Add {this.state.modalActivityTitleName} to Schedule</Text>
            </View>
            <View style={planningPage.modalStartTimeInput}>
              <Text style={planningPage.modalTextStyle}>Enter the percevied energy</Text>
                <View style={planningPage.modalNumInput}>
                  <NumericInput 
                  value={this.state.initInputVal}
                  minValue={0}
                  maxValue={this.energyNum}
                  iconSize={10}
                  rounded={true}
                  totalHeight={30}
                  totalWidth={60}
                  onChange={value => this.setState({energyValue:value})} />  
              </View> 
            </View>
            <View style={planningPage.modalStartTimeInput}>
              <Text style={planningPage.modalTextStyle}>Enter the start time</Text>
              <Text style={planningPage.time}>{this.state.dateOnText}</Text>
            </View>
            <DateTimePicker
              value={this.state.date}
              mode="default"
              is24Hour={true}
              display="default"
              onChange={(e,date) => {
                let selectDate = moment(date).format("HH:mm");
                //let setDate = moment(date);
                this.setState({date:date});
                this.setState({dateOnText:selectDate});
              }}
              style={{width: 320, backgroundColor: "white", alignContent:"center", justifyContent:"center"}}
            />
            <View style={planningPage.modalStartTimeInput}>
              <Text style={planningPage.modalTextStyle}>Enter the end time</Text>
              <Text style={planningPage.time}>{this.state.dateOnText2}</Text>
            </View>
            <DateTimePicker
              value={this.state.date2}
              mode="default"
              is24Hour={true}
              display="default"
              minimumDate={this.state.date}
              onChange={(e,date) => {
                let selectDate = moment(date).format("HH:mm");
                //let setDate = moment(date);
                this.setState({date2:date});
                this.setState({dateOnText2:selectDate});
              }}
              style={{width: 320, backgroundColor: "white",alignContent:"center", justifyContent:"center"}}
            />
            <View style={planningPage.modalButtonView}>
              <TouchableOpacity
                style={planningPage.modalButton} 
                onPress={() => this.setState({modalVisable:null})}>
                <Ionicons name="md-close-circle"
                  size={30}
                  color={"black"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={planningPage.modalButton} 
                onPress={() => this.comfirmModal()}>
                <Ionicons name="ios-checkmark-circle"
                  size={30}
                  color={"black"} />
              
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={planningPage.progressTextContainer}>
        <Text style={planningPage.progressText}>{this.state.titleText}</Text>
      </View>
      <View style={this.state.promptBox2Style}>

        <View style={planningPage.promptBoxTextContainer}>
          <Text style={planningPage.promptBoxText}>Hi {this.userName}, 
          {"\n"}{this.state.promptText}</Text> 
        </View>
        <View style={this.state.numInputStyle}>
          <NumericInput 
          value={this.state.initInputVal}
          minValue={0}
          maxValue={this.energyNum}
          iconSize={10}
          rounded={true}
          totalHeight={30}
          totalWidth={60}
          onChange={value => this.setState({energyValue:value})} />  
        </View>       

      </View>

        <View style={planningPage.progressContainer}>
          {/* <Text style={planningPage.progressText}>{Date()}</Text> */}
          <TouchableOpacity
          onPress={() => this.previousButtonClick()}>
            <View style={this.state.leftButtonStyle}>
              <Ionicons name="ios-arrow-dropleft-circle" 
              
              size={20} 
              color={"black"} />
              <Text style={planningPage.progressText}>Previous</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.nextbuttonClick()}>
            <View style={this.state.rightButtonStyle}>
              
              <Text style={planningPage.progressText}>Next</Text>
              <Ionicons name="ios-arrow-dropright-circle" 
                  size={20} 
                  color={"black"} />
              
            </View>
          </TouchableOpacity>
        </View>
        <View style = {registStyle.dailyPlanList}>
          <FlatList
            data = {this.state.dailyPlanList}
            renderItem={({item}) => {
              return (
                <View>
                  <View style={registStyle.planningTimeText}>
                    <Text style={registStyle.planningTimeTextStyle}>{item.startTime} - {item.endTime}</Text>
                  </View>
                  {item.isBelowBaseline === true ? (                  
                    <View style={registStyle.slidePanelListItemWarning}> 
                      <View style={registStyle.slidePanelListItemTextContainter}>
                          <Text style={registStyle.slidePanelListItemText}>{item.name}</Text>
                        </View>
                        <View style={registStyle.slidePanelListItemIcon}>
                          <View style={registStyle.slidePanelListItemEnergyContainter}>
                            <Text style={registStyle.slidePanelListItemText}>{item.energyValue}</Text>
                          </View>
                          <TouchableOpacity
                            
                            onPress={() => this.onRemoveItem(item)}>
                            <Ionicons name="ios-remove-circle"
                              size={30}
                              color={"white"} />
              
                          </TouchableOpacity>
                      </View>
                    </View>

                  ) : (
                    <View style={registStyle.slidePanelListItem}> 
                      <View style={registStyle.slidePanelListItemTextContainter}>
                        <Text style={registStyle.slidePanelListItemText}>{item.name}</Text>
                      </View>
                      <View style={registStyle.slidePanelListItemIcon}>
                        <View style={registStyle.slidePanelListItemEnergyContainter}>
                          <Text style={registStyle.slidePanelListItemText}>{item.energyValue}</Text>
                        </View>
                        <TouchableOpacity
                          
                          onPress={() => this.onRemoveItem(item)}>
                          <Ionicons name="ios-remove-circle"
                            size={30}
                            color={"white"} />
            
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

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
        draggableRange={{top:500, bottom:this.state.slideButtonVal}}
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
                        <TouchableOpacity
                         
                          onPress={() => this.setModal(item)}>
                          <Ionicons name="ios-add-circle"
                            size={30}
                            color={"white"} />
            
                        </TouchableOpacity>
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