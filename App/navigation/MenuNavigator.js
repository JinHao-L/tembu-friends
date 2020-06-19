import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import {
    ProfileScreen,
    ProfileEditScreen,
    DeleteScreen,
    MenuScreen,
    ModuleEditScreen,
} from '../screens';
import AdminNavigator from './AdminNavigator';
import { Colors } from '../constants';
import { MAIN_FONT } from '../components';

const MenuStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Menu';

function MenuNavigator() {
    return (
        <MenuStack.Navigator
            initialRouteName={INITIAL_ROUTE_NAME}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.appGreen,
                },
                headerTintColor: Colors.appWhite,
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: MAIN_FONT,
                },
                headerTitleContainerStyle: {
                    left: 0,
                    marginLeft: 40,
                },
                headerBackImage: () => (
                    <Icon name={'ios-arrow-back'} size={28} color={Colors.appWhite} />
                ),
                headerLeftContainerStyle: { marginLeft: 5 },
            }}
        >
            <MenuStack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
            <MenuStack.Screen name="Profile" component={ProfileScreen} />
            <MenuStack.Screen
                name="ProfileEdit"
                component={ProfileEditScreen}
                options={{ headerTitle: 'Edit Profile' }}
            />
            <MenuStack.Screen
                name="ModuleEdit"
                component={ModuleEditScreen}
                options={{ headerTitle: 'Edit Modules' }}
            />
            <MenuStack.Screen
                name="AdminNavi"
                component={AdminNavigator}
                options={{ headerShown: false }}
            />
            <MenuStack.Screen
                name="Delete"
                component={DeleteScreen}
                options={{ headerTitle: 'Deleting account' }}
            />
        </MenuStack.Navigator>
    );
}

export default MenuNavigator;
