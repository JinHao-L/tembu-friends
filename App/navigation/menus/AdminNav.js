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
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: Colors.appWhite,
                headerPressColorAndroid: Colors.appWhite,
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: MAIN_FONT,
                    fontSize: 26,
                },
                headerTitleContainerStyle: {
                    left: 0,
                    marginLeft: Platform.OS === 'ios' ? 50 : 40,
                    paddingBottom: 3,
                },
                headerBackImage: () => (
                    <Icon name={'ios-arrow-back'} size={26} color={Colors.appWhite} />
                ),
                headerBackTitleVisible: false,
                headerLeftContainerStyle: { marginLeft: Platform.OS === 'ios' ? 20 : 5 },
            }}
        >
            <AdminStack.Screen
                name="Admin"
                component={AdminMenu}
                options={{ headerTitle: 'Admin' }}
            />
            <AdminStack.Screen
                name="Reports"
                component={ReportsControl}
                options={{ headerTitle: 'Reported Posts' }}
            />
            <AdminStack.Screen
                name="Users"
                component={UserListScreen}
                options={{ headerTitle: 'Users' }}
            />
        </AdminStack.Navigator>
    );
}

export default AdminNav;
