import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';

import {TabBarIcon} from '../components/index';
import {HomeScreen, LinksScreen, LayoutScreen} from '../screens/index';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({navigation, route}) {
    navigation.setOptions({headerTitle: getHeaderTitle(route)});

    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Get Started',
                    tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-code-working"/>,
                }}
            />
            <BottomTab.Screen
                name="FloorPlan"
                component={LayoutScreen}
                options={{
                    title: 'Floor Plan',
                    tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-book"/>,
                }}
            />
            <BottomTab.Screen
                name="Links"
                component={LinksScreen}
                options={{
                    title: 'Resources',
                    tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-book"/>,
                }}
            />
        </BottomTab.Navigator>
    );
}

function getHeaderTitle(route) {
    const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

    switch (routeName) {
        case 'Home':
            return 'How to get started';
        case 'FloorPlan':
            return 'Floor Plans';
        case 'Links':
            return 'Links to learn more';
    }
}
