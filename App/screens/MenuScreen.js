import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import { Colors, Layout } from '../constants';
import { withFirebase } from '../config/Firebase';
import { MenuButton, Popup, Root } from '../components';

class MenuScreen extends Component {
    state = {
        isVisible: false,
    };
    signOut = async () => {
        try {
            await this.props.firebase.signOut();
        } catch (error) {
            console.log(error);
        }
    };

    goToProfile = () => {
        this.props.navigation.navigate('Profile');
    };

    showPopup = () => {
        Popup.show({
            type: 'Success',
            title: 'It works',
            body: 'Congrats! The popup is open\nClosing in 5 seconds',
            button: true,
            buttonText: 'Close',
            autoClose: true,
            callback: () => {
                Console.log('popup closed');
                Popup.hide();
            },
        });
    };

    render() {
        return (
            <Root>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                >
                    <View>
                        <MenuButton onPress={this.showPopup}>Testing</MenuButton>
                        <MenuButton onPress={this.goToProfile}>Profile</MenuButton>
                        <MenuButton>Friends</MenuButton>
                        <MenuButton>Settings</MenuButton>
                        <MenuButton onPress={this.signOut}>Sign Out</MenuButton>
                    </View>
                </ScrollView>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appBackground,
    },
    contentContainer: {
        paddingTop: 15,
        // alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    noticeContainer: {
        backgroundColor: Colors.noticeBackground,
        borderColor: '#000',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: Layout.window.height / 2,
        width: (Layout.window.width / 3) * 2,
    },
    image: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        margin: 20,
    },
    text: {
        flexWrap: 'wrap',
        color: Colors.noticeText,
        textAlign: 'center',
    },
});

export default withFirebase(MenuScreen);
