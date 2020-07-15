import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { Colors } from '../../constants';
import { MAIN_FONT, MainText } from '../../components';
import { NotificationScreen } from '../../screens';
import { FriendRequests } from '../../screens/Menu';
import { ModuleEdit, MyProfile, PostCreate, ProfileEdit, UserProfile } from '../../screens/Profile';

const NotificationStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Notifications';

function NotificationNav() {
    return (
        <NotificationStack.Navigator
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
            <NotificationStack.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{
                    header: (props) => {
                        return (
                            <View style={styles.header}>
                                <MainText style={styles.title}>Notifications</MainText>
                            </View>
                        );
                    },
                }}
            />
            <NotificationStack.Screen
                name="FriendRequests"
                component={FriendRequests}
                options={{ headerTitle: 'Friend Requests' }}
            />
            <NotificationStack.Screen
                name="MyProfile"
                component={MyProfile}
                options={{ headerTitle: 'My Profile' }}
            />
            <NotificationStack.Screen
                name="ProfileEdit"
                component={ProfileEdit}
                options={{ headerTitle: 'Edit Profile' }}
            />
            <NotificationStack.Screen
                name="ModuleEdit"
                component={ModuleEdit}
                options={{ headerTitle: 'Edit Modules' }}
            />
            <NotificationStack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ headerTitle: 'Profile' }}
            />
            <NotificationStack.Screen
                name="PostCreate"
                component={PostCreate}
                options={{ headerTitle: 'Write Post' }}
            />
        </NotificationStack.Navigator>
    );
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.appGreen,
        paddingBottom: 10,
        paddingTop: 20,
    },
    title: {
        textAlign: 'left',
        color: Colors.appWhite,
        fontSize: 24,
        left: 15,
    },
});

export default NotificationNav;
