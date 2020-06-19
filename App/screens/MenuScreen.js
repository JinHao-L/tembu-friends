import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, SafeAreaView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';

import { Colors } from '../constants';
import { withFirebase } from '../config/Firebase';
import { MainText, MenuButton, Popup } from '../components';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
    };
};

class MenuScreen extends Component {
    state = {
        testVisible: false,
        signOutVisible: false,
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

    goToAdmin = () => {
        this.props.navigation.navigate('AdminNavi');
    };

    toggleTestingVisibility = () => {
        this.setState({
            testVisible: !this.state.testVisible,
        });
    };

    toggleSignOutVisibility = () => {
        this.setState({
            signOutVisible: !this.state.signOutVisible,
        });
    };

    renderTestingPopup = () => {
        return (
            <Popup
                type={'Testing'}
                isVisible={this.state.testVisible}
                title={'Not available'}
                body={'Under Maintenance... \nAwait for our upcoming features'}
                buttonText={'Close'}
                callback={this.toggleTestingVisibility}
            />
        );
    };

    renderSignOutPopup = () => {
        return (
            <Popup
                type={'Warning'}
                isVisible={this.state.signOutVisible}
                title={'Signing you out'}
                body={'Are you sure?'}
                additionalButtonText={'Sign out'}
                additionalButtonCall={() => {
                    this.toggleSignOutVisibility();
                    this.signOut();
                }}
                buttonText={'Cancel'}
                callback={this.toggleSignOutVisibility}
            />
        );
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.renderTestingPopup()}
                {this.renderSignOutPopup()}
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <MainText style={styles.title}>Menu</MainText>
                    </View>
                    <ScrollView style={styles.contentContainer}>
                        <MenuButton
                            type={'Profile'}
                            avatar={this.props.userData.profileImg || null}
                            avatarPlaceholder={this.props.userData.firstName[0]}
                            onPress={this.goToProfile}
                        >
                            <Text style={{ color: 'green' }}>{this.props.userData.firstName}</Text>
                            {'\n'}
                            <Text style={{ fontSize: 13 }}>See your profile</Text>
                        </MenuButton>
                        <MenuButton type={'Friends'} onPress={this.toggleTestingVisibility}>
                            Friends
                        </MenuButton>
                        <MenuButton type={'QRCode'} onPress={this.toggleTestingVisibility}>
                            Scan QR Code
                        </MenuButton>
                        <MenuButton type={'Settings'} onPress={this.toggleTestingVisibility}>
                            Settings
                        </MenuButton>
                        <MenuButton type={'Default'} onPress={this.goToAdmin}>
                            Admin
                        </MenuButton>
                        <MenuButton
                            style={styles.signOutButton}
                            textStyle={{ color: 'white' }}
                            onPress={this.toggleSignOutVisibility}
                        >
                            Sign Out
                        </MenuButton>
                        <MenuButton
                            style={styles.signOutButton}
                            textStyle={{ color: 'white' }}
                            onPress={this.goToDelete}
                        >
                            Delete account
                        </MenuButton>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        );
    }
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
        // alignItems: 'center',
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
        alignItems: 'center',
        backgroundColor: Colors.appGreen,
    },
});

const wrappedMenuScreen = withFirebase(MenuScreen);

export default connect(mapStateToProps)(wrappedMenuScreen);
