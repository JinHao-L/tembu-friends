import React, { Component } from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import HomeNavigator from './HomeNavigator';
import AuthNavigator from './AuthNavigator';
import { LoadingScreen } from '../screens/index';
import { withFirebase } from '../config/Firebase';
import { NavigationContainer } from '@react-navigation/native';
import LinkConfig from './config/LinkConfig';

const RootStack = createStackNavigator();

class RootNavigator extends Component {
    state = {
        loading: {
            isUserLoading: true,
            isAssetsLoading: true,
            isUserSignedIn: false,
        },
        timerCounting: true,
        userVerified: false,
    };

    async componentDidMount() {
        this._isMounted = true;
        console.log('Starting app');
        try {
            await this.loadLocalAsync().then(() => {
                this.setState({ loading: { isAssetsLoading: false } });
            });

            await this.props.firebase.checkUserAuth((result) => {
                if (result) {
                    this.setState({
                        user: result,
                        userVerified: result.emailVerified,
                        loading: {
                            isUserLoading: false,
                            isUserSignedIn: true,
                        },
                    });
                } else {
                    this.setState({
                        loading: {
                            isUserLoading: false,
                        },
                    });
                }
            });

            setTimeout(() => {
                this.setState({
                    timerCounting: false,
                });
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
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
        const { loading, userVerified, timerCounting } = this.state;

        return (
            <NavigationContainer>
                <RootStack.Navigator>
                    {timerCounting || loading.isUserLoading || loading.isAssetsLoading ? (
                        <RootStack.Screen
                            name="Loading"
                            component={LoadingScreen}
                            initialParams={{
                                children: loading,
                            }}
                        />
                    ) : // ) : user && userVerified ? (
                    loading.isUserSignedIn ? (
                        <RootStack.Screen name="App" component={HomeNavigator} />
                    ) : (
                        <RootStack.Screen
                            name="Auth"
                            component={AuthNavigator}
                            initialParams={userVerified}
                        />
                    )}
                </RootStack.Navigator>
            </NavigationContainer>
        );
    }
}

export default withFirebase(RootNavigator);
