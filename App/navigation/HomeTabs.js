import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../components/index';
import { HomeScreen, ExploreScreen, NotificationScreen, MenuScreen } from '../screens/index';
import { withFirebase } from '../config/Firebase';
import { Colors } from '../constants';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

function HomeTabs({ navigation }) {
    navigation.setOptions({
        headerShown: false,
    });
    return (
        <BottomTab.Navigator
            initialRouteName={INITIAL_ROUTE_NAME}
            tabBarOptions={{
                activeTintColor: Colors.appGreen,
            }}
        >
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
                }}
            />
            <BottomTab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-search" />,
                }}
            />
            <BottomTab.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name="md-notifications" />
                    ),
                }}
            />
            <BottomTab.Screen
                name="Menu"
                component={MenuScreen}
                options={{
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-menu" />,
                }}
            />
        </BottomTab.Navigator>
    );
}

export default withFirebase(HomeTabs);
