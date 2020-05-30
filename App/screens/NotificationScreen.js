import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import { Colors } from '../constants/index';
import { MainText } from '../components';

function NotificationScreen({ navigation }) {
    navigation.setOptions({
        headerShown: true,
    });
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <MainText style={styles.title}>Notifications</MainText>
            </View>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <OptionButton
                    icon="md-school"
                    label="Testing Link 1"
                    onPress={() => WebBrowser.openBrowserAsync('https://docs.expo.io')}
                />

                <OptionButton
                    icon="md-compass"
                    label="Testing Link 2"
                    onPress={() => WebBrowser.openBrowserAsync('https://reactnavigation.org')}
                />

                <OptionButton
                    icon="ios-chatboxes"
                    label="Testng Link 3"
                    onPress={() => WebBrowser.openBrowserAsync('https://forums.expo.io')}
                    isLastOption
                />
            </ScrollView>
        </View>
    );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
    return (
        <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.optionIconContainer}>
                    <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
                </View>
                <View style={styles.optionTextContainer}>
                    <MainText style={styles.optionText}>{label}</MainText>
                </View>
            </View>
        </RectButton>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#248458',
        paddingBottom: 10,
        paddingTop: 20,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.appBackground,
    },
    contentContainer: {
        paddingTop: 15,
    },
    title: {
        textAlign: 'left',
        color: 'white',
        fontSize: 24,
        left: 30,
    },
    optionIconContainer: {
        marginRight: 12,
    },
    option: {
        backgroundColor: '#fdfdfd',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 0,
        borderColor: '#ededed',
    },
    lastOption: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionText: {
        fontSize: 15,
        alignSelf: 'flex-start',
        marginTop: 1,
    },
});

export default NotificationScreen;
