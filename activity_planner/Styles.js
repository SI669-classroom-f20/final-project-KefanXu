import { StyleSheet } from 'react-native';
export const colors = {
  primary:"#BDBDBD",
  secondary:"#6E6E6E",
  warning:"#F78181",
}
export const commonStyleElements = StyleSheet.create({
  inputTextField:{

    marginLeft:20,
    marginRight:20,
    fontSize:20,
    backgroundColor:"black"
  },
});

export const loginStyles = StyleSheet.create({
  inputContatiner:{
    flex:1,
    height:"100%",
    width:"100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"white",
  },
  inputField:{
    flex:0.4,
    width:"80%",
    //flexDirection:"column",
    justifyContent: 'flex-start',
    alignItems:"flex-start",
    backgroundColor:"white"
  },
  inputFont:{
    fontWeight:"bold",
    paddingLeft:20,
    marginTop:10,
  },
  inputText:{
    flex:0.15,
    
    marginTop:10,
    width:"100%",
    borderWidth: 2,
    borderRadius:30,
    borderColor:"#6E6E6E",
    //backgroundColor:"red",
  },
  inputTextField:{
    flex:1,
    marginLeft:20,
    marginRight:20,
    fontSize:20,
  },
  buttonArea:{
    flex:0.15,
    width:"60%",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:"red",
  },
  buttonStyle:{
    flex:0.5,
    margin:10,
    width:"80%",
    borderWidth: 2,
    borderRadius:30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#6E6E6E",
    borderColor:"#6E6E6E",
  },
  buttonFont:{
    fontWeight:"bold",
    color:"white",
  },
});

export const registStyle = StyleSheet.create({
  contatiner:{
    flex:1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: 'column',
    backgroundColor: "white",
  },
  promptBox: {
    flex: 0.15,
    margin:20,
    borderWidth:3,
    borderRadius:20,
    //marginRight:10,
    //flexDirection:"row",
    justifyContent: "center",
    alignItems: "flex-start",
    width: '90%',
    borderColor: "#6E6E6E",
    backgroundColor: "white",
  },
  promptBoxText: {
    fontWeight:"bold",
    color:"black",
    fontSize:15,
    margin:15,
  },
  buttom: {
    flex: 0.15,
    width: '90%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius:40,
    marginBottom:70,
    backgroundColor: "white",
  },
  slidePanel: {
    height:500,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius:40,
    backgroundColor: "#BDBDBD",
  },
  addButtomTextStyle:{
    fontWeight:"bold",
    color:"black",
    fontSize:20,
    marginTop:25,
  },
  closeButtom:{
    flex:0.1,
    marginBottom:15,
  },
  inputTextField:{
    flex:0.1,
    marginBottom:"10%",
    width:"80%",
    borderWidth: 2,
    borderRadius:30,
    borderColor:"black",
    backgroundColor:"white"
  },
  slidePanelList:{
    marginTop:20,
    flex:0.8,
    width:"80%",
    justifyContent: "center",
    flexDirection:"row",
    alignItems: "flex-start",
    //backgroundColor:"white",
  },
  slidePanelListItem: {
    flex:0.5,
    alignSelf: 'stretch',
    width:"100%",
    height:40,
    marginTop:5,
    borderRadius:40,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6E6E6E",
  },
  slidePanelListItemWarning: {
    flex:0.5,
    alignSelf: 'stretch',
    width:"100%",
    height:40,
    marginTop:5,
    borderRadius:40,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.warning,
  },
  slidePanelListItemTextContainter:{
    flex:0.5,
    marginLeft:15,
    flexDirection: 'row',
    justifyContent:"flex-start",
    
    //backgroundColor: "white",
  },
  planningTimeText:{
    marginTop:20,
    justifyContent:"flex-start"
  },
  planningTimeTextStyle:{
    fontWeight:"bold",
    marginLeft:15,
  },
  slidePanelListItemEnergyContainter:{
    flex:0.2,
    marginRight:15,
    width:"10%",
    flexDirection: 'row',
    alignItems:"center",
    justifyContent:"center",
    borderRadius:15,
    backgroundColor: colors.primary,
  },
  slidePanelListItemText:{
    fontSize:20,
    color:"white",
    fontWeight:"bold",
  },
  slidePanelListItemIcon:{
    flex:0.5,
    flexDirection: 'row',
    justifyContent:"flex-end",
    //backgroundColor:"black"
    //fontSize:20,
    //color:"black",
    //fontWeight:"bold",
    marginRight:5,
  },
  inputTextBox:{
    flex:0.1,
    marginBottom:"10%",
    width:"80%",
    borderWidth: 2,
    borderRadius:30,
    borderColor:"black",
    backgroundColor:"white",
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
  },
  inputTextField:{
    flex:1,
    marginLeft:20,
    marginRight:20,
    fontSize:15,
  },
  dailyPlanList:{
    flex:0.8,
    width:"80%",
    //backgroundColor:"black",
  },
  header: {
    justifyContent:"flex-start",
    alignItems: "flex-start",
    width:"100%",
    backgroundColor:"black"
  }

});

export const setUpStyle = StyleSheet.create({
  promptBox: {
    flex: 0.1,
    margin:20,
    borderWidth:3,
    borderRadius:20,
    //marginRight:10,
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '90%',
    borderColor: "#6E6E6E",
    backgroundColor: "white",
  },
  promptBoxTextContainer: {
    justifyContent:"center",
    alignItems:"flex-start"
  },
  promptBoxText:{
    fontWeight:"bold",
    color:"black",
    fontSize:15,
    margin:15,
  }, 
  promptBoxIcon:{
    justifyContent:"center",
    alignItems:"flex-end",
    marginRight:10
  }
});
export const planningPage = StyleSheet.create({
  promptBox:{
    flex: 0.15,
    marginTop:20,
    marginBottom:5,
    borderWidth:3,
    borderRadius:20,
    //marginRight:10,
    //flexDirection:"row",
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '90%',
    borderColor: "#6E6E6E",
    backgroundColor: "white",
  },
  promptBoxTextContainer: {
    flex:0.6,
    justifyContent:"center",
    alignItems:"center"
  },
  promptBoxText: {
    fontWeight:"bold",
    color:"black",
    fontSize:15,
    margin:5,
  },
  progressContainer:{
    flex:0.05,
    width:"90%",
    flexDirection:"row",
    justifyContent: "space-between",
    alignContent:"center"
  },
  progressTextContainer: {
    flex:0.03,
    //flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    //backgroundColor:"#6E6E6E"
    marginTop:10,
  },
  progressIconContainerHide: {
    flex:1,
    display:"none",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-end",
    //backgroundColor:"#6E6E6E"
  },
  progressIconContainerVis: {
    flex:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-end",
    //backgroundColor:"#6E6E6E"
  },
  progressIconContainerLeftHide:{
    flex:1,
    display:"none",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    //flexWrap:"wrap",
    //backgroundColor:"#6E6E6E"
  },
  progressIconContainerLeftVis: {
    flex:1,
    
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
  },
  progressText:{
    alignItems:"center",
    justifyContent: "center",
    fontWeight:"bold",
    marginRight:10,
    marginLeft:10,
    marginBottom:0,
  },

  promptBoxNumInputContainterHide:{
    flex:0.3,
    display:"none",
    marginRight:15,
    justifyContent:"center",
    alignItems:"flex-end"
  },
  promptBoxNumInputContainterVis:{
    flex:0.3,
    marginRight:15,
    justifyContent:"center",
    alignItems:"flex-end"
  },
  promptBox2Hide:{
    flex: 0.15,
    display:"none",
    marginTop:20,
    marginBottom:5,
    borderWidth:3,
    borderRadius:20,
    //marginRight:10,
    //flexDirection:"row",
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '90%',
    borderColor: "#6E6E6E",
    backgroundColor: "white",
  },
  promptBox2Vis:{
    flex: 0.15,
    marginTop:20,
    marginBottom:5,
    borderWidth:3,
    borderRadius:20,
    //marginRight:10,
    //flexDirection:"row",
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '90%',
    borderColor: "#6E6E6E",
    backgroundColor: "white",
  },
  modalCenterStyle:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalViewStyle:{
    flex:0.9,
    width:"90%",
    margin: 20,
    flexDirection:"column",
    alignContent:"center",
    justifyContent:"space-between",
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth:3,
    borderColor:colors.secondary,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2
    }
  }, 
  modalButtonView:{
    flex:0.1,
    flexDirection:"row",
    alignItems:"flex-end",
    justifyContent:"flex-end",
    //backgroundColor:"black"
  },
  modalButton:{
    flex:0.5,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    //backgroundColor:colors.secondary,

  },
  modalTitleTextContainer:{
    flex:0.1,
    alignItems:"flex-start",
    justifyContent:"flex-start",
    //backgroundColor:"black",
  },
  modalTitleStyle:{
    fontSize:20,
    fontWeight:"bold",
    color:"black",
  },
  modalTextStyle:{
    fontSize:15,
    fontWeight:"bold",
    color:"black",
    marginLeft: 15,
  },
  modalStartTimeInput:{
    flex:0.15,
    width:"90%",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginBottom:2,
    borderRadius:15,
    backgroundColor:colors.primary
  },
  modalNumInput:{
    flex:0.3,
    flexDirection:"row",
    marginRight:25,
    justifyContent:"center",
    alignItems:"flex-end"
  },
  time:{
    color:"blue",
    marginRight:15,
  }
});
export const trackingPage = StyleSheet.create({
    slidePanelListItemWarning: {
      flex:0.5,
      alignSelf: 'stretch',
      width:"100%",
      height:40,
      marginTop:5,
      borderRadius:40,
      borderWidth:2,
      borderColor:'green',
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
  },
  planningTimeTextStyle:{
    fontWeight:"bold",
    marginLeft:15,
    color:"green"
  },
});