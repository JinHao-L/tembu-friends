import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { SignUpScreen, SignInScreen, ForgetPassword } from '../screens/index';
import { AuthLinkConfig } from './config';

const LoginStack = createStackNavigator();

function AuthNavigator({ navigation }) {
    navigation.setOptions({
        headerShown: false,
    });

    return (
        // <NavigationContainer linking={AuthLinkConfig}>
        <LoginStack.Navigator initialRouteName="SignIn" headerMode="none">
            <LoginStack.Screen name="SignIn" component={SignInScreen} />
            <LoginStack.Screen name="SignUp" component={SignUpScreen} />
            <LoginStack.Screen name="ForgetPassword" component={ForgetPassword} />
        </LoginStack.Navigator>
        // </NavigationContainer>
    );
}

export default AuthNavigator;
