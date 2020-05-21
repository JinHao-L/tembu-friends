import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import 'react-native-gesture-handler';
import { Platform, StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import useCachedResources from './hooks/useCachedResources';
import * as firebase from 'firebase';
import firebaseConfig from '../firebaseConfig';

import { AuthNavigator, BottomTabNavigator, LinkingConfiguration } from './navigation';

const Stack = createStackNavigator();

firebase.initializeApp(firebaseConfig);

export default function App() {
    const isLoadingComplete = useCachedResources();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <SafeAreaView style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
                <NavigationContainer linking={LinkingConfiguration}>
                    <Stack.Navigator initalRouteName="Auth">
                        <Stack.Screen
                            name="Auth"
                            component={AuthNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="Root" component={BottomTabNavigator} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
