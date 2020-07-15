import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, View } from 'react-native';
import WebView from 'react-native-webview';
import { Button } from 'react-native-elements';

import { Colors } from '../constants/index';
import Layout from '../constants/Layout';
import { MAIN_FONT, MainText } from '../components';

const WebNavButton = ({ title, disabled, onPress }) => {
    return (
        <Button
            containerStyle={{ flex: 1, borderRadius: 0 }}
            buttonStyle={{
                backgroundColor: Colors.appGreen,
                borderRadius: 0,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: Colors.appWhite,
            }}
            title={title}
            titleStyle={{ fontFamily: MAIN_FONT, fontSize: 15, color: Colors.appWhite }}
            onPress={onPress}
            disabledStyle={{ backgroundColor: Colors.appGray1 }}
            disabledTitleStyle={{ color: Colors.appGray2 }}
            disabled={disabled}
        />
    );
};

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
        // this.webviewRef.current.injectJavaScript('window.location="' + this.homepage + '"');
    };

    frontButtonHandler = () => {
        if (this.state.canGoForward) {
            this.webviewRef.current.goForward();
        }
    };

    render() {
        const { canGoForward, canGoBack } = this.state;
        return (
            <SafeAreaView style={styles.container}>
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
            </SafeAreaView>
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
    contentContainer: {
        paddingTop: 30,
    },
    tabBarContainer: {
        flexDirection: 'row',
    },
    button: {
        color: Colors.appGreen,
        fontSize: 18,
    },
    disabledButton: {
        color: Colors.appGray2,
        fontSize: 18,
    },
});

export default HomeScreen;
