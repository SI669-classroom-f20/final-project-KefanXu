import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen } from './LoginScreen';
import { RegistPage } from './RegistPage';
import { AllSetScreen } from './AllSetScreen';
import { PlanningPage } from './PlanningPage';
import { TrackingPage } from './TrackingPage';
import { ReflectivePlanning } from './ReflectivePlanning';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"   
        screenOptions={{
          headerShown: true
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={RegistPage} />
        <Stack.Screen name="All Set!" component={AllSetScreen} />
        <Stack.Screen name="Plan Your Day" component={PlanningPage} />
        <Stack.Screen name="Tracking" component={TrackingPage} />
        <Stack.Screen name="Reflective Planning" component={ReflectivePlanning} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;