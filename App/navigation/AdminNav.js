import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { AdminMenu, ReportsControl, UserListScreen } from '../screens/Menu/Admin';
import { Colors } from '../constants';

const AdminStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Admin';

function AdminNav() {
    return (
        <AdminStack.Navigator
            initialRouteName={INITIAL_ROUTE_NAME}
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.appGreen,
                },
                headerTintColor: Colors.appWhite,
                headerTitleAlign: 'center',
                headerBackImage: () => (
                    <Icon name={'ios-arrow-back'} size={28} color={Colors.appWhite} />
                ),
                headerLeftContainerStyle: { marginLeft: 5 },
            }}
        >
            <AdminStack.Screen
                name="Admin"
                component={AdminMenu}
                options={{ headerShown: false }}
            />
            <AdminStack.Screen
                name="Reports"
                component={ReportsControl}
                options={{ headerTitle: 'Reports' }}
            />
            <AdminStack.Screen name="Users" component={UserListScreen} />
        </AdminStack.Navigator>
    );
}

export default AdminNav;
