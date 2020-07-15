import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { ExploreScreen } from '../../screens';
import { Colors } from '../../constants';
import { MAIN_FONT, MainText } from '../../components';
import {
    ModuleEdit,
    MyProfile,
    MyQR,
    PostCreate,
    ProfileEdit,
    ScanQR,
    UserProfile,
} from '../../screens/Profile';
import { StyleSheet, View } from 'react-native';

const ExploreStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Search';

function ExploreNav() {
    return (
        <ExploreStack.Navigator
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
            <ExploreStack.Screen
                name="Search"
                component={ExploreScreen}
                options={{
                    header: (props) => {
                        return (
                            <View style={styles.header}>
                                <MainText style={styles.title}>Explore</MainText>
                            </View>
                        );
                    },
                }}
            />
            <ExploreStack.Screen
                name="MyProfile"
                component={MyProfile}
                options={{ headerTitle: 'My Profile' }}
            />
            <ExploreStack.Screen
                name="ProfileEdit"
                component={ProfileEdit}
                options={{ headerTitle: 'Edit Profile' }}
            />
            <ExploreStack.Screen
                name="ModuleEdit"
                component={ModuleEdit}
                options={{ headerTitle: 'Edit Modules' }}
            />
            <ExploreStack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ headerTitle: 'Profile' }}
            />
            <ExploreStack.Screen
                name="PostCreate"
                component={PostCreate}
                options={{ headerTitle: 'Write Post' }}
            />
            <ExploreStack.Screen name="MyQR" component={MyQR} options={{ headerShown: false }} />
            <ExploreStack.Screen
                name="ScanQR"
                component={ScanQR}
                options={{ headerShown: false }}
            />
        </ExploreStack.Navigator>
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

export default ExploreNav;
