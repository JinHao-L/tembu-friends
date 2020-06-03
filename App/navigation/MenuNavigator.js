import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
    ProfileScreen,
    UserListScreen,
    ProfileEditScreen,
    DeleteScreen,
    MenuScreen,
} from '../screens';

const MenuStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Menu';

function MenuNavigator() {
    return (
        <MenuStack.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <MenuStack.Screen name="Menu" component={MenuScreen} />
            <MenuStack.Screen name="Profile" component={ProfileScreen} />
            <MenuStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <MenuStack.Screen
                name="Delete"
                component={DeleteScreen}
                options={{ headerTitle: 'Deleting account' }}
            />
        </MenuStack.Navigator>
    );
}

export default MenuNavigator;
