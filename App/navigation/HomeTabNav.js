import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../components/index';
import { HomeScreen, NotificationScreen, ExploreScreen } from '../screens/index';
import MenuNav from './MenuNav';
import { Colors } from '../constants';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

class HomeTabNav extends Component {
    constructor(props) {
        super(props);
        this.props.navigation.setOptions({
            headerShown: false,
        });
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {Platform.OS === 'ios' ? (
                    <StatusBar barStyle="dark-content" />
                ) : (
                    <StatusBar backgroundColor="#248458" barStyle="light-content" />
                )}
                <BottomTab.Navigator
                    initialRouteName={INITIAL_ROUTE_NAME}
                    tabBarOptions={{
                        activeTintColor: Colors.appGreen,
                        keyboardHidesTabBar: true,
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
                        name="MenuNav"
                        component={MenuNav}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <TabBarIcon focused={focused} name="md-menu" />
                            ),
                            unmountOnBlur: true,
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: (e) => {
                                navigation.setParams({
                                    screen: undefined,
                                    params: undefined,
                                });
                            },
                        })}
                    />
                </BottomTab.Navigator>
            </SafeAreaView>
        );
    }
}

export default HomeTabNav;
