import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors } from '../../constants';
import { MAIN_FONT } from '../../components';
import { NotificationScreen, FriendRequests } from '../../screens/Notifications';
import {
    ModuleEdit,
    MyProfile,
    MyQR,
    PostCreate,
    ProfileEdit,
    ScanQR,
    UserProfile,
} from '../../screens/Profile';

const NotificationStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Notifications';

function NotificationNav() {
    return (
        <NotificationStack.Navigator
            initialRouteName={INITIAL_ROUTE_NAME}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.appGreen,
                    elevation: 0,
                    shadowOpacity: 0,
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
                    marginLeft: Platform.OS === 'ios' ? 50 : 40,
                    paddingBottom: 3,
                },
                headerBackImage: () => (
                    <Icon name={'ios-arrow-back'} size={26} color={Colors.appWhite} />
                ),
                headerBackTitleVisible: false,
                headerLeftContainerStyle: { marginLeft: Platform.OS === 'ios' ? 20 : 5 },
            }}
        >
            <NotificationStack.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{
                    headerTitleContainerStyle: {
                        marginLeft: 0,
                    },
                }}
            />
            <NotificationStack.Screen
                name="FriendRequests"
                component={FriendRequests}
                options={{ headerTitle: 'Friend Requests' }}
            />
            <NotificationStack.Screen
                name="MyProfile"
                component={MyProfile}
                options={{ headerTitle: 'My Profile' }}
            />
            <NotificationStack.Screen
                name="ProfileEdit"
                component={ProfileEdit}
                options={{ headerTitle: 'Edit Profile' }}
            />
            <NotificationStack.Screen
                name="ModuleEdit"
                component={ModuleEdit}
                options={{ headerTitle: 'Edit Modules' }}
            />
            <NotificationStack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ headerTitle: 'Profile' }}
            />
            <NotificationStack.Screen
                name="PostCreate"
                component={PostCreate}
                options={{ headerTitle: 'Write Post' }}
            />
            <NotificationStack.Screen
                name="MyQR"
                component={MyQR}
                options={{ headerTitle: 'My QR Code' }}
            />
            <NotificationStack.Screen
                name="ScanQR"
                component={ScanQR}
                options={{ headerTitle: 'Scan QR Code' }}
            />
        </NotificationStack.Navigator>
    );
}

export default NotificationNav;
