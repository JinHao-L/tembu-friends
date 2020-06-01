import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

import { Colors } from '../constants';
import { withFirebase } from '../config/Firebase';
import { MainText, MenuButton } from '../components';
import { Popup, Root } from '../components/Popup';

class MenuScreen extends Component {
    state = {
        isVisible: false,
    };

    getDisplayName = () => {
        return this.props.firebase.getCurrentUser().displayName;
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

    goToDelete = () => {
        this.props.navigation.navigate('Delete');
    };

    testingPopup = () => {
        Popup.show({
            type: 'Testing',
            title: 'Not available',
            body: 'Under Maintenance... \nClosing in 5 seconds',
            showButton: true,
            buttonText: 'Close',
            autoClose: true,
            // because of bottom tab bar
            verticalOffset: 50,
        });
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Root>
                    <View style={styles.header}>
                        <MainText style={styles.title}>Menu</MainText>
                    </View>
                    <ScrollView
                        style={styles.container}
                        contentContainerStyle={styles.contentContainer}
                    >
                        <View>
                            <MenuButton img={'Profile'} onPress={this.goToProfile}>
                                <Text style={{ color: 'green' }}>{this.getDisplayName()}</Text>
                                {'\n'}
                                <Text style={{ fontSize: 15 }}> See your profile</Text>
                            </MenuButton>
                            <MenuButton img={'Friends'} onPress={this.testingPopup}>
                                Friends
                            </MenuButton>
                            <MenuButton img={'Settings'} onPress={this.testingPopup}>
                                Settings
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Ipsum Lorem
                            </MenuButton>
                            <MenuButton
                                img={'Settings'}
                                style={styles.signOutButton}
                                textStyle={{ color: 'white' }}
                                onPress={this.signOut}
                            >
                                Sign Out
                            </MenuButton>
                            <MenuButton
                                img={'Settings'}
                                style={styles.signOutButton}
                                textStyle={{ color: 'white' }}
                                onPress={this.goToDelete}
                            >
                                Delete account
                            </MenuButton>
                        </View>
                    </ScrollView>
                </Root>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#248458',
        paddingBottom: 10,
        paddingTop: 20,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.appLightGreen,
    },
    contentContainer: {
        paddingTop: 15,
        // alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    title: {
        textAlign: 'left',
        color: 'white',
        fontSize: 24,
        left: 30,
    },
    notAvailable: {
        backgroundColor: Colors.appDarkGray,
    },
    signOutButton: {
        backgroundColor: 'red',
    },
});

export default withFirebase(MenuScreen);
