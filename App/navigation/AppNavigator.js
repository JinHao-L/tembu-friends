import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Colors } from '../constants/index';
import { TabBarIcon } from '../components/index';
import { HomeScreen, DiscoverScreen, NotificationScreen, ProfileScreen } from '../screens/index';
import { withFirebase } from '../config/Firebase';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

function AppNavigator({ navigation, route }) {
    navigation.setOptions({
        headerTitle: getHeaderTitle(route),
        headerLeft: null,
        headerStyle: {
            backgroundColor: Colors.headerBackground,
        },
        headerTintColor: Colors.headerText,
        headerTitleAlign: 'center',
    });

    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Welcome',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name="md-code-working" />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Discover"
                component={DiscoverScreen}
                options={{
                    title: 'Discover Friends',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-search" />,
                }}
            />
            <BottomTab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name="md-notifications" />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'My Profile',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
                }}
            />
        </BottomTab.Navigator>
    );
}

function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'Home':
            return 'Welcome Home';
        // return 'Welcome Home ' + this.props.firebase.getDisplayName();
        case 'Discover':
            return 'Make Friends';
        case 'Notification':
            return 'Notifications';
        case 'Profile':
            return 'My Profile';
    }
}

export default withFirebase(AppNavigator);
