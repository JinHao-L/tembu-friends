import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { LoadingScreen, SignUpScreen, SignInScreen } from '../screens/index';
import { Colors } from '../constants';

const AuthStack = createStackNavigator();

function AuthNavigator({ navigation, route }) {
    navigation.setOptions({
        headerShown: false,
    });
    return (
        <AuthStack.Navigator
            initialRouteName="Loading"
            screenOptions={{
                headerShown: false,
            }}
        >
            <AuthStack.Screen name="Loading" component={LoadingScreen} />
            <AuthStack.Screen name="SignUp" component={SignUpScreen} />
            <AuthStack.Screen name="SignIn" component={SignInScreen} />
        </AuthStack.Navigator>
    );
}

export default AuthNavigator;
