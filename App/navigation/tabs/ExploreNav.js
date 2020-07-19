import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { SearchNav } from '../topbarNav/index';
import { Colors } from '../../constants';
import { MAIN_FONT } from '../../components';
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
                    // shadowOpacity: 0,
                    // borderBottomWidth: 0,
                    // shadowOffset: { height: 0, width: 0 },
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
            <ExploreStack.Screen name="MyQR" component={MyQR} options={{ headerShown: false }} />
            <ExploreStack.Screen
                name="ScanQR"
                component={ScanQR}
                options={{ headerShown: false }}
            />
        </ExploreStack.Navigator>
    );
}

export default ExploreNav;
