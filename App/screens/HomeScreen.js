import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';

import { Colors } from '../constants/index';
import Layout from '../constants/Layout';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    source={{ uri: 'https://tembusu.nus.edu.sg/' }}
                    style={{ width: Layout.window.width, flex: 1 }}
                    renderLoading={this.renderLoading}
                    startInLoadingState={true}
                    domStorageEnabled={true}
                    javaScriptEnabled={true}
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
        backgroundColor: Colors.appLightGreen,
        alignItems: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
});

export default HomeScreen;
