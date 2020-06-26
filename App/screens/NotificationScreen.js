import Icon from 'react-native-vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import { Colors } from '../constants/index';
import { MainText } from '../components';
import { LinearGradient } from 'expo-linear-gradient';

function NotificationScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                colors={[Colors.appGreen, Colors.appLightGreen]}
                style={styles.container}
            >
                <View style={styles.header}>
                    <MainText style={styles.title}>Notifications</MainText>
                </View>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                >
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
            </LinearGradient>
        </SafeAreaView>
    );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
    return (
        <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.optionIconContainer}>
                    <Icon name={icon} size={22} color="rgba(0,0,0,0.35)" />
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
        paddingBottom: 10,
        paddingTop: 20,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 15,
    },
    title: {
        textAlign: 'left',
        color: Colors.appWhite,
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
