import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../components/index';
import { HomeScreen, LinksScreen, LayoutScreen } from '../screens/index';
import { Colors } from '../constants/index';
import { HomeLinkConfig } from './config';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

class AppNavigator extends Component {
    // componentDidMount() {
    //     const { navigation, route } = this.state;
    //
    //     navigation.setOptions({
    //         headerTitle: getHeaderTitle(route),
    //         headerLeft: null,
    //         headerStyle: {
    //             backgroundColor: Colors.headerBackground,
    //         },
    //         headerTintColor: Colors.headerText,
    //         headerTitleAlign: 'center',
    //     });
    // }
    render() {
        return (
            // <NavigationContainer linking={HomeLinkConfig}>
            <BottomTab.Navigator
                initialRouteName={INITIAL_ROUTE_NAME}
                // setOptions={{
                //     headerTitle: getHeaderTitle(this.state.route),
                //     headerLeft: null,
                //     headerStyle: {
                //         backgroundColor: Colors.headerBackground,
                //     },
                //     headerTintColor: Colors.headerText,
                //     headerTitleAlign: 'center',
                // }}
            >
                <BottomTab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'Get Started',
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon focused={focused} name="md-code-working" />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="FloorPlan"
                    component={LayoutScreen}
                    options={{
                        title: 'Floor Plan',
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon focused={focused} name="md-business" />
                        ),
                    }}
                />
                <BottomTab.Screen
                    name="Links"
                    component={LinksScreen}
                    options={{
                        title: 'Resources',
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon focused={focused} name="md-book" />
                        ),
                    }}
                />
            </BottomTab.Navigator>
            // </NavigationContainer>
        );
    }
}

function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'Home':
            return 'Welcome Home';
        case 'FloorPlan':
            return 'Floor Plans';
        case 'Links':
            return 'Links to learn more';
    }
}

export default AppNavigator;
