import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors, TITLE_FONT } from '../../constant';
import {
    ModuleEdit,
    MyProfile,
    MyQR,
    PostCreate,
    ProfileEdit,
    ScanQR,
    UserProfile,
} from '../../screens/Profile';
import { ExploreScreen } from '../../screens/Explore';

const ExploreStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Explore';

function ExploreNav() {
    return (
        <ExploreStack.Navigator
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
                    fontFamily: TITLE_FONT,
                    fontSize: 30,
                },
                headerTitleContainerStyle: {
                    left: 0,
                    marginLeft: Platform.OS === 'ios' ? 50 : 40,
                    // paddingBottom: 3,
                },
                headerBackImage: () => (
                    <Icon name={'ios-arrow-back'} size={26} color={Colors.appWhite} />
                ),
                headerBackTitleVisible: false,
                headerLeftContainerStyle: { marginLeft: Platform.OS === 'ios' ? 20 : 5 },
            }}
        >
            <ExploreStack.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    headerTitleContainerStyle: {
                        marginLeft: 0,
                    },
                }}
            />
            <ExploreStack.Screen
                name="MyProfile"
                component={MyProfile}
                options={{ headerTitle: 'My Profile' }}
            />
            <ExploreStack.Screen
                name="ProfileEdit"
                component={ProfileEdit}
                options={{ headerTitle: 'Edit Profile' }}
            />
            <ExploreStack.Screen
                name="ModuleEdit"
                component={ModuleEdit}
                options={{ headerTitle: 'Edit Modules' }}
            />
            <ExploreStack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ headerTitle: 'Profile' }}
            />
            <ExploreStack.Screen
                name="PostCreate"
                component={PostCreate}
                options={{ headerTitle: 'Write Post' }}
            />
            <ExploreStack.Screen
                name="MyQR"
                component={MyQR}
                options={{ headerTitle: 'My QR Code' }}
            />
            <ExploreStack.Screen
                name="ScanQR"
                component={ScanQR}
                options={{ headerTitle: 'Scan QR Code' }}
            />
        </ExploreStack.Navigator>
    );
}

export default ExploreNav;
