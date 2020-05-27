import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SignUpScreen, SignInScreen, ForgetPassword } from '../screens/index';

const LoginStack = createStackNavigator();

function AuthNavigator({ navigation }) {
    navigation.setOptions({
        headerShown: false,
    });

    return (
        <LoginStack.Navigator initialRouteName="SignIn" headerMode="none">
            <LoginStack.Screen name="SignIn" component={SignInScreen} />
            <LoginStack.Screen name="SignUp" component={SignUpScreen} />
            <LoginStack.Screen name="ForgetPassword" component={ForgetPassword} />
        </LoginStack.Navigator>
    );
}

export default AuthNavigator;
