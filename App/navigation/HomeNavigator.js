import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HomeTabs from './HomeTabs';
import { ProfileScreen, UserListScreen } from '../screens/Menu';
import { Colors } from '../constants';
import { textStyles } from '../components';

const MenuStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Home';

function HomeNavigator({ navigation, route }) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="#278F5F" />
            <MenuStack.Navigator
                initialRouteName={INITIAL_ROUTE_NAME}
                screenOptions={{
                    headerVisible: fals,
                    // headerStyle: { backgroundColor: Colors.headerBackground },
                    // headerTitleStyle: {
                    //     ...textStyles,
                    //     fontSize: 20,
                    // },
                    // headerTintColor: Colors.headerText,
                    // headerTitleAlign: 'left',
                }}
            >
                <MenuStack.Screen name="Home" component={HomeTabs} />
                <MenuStack.Screen name="Profile" component={ProfileScreen} />
            </MenuStack.Navigator>
        </SafeAreaView>
    );
}

export default HomeNavigator;
