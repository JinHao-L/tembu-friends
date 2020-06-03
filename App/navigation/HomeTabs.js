import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../components/index';
import { HomeScreen, ExploreScreen, NotificationScreen } from '../screens/index';
import MenuNavigator from './MenuNavigator';
import { Colors } from '../constants';
import { View, StatusBar } from 'react-native';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

function HomeTabs({ navigation }) {
    navigation.setOptions({
        headerShown: false,
    });
    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === 'ios' ? (
                <StatusBar barStyle="dark-content" />
            ) : (
                <StatusBar backgroundColor="#248458" barStyle="light-content" />
            )}
            <BottomTab.Navigator
                initialRouteName={INITIAL_ROUTE_NAME}
                tabBarOptions={{
                    activeTintColor: Colors.appGreen,
                    showLabel: false,
                }}
            >
                <BottomTab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon focused={focused} name="md-home" />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="Explore"
                    component={ExploreScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon focused={focused} name="md-search" />
                        ),
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
                    name="Menus"
                    component={MenuNavigator}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon focused={focused} name="md-menu" />
                        ),
                    }}
                />
            </BottomTab.Navigator>
        </View>
    );
}

export default HomeTabs;
