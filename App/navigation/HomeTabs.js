import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect } from 'react-redux';

import { fetchUserData } from '../redux';
import { TabBarIcon } from '../components/index';
import { HomeScreen, ExploreScreen, NotificationScreen } from '../screens/index';
import MenuNavigator from './MenuNavigator';
import { Colors } from '../constants';

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

class HomeTabs extends Component {
    constructor(props) {
        super(props);
        this.props.fetchUserData();
        this.props.navigation.setOptions({
            headerShown: false,
        });
    }

    render() {
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
                    screenOptions={{
                        unmountOnBlur: true,
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
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeTabs);
