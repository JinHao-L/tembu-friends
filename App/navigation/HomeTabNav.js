import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

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
            <SafeAreaView style={{ flex: 1 }}>
                {Platform.OS === 'ios' ? (
                    <View
                        style={{
                            width: '100%',
                            height: 20,
                            backgroundColor: Colors.appRed,
                        }}
                    >
                        <StatusBar barStyle={'light-content'} backgroundColor={Colors.appGreen} />
                    </View>
                ) : (
                    <StatusBar backgroundColor={Colors.appGreen} barStyle="light-content" />
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
            </SafeAreaView>
        );
    }
}

export default HomeTabNav;
