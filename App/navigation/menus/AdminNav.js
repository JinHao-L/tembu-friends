import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { AdminMenu, ReportsControl, UserListScreen } from '../../screens/Admin';
import { Colors } from '../../constants';
import { MAIN_FONT } from '../../components';

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
                headerPressColorAndroid: Colors.appWhite,
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: MAIN_FONT,
                    fontSize: 24,
                },
                headerTitleContainerStyle: {
                    left: 0,
                    marginLeft: 40,
                },
                headerBackImage: () => (
                    <Icon name={'ios-arrow-back'} size={28} color={Colors.appWhite} />
                ),
                headerBackTitleVisible: false,
                headerLeftContainerStyle: { marginLeft: 5 },
            }}
        >
            <AdminStack.Screen
                name="Admin"
                component={AdminMenu}
                options={{ headerTitle: 'Admin Privileges' }}
            />
            <AdminStack.Screen name="Reports" component={ReportsControl} />
            <AdminStack.Screen name="Users" component={UserListScreen} />
        </AdminStack.Navigator>
    );
}

export default AdminNav;
