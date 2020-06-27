import Icon from 'react-native-vector-icons/Ionicons';
import * as React from 'react';
import { StyleSheet, View, SafeAreaView, Alert } from 'react-native';
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
                        label="New Friend Request"
                        onPress={() => Alert.alert('Not implemented')}
                    />

                    <OptionButton
                        icon="md-compass"
                        label="New Post"
                        onPress={() => Alert.alert('Not implemented')}
                    />

                    <OptionButton
                        icon="ios-chatboxes"
                        label="New Comment"
                        onPress={() => Alert.alert('Not implemented')}
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
