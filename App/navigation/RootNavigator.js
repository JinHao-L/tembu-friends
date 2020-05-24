import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { LoadingScreen } from '../screens/AuthScreens/index';
import { withFirebase } from '../config/Firebase';
import { NavigationContainer } from '@react-navigation/native';
import LinkConfig from './config/LinkConfig';

const RootStack = createStackNavigator();

class RootNavigator extends Component {
    state = {
        loading: {
            isUserLoading: true,
            isAssetsLoading: true,
        },
        user: '',
    };

    async componentDidMount() {
        try {
            await this.loadLocalAsync().then(() => {
                this.setState({ loading: { isAssetsLoading: false } });
            });

            await this.props.firebase.checkUserAuth((result) => {
                this.setState({ user: result });
                if (this.state.isUserLoading) {
                    this.setState({ loading: { isUserLoading: false } });
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    async loadLocalAsync() {
        return await Promise.all([
            Asset.loadAsync([require('../assets/images/logo.png')]).then(() =>
                console.log('logo done')
            ),
            Font.loadAsync({
                ...Ionicons.font,
                'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
                'futura-md': require('../assets/fonts/Futura-Medium-BT.ttf'),
            }).then(() => console.log('font done')),
        ]);
    }

    render() {
        const { loading, user } = this.state;

        return (
            <NavigationContainer linking={LinkConfig}>
                <RootStack.Navigator headerMode="none">
                    {loading.isUserLoading || loading.isAssetsLoading ? (
                        // Not ready yet
                        <RootStack.Screen name="Loading" component={LoadingScreen} />
                    ) : user ? (
                        <RootStack.Screen name="App" component={AppNavigator} />
                    ) : (
                        <RootStack.Screen name="Auth" component={AuthNavigator} />
                    )}
                </RootStack.Navigator>
            </NavigationContainer>
        );
    }
}

export default withFirebase(RootNavigator);
