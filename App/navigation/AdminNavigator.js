import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { AdminScreen, ModuleScreen, UserListScreen } from '../screens';
import { Colors } from '../constants';

const AdminStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Admin';

function AdminNavigator() {
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
                component={AdminScreen}
                options={{ headerShown: false }}
            />
            <AdminStack.Screen
                name="Modules"
                component={ModuleScreen}
                options={{ headerTitle: 'Modules offered' }}
            />
            <AdminStack.Screen name="Users" component={UserListScreen} />
        </AdminStack.Navigator>
    );
}

export default AdminNavigator;
