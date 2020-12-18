import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, BackHandler, Text } from 'react-native';
import WebView from 'react-native-webview';

import { Colors, Layout } from 'constant';
import { LogoText } from 'components';
import { Icon } from 'react-native-elements';

class HomeScreen extends Component {
    state = {
        canGoBack: false,
        canGoForward: false,
        currentUrl: 'https://tembusu.nus.edu.sg',

        loading: false,
    };
    webviewRef = React.createRef();
    homepage = 'https://tembusu.nus.edu.sg';

    componentDidMount() {
        this.props.navigation.setParams({
            tapOnTabNavigator: this.homeButtonHandler,
        });
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.backButtonHandler);
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backButtonHandler);
    }

    backButtonHandler = () => {
        if (this.state.canGoBack) {
            this.webviewRef.goBack();
            return true;
        }
        return false;
    };

    homeButtonHandler = () => {
        const redirectTo = 'window.location = "' + this.homepage + '"';
        this.webviewRef.injectJavaScript(redirectTo);
        if (Platform.OS === 'android') {
            this.webviewRef.clearHistory();
        }
    };

    frontButtonHandler = () => {
        if (this.state.canGoForward) {
            this.webviewRef.goForward();
        }
    };

    render() {
        const { canGoForward, canGoBack, loading } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.tabBarContainer}>
                    <Icon
                        type={'ionicon'}
                        name={'ios-arrow-back'}
                        onPress={this.backButtonHandler}
                        size={26}
                        color={canGoBack ? Colors.appWhite : Colors.appGray4}
                        disabled={!canGoBack}
                        disabledStyle={{ backgroundColor: 'transparent' }}
                        containerStyle={{
                            backgroundColor: canGoBack ? Colors.appGreen : 'transparent',
                            borderRadius: 26,
                            marginLeft: 20,
                            width: 26,
                            height: 26,
                        }}
                    />
                    {loading ? (
                        <ActivityIndicator
                            size={30}
                            color={Colors.appGreen}
                            style={{ paddingVertical: 1 }}
                        />
                    ) : (
                        <LogoText
                            style={styles.title}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                            onPress={this.homeButtonHandler}
                        >
                            TEMBU<Text style={styles.title2}>FRIENDS</Text>
                        </LogoText>
                    )}
                    <Icon
                        type={'ionicon'}
                        name={'ios-arrow-forward'}
                        onPress={this.frontButtonHandler}
                        size={26}
                        color={canGoForward ? Colors.appWhite : Colors.appGray4}
                        disabled={!canGoForward}
                        disabledStyle={{ backgroundColor: 'transparent' }}
                        containerStyle={{
                            backgroundColor: canGoForward ? Colors.appGreen : 'transparent',
                            borderRadius: 26,
                            marginRight: 20,
                            width: 26,
                            height: 26,
                        }}
                    />
                </View>
                <WebView
                    source={{ uri: this.state.currentUrl }}
                    style={{ width: Layout.window.width }}
                    renderLoading={this.renderLoading}
                    startInLoadingState={true}
                    domStorageEnabled={true}
                    ref={(webView) => (this.webviewRef = webView)}
                    onNavigationStateChange={(navState) => {
                        this.setState({
                            canGoBack: navState.canGoBack,
                            canGoForward: navState.canGoForward,
                            currentUrl: navState.url,
                            loading: navState.loading,
                        });
                    }}
                />
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
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'visible',
        paddingVertical: 5,
        backgroundColor: Colors.appWhite,
    },
    title: {
        fontSize: 26,
        color: Colors.appGreen,
        textAlign: 'center',
    },
    title2: {
        color: Colors.appBlack,
    },
});

export default HomeScreen;
