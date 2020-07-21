import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';

import { Colors } from '../../constants';
import { MenuButton, Popup } from '../../components';
import { withFirebase } from '../../helper/Firebase';

const mapStateToProps = (state) => {
    return { userData: state.userData, friendSubscriber: state.friendSubscriber };
};

class MenuScreen extends Component {
    state = {
        signOutVisible: false,
    };
    navigating = false;

    signOut = () => {
        this.props.friendSubscriber();
        return this.props.firebase.signOut().catch((error) => console.log('Log out fail', error));
    };

    goToProfile = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.props.navigation.push('MyProfile');
    };

    goToMyQR = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.props.navigation.push('MyQR');
    };

    goToFriends = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.props.navigation.push('Friends');
    };

    goToAdmin = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.props.navigation.push('AdminNav');
    };

    goToSettings = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
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
                title={'Logging you out'}
                body={'Are you sure?'}
                additionalButtonText={'Log out'}
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
        const { profileImg, displayName, admin } = userData;
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
            <View style={{ flex: 1 }}>
                {this.renderSignOutPopup()}
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        <View>
                            <MenuButton
                                type={'Profile'}
                                avatar={profileImg || null}
                                avatarPlaceholder={displayName && displayName[0]}
                                onPress={this.goToProfile}
                            >
                                <Text style={{ color: 'green' }}>{displayName}</Text>
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
                        </View>
                        <MenuButton
                            style={styles.centralButton}
                            textStyle={{ color: 'white' }}
                            onPress={this.toggleSignOutVisibility}
                        >
                            Log Out
                        </MenuButton>
                    </ScrollView>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 25,
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    centralButton: {
        height: 50,
        alignItems: 'center',
        backgroundColor: Colors.appGreen,
    },
});

export default connect(mapStateToProps)(withFirebase(MenuScreen));
