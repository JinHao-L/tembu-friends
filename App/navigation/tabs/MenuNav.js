import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import {
    Friends,
    FriendRequests,
    DeleteScreen,
    MenuScreen,
    SettingsScreen,
    ContactUsScreen,
    FAQScreen,
} from '../../screens/Menu';
import { AdminNav } from '../menus';
import { Colors } from '../../constants';
import { MAIN_FONT } from '../../components';
import {
    ModuleEdit,
    MyProfile,
    PostCreate,
    ProfileEdit,
    UserProfile,
    MyQR,
    ScanQR,
} from '../../screens/Profile';

const MenuStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Menu';

function MenuNav() {
    return (
        <MenuStack.Navigator
            initialRouteName={INITIAL_ROUTE_NAME}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.appGreen,
                    elevation: 0,
                },
                headerTintColor: Colors.appWhite,
                headerPressColorAndroid: Colors.appWhite,
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: MAIN_FONT,
                    fontSize: 26,
                },
                headerTitleContainerStyle: {
                    left: 0,
                    marginLeft: 50,
                    paddingBottom: 3,
                },
                headerBackImage: () => (
                    <Icon name={'ios-arrow-back'} size={26} color={Colors.appWhite} />
                ),
                headerBackTitleVisible: false,
                headerLeftContainerStyle: { paddingLeft: 20 },
            }}
        >
            <MenuStack.Screen
                name="Menu"
                component={MenuScreen}
                options={{
                    headerTitleContainerStyle: {
                        marginLeft: 0,
                    },
                }}
            />
            <MenuStack.Screen
                name="AdminNav"
                component={AdminNav}
                options={{ headerShown: false }}
            />
            <MenuStack.Screen name="Settings" component={SettingsScreen} />
            <MenuStack.Screen
                name="ContactUs"
                component={ContactUsScreen}
                options={{ headerTitle: 'Contact Us' }}
            />
            <MenuStack.Screen name="FAQ" component={FAQScreen} options={{ headerTitle: 'FAQ' }} />
            <MenuStack.Screen
                name="Delete"
                component={DeleteScreen}
                options={{ headerTitle: 'Delete Account' }}
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
                name="FriendRequests"
                component={FriendRequests}
                options={{ headerTitle: 'Friend Requests' }}
            />
            <MenuStack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ headerTitle: 'Profile' }}
            />
            <MenuStack.Screen
                name="PostCreate"
                component={PostCreate}
                options={{ headerTitle: 'Write Post' }}
            />
            <MenuStack.Screen
                name="MyQR"
                component={MyQR}
                options={{ headerTitle: 'My QR Code' }}
            />
            <MenuStack.Screen
                name="ScanQR"
                component={ScanQR}
                options={{ headerTitle: 'Scan QR Code' }}
            />
        </MenuStack.Navigator>
    );
}

export default MenuNav;
