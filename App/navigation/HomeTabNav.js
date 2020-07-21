import React, { Component, Fragment } from 'react';
import { StatusBar, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../components';
import { HomeScreen } from '../screens';
import { MenuNav, NotificationNav, ExploreNav } from './tabs';
import { Colors } from '../constants';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

class HomeTabNav extends Component {
    constructor(props) {
        super(props);
        this.props.navigation.setOptions({
            headerShown: false,
            headerBackTitleVisible: false,
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor={Colors.appGreen} />
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
                        name="ExploreNav"
                        component={ExploreNav}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <TabBarIcon focused={focused} name="md-search" />
                            ),
                        }}
                    />
                    <BottomTab.Screen
                        name="NotificationNav"
                        component={NotificationNav}
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
                        }}
                    />
                </BottomTab.Navigator>
            </View>
        );
    }
}

export default HomeTabNav;
