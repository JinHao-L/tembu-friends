import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

import { Colors, Layout } from '../constants';
import { withFirebase } from '../config/Firebase';
import { MainText, MenuButton } from '../components';
import { Popup, Root } from '../components/Popup';

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

    testingPopup = () => {
        Popup.show({
            type: 'Testing',
            title: 'Not available',
            body: 'Under Maintenance... \nClosing in 5 seconds',
            showButton: true,
            buttonText: 'Close',
            autoClose: true,
            // because of bottom tab bar
            verticalOffset: 100,
        });
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Root>
                    <View style={styles.titleContainer}>
                        <MainText style={styles.title}>Menu</MainText>
                    </View>
                    <ScrollView
                        style={styles.container}
                        contentContainerStyle={styles.contentContainer}
                    >
                        <View>
                            <MenuButton onPress={this.goToProfile}>Profile</MenuButton>
                            <MenuButton>Friends</MenuButton>
                            <MenuButton>Settings</MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.notAvailable} onPress={this.testingPopup}>
                                Testing
                            </MenuButton>
                            <MenuButton style={styles.signOutButton} onPress={this.signOut}>
                                Sign Out
                            </MenuButton>
                        </View>
                    </ScrollView>
                </Root>
            </SafeAreaView>
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
    titleContainer: {
        flex: 0.1,
        backgroundColor: Colors.appBackground,
        justifyContent: 'flex-end',
        paddingBottom: 5,
    },
    title: {
        textAlign: 'left',
        color: 'white',
        fontSize: 24,
        left: 30,
    },
    notAvailable: {
        backgroundColor: 'grey',
    },
    signOutButton: {
        backgroundColor: 'red',
    },
});

export default withFirebase(MenuScreen);
