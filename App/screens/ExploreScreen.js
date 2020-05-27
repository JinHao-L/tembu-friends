import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';

import { MainText } from '../components';
import { Colors } from '../constants/index';

function LayoutScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <MainText>Layout</MainText>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.appBackground,
    },
});

export default LayoutScreen;
