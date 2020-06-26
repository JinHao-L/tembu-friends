import React, { Component } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect } from 'react-redux';

import { fetchUserData } from '../redux';
import { TabBarIcon } from '../components/index';
import { HomeScreen, NotificationScreen } from '../screens/index';
import MenuNav from './MenuNav';
import { Colors } from '../constants';
import ExploreNav from './ExploreNav';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

const mapStateToProps = (state) => {
    return { personData: state.personData };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserData: () => {
            dispatch(fetchUserData());
        },
    };
};

class HomeTabNav extends Component {
    constructor(props) {
        super(props);
        this.props.fetchUserData();
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
                        name="ExploreNav"
                        component={ExploreNav}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <TabBarIcon focused={focused} name="md-search" />
                            ),
                            unmountOnBlur: true,
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
                        component={MenuNav}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <TabBarIcon focused={focused} name="md-menu" />
                            ),
                            unmountOnBlur: true,
                        }}
                    />
                </BottomTab.Navigator>
            </SafeAreaView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabNav);
