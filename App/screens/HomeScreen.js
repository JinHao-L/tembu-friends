import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import { Colors } from '../constants/index';
import Layout from '../constants/Layout';

class HomeScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    source={{ uri: 'https://tembusu.nus.edu.sg/' }}
                    style={{ width: Layout.window.width, flex: 1 }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appBackground,
        alignItems: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
});

export default HomeScreen;
