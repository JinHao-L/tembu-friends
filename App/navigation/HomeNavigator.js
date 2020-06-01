import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar } from 'react-native';

import HomeTabs from './HomeTabs';
import { ProfileScreen, UserListScreen } from '../screens/Menu';
import DeleteScreen from '../screens/Menu/DeleteScreen';

const MenuStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Home';

function HomeNavigator({ navigation }) {
    navigation.setOptions({
        headerShown: false,
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {Platform.OS === 'ios' ? (
                <StatusBar barStyle="dark-content" />
            ) : (
                <StatusBar backgroundColor="#248458" barStyle="light-content" />
            )}
            <MenuStack.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
                <MenuStack.Screen name="Home" component={HomeTabs} />
                <MenuStack.Screen name="Profile" component={ProfileScreen} />
                <MenuStack.Screen
                    name="Delete"
                    component={DeleteScreen}
                    options={{ headerTitle: 'Deleting account' }}
                />
            </MenuStack.Navigator>
        </SafeAreaView>
    );
}

export default HomeNavigator;
