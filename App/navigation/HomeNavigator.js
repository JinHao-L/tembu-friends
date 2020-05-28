import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, SafeAreaView } from 'react-native';

import HomeTabs from './HomeTabs';
import { ProfileScreen, UserListScreen } from '../screens/Menu';

const MenuStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Home';

function HomeNavigator({ navigation }) {
    navigation.setOptions({
        headerShown: false,
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="#278F5F" />
            <MenuStack.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
                <MenuStack.Screen name="Home" component={HomeTabs} />
                <MenuStack.Screen name="Profile" component={ProfileScreen} />
            </MenuStack.Navigator>
        </SafeAreaView>
    );
}

export default HomeNavigator;
