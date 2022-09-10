// // For the majority the screens in my project I followed a tutorial to do this code: https://www.youtube.com/watch?v=MJzmZ9qmdaE&ab_channel=SonnySangha

import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import HomeScreenGuest from './screens/HomeScreenGuest';
import ChatScreen from './screens/ChatScreen';
import ChatScreenGuest from './screens/ChatScreenGuest';
import VerifyScreen from './screens/VerifyScreen';
import UploadScreen from './screens/UploadScreen';
import Open from './features/Open';
import SetPin from './features/SetPin';
import EnterPin from './features/EnterPin';
import EnterPinLogin from './features/EnterPinLogin';
import { MenuProvider} from 'react-native-popup-menu';
import { LogBox } from 'react-native';

// Taken from https://github.com/facebook/react-native/issues/28453
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "pink" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
}

const App: () => React$Node = () => {
  return (

    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator 
        screenOptions={globalScreenOptions}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="HomeScreenGuest" component={HomeScreenGuest} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ChatScreenGuest" component={ChatScreenGuest} />
          <Stack.Screen name="Upload" component={UploadScreen} />

          <Stack.Screen name="SetPin" component={SetPin} />
          <Stack.Screen name="EnterPin" component={EnterPin} />
          <Stack.Screen name="EnterPinLogin" component={EnterPinLogin} />
          <Stack.Screen name="Open" component={Open} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;