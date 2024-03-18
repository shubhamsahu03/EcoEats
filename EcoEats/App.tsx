import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './common_tabs/LoginScreen';
import InfoScreen from './common_tabs/InfoScreen';
import SignupScreen from './common_tabs/SignupScreen';
import SearchScreen from './user_tabs/Search';
import Order from './user_tabs/Order';
const Stack = createNativeStackNavigator();

const App : React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
       <Stack.Screen name="Search" component={SearchScreen} />
       <Stack.Screen name="Info" component={InfoScreen} />
       <Stack.Screen name="Order" component={Order} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;