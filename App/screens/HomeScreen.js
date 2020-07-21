import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import WebView from 'react-native-webview';

import { Colors, Layout } from '../constants';
import { WebNavButton } from '../components';

class HomeScreen extends Component {
    state = {
        canGoBack: false,
        canGoForward: false,
        currentUrl: 'https://tembusu.nus.edu.sg/',
    };
    webviewRef = React.createRef();
    homepage = 'https://tembusu.nus.edu.sg/';

    backButtonHandler = () => {
        if (this.state.canGoBack) {
            this.webviewRef.current.goBack();
        }
    };

    homeButtonHandler = () => {
        this.setState({ currentUrl: this.homepage });
    };

    frontButtonHandler = () => {
        if (this.state.canGoForward) {
            this.webviewRef.current.goForward();
        }
    };

    render() {
        const { canGoForward, canGoBack } = this.state;
        return (
            <View style={styles.container}>
                <WebView
                    source={{ uri: this.state.currentUrl }}
                    style={{ width: Layout.window.width }}
                    renderLoading={this.renderLoading}
                    startInLoadingState={true}
                    domStorageEnabled={true}
                    javaScriptEnabled={true}
                    ref={this.webviewRef}
                    onNavigationStateChange={(navState) => {
                        this.setState({
                            canGoBack: navState.canGoBack,
                            canGoForward: navState.canGoForward,
                            currentUrl: navState.url,
                        });
                    }}
                />
                <View style={styles.tabBarContainer}>
                    <WebNavButton
                        onPress={this.backButtonHandler}
                        disabled={!canGoBack}
                        title={'Back'}
                    />
                    <WebNavButton onPress={this.homeButtonHandler} title={'Home'} />
                    <WebNavButton
                        onPress={this.frontButtonHandler}
                        disabled={!canGoForward}
                        title={'Forward'}
                    />
                </View>
            </View>
        );
    }
}

function renderLoading() {
    return <ActivityIndicator size="large" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
        alignItems: 'center',
    },
    tabBarContainer: {
        flexDirection: 'row',
    },
});

export default HomeScreen;
