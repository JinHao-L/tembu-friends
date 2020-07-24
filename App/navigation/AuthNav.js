import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SignUpScreen, SignInScreen, ForgetPassword } from 'screens/Auth';

const AuthStack = createStackNavigator();

function AuthNav({ navigation }) {
    navigation.setOptions({
        headerShown: false,
    });

    return (
        <AuthStack.Navigator initialRouteName="SignIn" headerMode="none">
            <AuthStack.Screen name="SignIn" component={SignInScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
            <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
        </AuthStack.Navigator>
    );
}

export default AuthNav;
