console.ignoredYellowBox = ['Setting a timer'];
import React, { Component } from 'react';
import { Platform, StyleSheet, View, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import { fetchUserData } from '../redux';
import { connect } from 'react-redux';

import { Colors } from '../constants/index';
import Layout from '../constants/Layout';

const mapStateToProps = (state) => {
    return { personData: state.personData };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserData: () => {
            dispatch(fetchUserData());
        },
    };
};

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.props.fetchUserData();
    }
    render() {
        return (
            <View style={styles.container}>
                <WebView
                    source={{ uri: 'https://tembusu.nus.edu.sg/' }}
                    style={{ width: Layout.window.width, flex: 1 }}
                    renderLoading={this.renderLoading}
                    startInLoadingState={true}
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
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: Colors.appBlack,
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: Colors.appGreen,
        paddingVertical: 20,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
