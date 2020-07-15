import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';

import { Colors } from '../../constants';
import { MainText, MenuButton, Popup } from '../../components';
import { withFirebase } from '../../helper/Firebase';

const mapStateToProps = (state) => {
    return { userData: state.userData, friendSubscriber: state.friendSubscriber };
};

class MenuScreen extends Component {
    state = {
        signOutVisible: false,
    };

    signOut = () => {
        this.props.friendSubscriber();
        return this.props.firebase.signOut().catch((error) => console.log('Sign out fail', error));
    };

    goToProfile = () => {
        this.props.navigation.push('MyProfile');
    };

    goToMyQR = () => {
        this.props.navigation.push('MyQR');
    };

    goToFriends = () => {
        this.props.navigation.push('Friends');
    };

    goToAdmin = () => {
        this.props.navigation.push('AdminNav');
    };

    goToSettings = () => {
        this.props.navigation.push('Settings');
    };

    toggleSignOutVisibility = () => {
        this.setState({
            signOutVisible: !this.state.signOutVisible,
        });
    };

    renderSignOutPopup = () => {
        return (
            <Popup
                imageType={'Warning'}
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
        const userData = this.props.userData;
        const { profileImg, firstName, admin } = userData;
        if (!userData) {
            return (
                <View
                    style={[
                        styles.container,
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                >
                    <ActivityIndicator size={'large'} />
                </View>
            );
        }
        return (
            <SafeAreaView style={{ flex: 1 }}>
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
                            avatar={profileImg || null}
                            avatarPlaceholder={firstName && firstName[0]}
                            onPress={this.goToProfile}
                        >
                            <Text style={{ color: 'green' }}>{firstName}</Text>
                            {'\n'}
                            <Text style={{ fontSize: 13 }}>See your profile</Text>
                        </MenuButton>
                        <MenuButton type={'Friends'} onPress={this.goToFriends}>
                            Friends
                        </MenuButton>
                        <MenuButton type={'QRCode'} onPress={this.goToMyQR}>
                            Scan QR Code
                        </MenuButton>
                        {admin && (
                            <MenuButton type={'Admin'} onPress={this.goToAdmin}>
                                Admin
                            </MenuButton>
                        )}
                        <MenuButton type={'Settings'} onPress={this.goToSettings}>
                            Settings
                        </MenuButton>
                        <MenuButton
                            style={styles.centralButton}
                            textStyle={{ color: 'white' }}
                            onPress={this.toggleSignOutVisibility}
                        >
                            Sign Out
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
        paddingHorizontal: 30,
    },
    title: {
        textAlign: 'left',
        color: 'white',
        fontSize: 24,
        left: 30,
    },
    centralButton: {
        alignItems: 'center',
        backgroundColor: Colors.appGreen,
    },
});

export default connect(mapStateToProps)(withFirebase(MenuScreen));
