import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { MainText } from '../../components';
import { Colors } from '../../constants';

class ProfileScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <MainText> Ipsum Lorem </MainText>
                </View>
            </View>
        );
    }
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProfileScreen;
