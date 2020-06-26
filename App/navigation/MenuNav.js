import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { DeleteScreen, MenuScreen } from '../screens/Menu';
import AdminNav from './AdminNav';
import { Colors } from '../constants';
import { MAIN_FONT } from '../components';
import {
    Friends,
    ModuleEdit,
    MyProfile,
    PostCreate,
    ProfileEdit,
    UserProfile,
} from '../screens/Profile';

const MenuStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Menu';

function MenuNav() {
    return (
        <MenuStack.Navigator
            initialRouteName={INITIAL_ROUTE_NAME}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.appGreen,
                },
                headerTintColor: Colors.appWhite,
                headerPressColorAndroid: Colors.appWhite,
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: MAIN_FONT,
                    fontSize: 24,
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
            <MenuStack.Screen
                name="AdminNav"
                component={AdminNav}
                options={{ headerShown: false }}
            />
            <MenuStack.Screen
                name="Delete"
                component={DeleteScreen}
                options={{ headerTitle: 'Deleting account' }}
            />
            <MenuStack.Screen
                name="MyProfile"
                component={MyProfile}
                options={{ headerTitle: 'My Profile' }}
            />
            <MenuStack.Screen
                name="ProfileEdit"
                component={ProfileEdit}
                options={{ headerTitle: 'Edit Profile' }}
            />
            <MenuStack.Screen
                name="ModuleEdit"
                component={ModuleEdit}
                options={{ headerTitle: 'Edit Modules' }}
            />
            <MenuStack.Screen name="Friends" component={Friends} />
            <MenuStack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ headerTitle: 'Profile' }}
            />
            <MenuStack.Screen
                name="PostCreate"
                component={PostCreate}
                options={{ headerTitle: 'Create Post' }}
            />
        </MenuStack.Navigator>
    );
}

export default MenuNav;
