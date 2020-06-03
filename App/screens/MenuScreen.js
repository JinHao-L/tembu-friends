import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';

import { Colors } from '../constants';
import { withFirebase } from '../config/Firebase';
import { MainText, MenuButton } from '../components';
import { Popup, Root } from '../components/Popup';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
    };
};

class MenuScreen extends Component {
    componentDidMount() {
        this.props.navigation.setOptions({
            headerShown: false,
        });
    }

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
                            <MenuButton
                                type={'Profile'}
                                link={this.props.userData.profilePicture}
                                onPress={this.goToProfile}
                            >
                                <Text style={{ color: 'green' }}>
                                    {this.props.userData.displayName}
                                </Text>
                                {'\n'}
                                <Text style={{ fontSize: 15 }}> See your profile</Text>
                            </MenuButton>
                            <MenuButton type={'Friends'} onPress={this.testingPopup}>
                                Friends
                            </MenuButton>
                            <MenuButton type={'Settings'} onPress={this.testingPopup}>
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
                                type={'Settings'}
                                style={styles.signOutButton}
                                textStyle={{ color: 'white' }}
                                onPress={this.signOut}
                            >
                                Sign Out
                            </MenuButton>
                            <MenuButton
                                type={'Settings'}
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

const wrappedMenuScreen = withFirebase(MenuScreen);

export default connect(mapStateToProps)(wrappedMenuScreen);
