import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';

import { MAIN_FONT, MainText, MenuButton, Popup } from '../../components';
import { Colors } from '../../constants';
import { updateProfile } from '../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePermissions: (uid, permission) => {
            dispatch(updateProfile(uid, { pushPermissions: permission }));
        },
    };
};

class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disableFriendNotification: !!this.props.userData.pushPermissions
                ?.disableFriendNotification,
            disablePostNotifications: !!this.props.userData.pushPermissions
                ?.disablePostNotifications,
        };

        this.unsubscribe = this.props.navigation.addListener('blur', this.confirmChanges);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    confirmChanges = () => {
        const { disableFriendNotification, disablePostNotifications } = this.state;
        let changes = {};
        let hasChanges = false;
        if (
            disableFriendNotification !==
            !!this.props.userData.pushPermissions?.disableFriendNotification
        ) {
            changes.disableFriendNotification = disableFriendNotification;
            hasChanges = true;
        }
        if (
            disablePostNotifications !==
            !!this.props.userData.pushPermissions?.disablePostNotifications
        ) {
            changes.disablePostNotifications = disablePostNotifications;
            hasChanges = true;
        }

        if (hasChanges) {
            return this.props.updatePermissions(this.props.userData.uid, changes);
        }
    };

    goToDelete = () => {
        this.props.navigation.push('Delete');
    };

    render() {
        const { disableFriendNotification, disablePostNotifications } = this.state;
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.sectionHeader}>
                        <MainText style={styles.sectionHeaderText}>Notifications</MainText>
                    </View>
                    <ListItem
                        title={'Friend Requests'}
                        titleStyle={styles.title}
                        containerStyle={styles.settingsItem}
                        leftIcon={
                            <Image
                                source={require('../../assets/images/menu/FriendsIcon.png')}
                                style={styles.icon}
                            />
                        }
                        switch={{
                            trackColor: { false: Colors.appRed, true: Colors.appGreen },
                            value: !disableFriendNotification,
                            onValueChange: () =>
                                this.setState({
                                    disableFriendNotification: !disableFriendNotification,
                                }),
                        }}
                    />
                    <ListItem
                        title={'Posts'}
                        titleStyle={styles.title}
                        containerStyle={styles.settingsItem}
                        switch={{
                            trackColor: { false: Colors.appRed, true: Colors.appGreen },
                            value: !disablePostNotifications,
                            onValueChange: () =>
                                this.setState({
                                    disablePostNotifications: !disablePostNotifications,
                                }),
                        }}
                        leftIcon={{
                            name: 'text',
                            type: 'material-community',
                            color: Colors.appGreen,
                        }}
                    />
                </View>
                <View>
                    <View style={styles.sectionHeader}>
                        <MainText style={styles.sectionHeaderText}>Support</MainText>
                    </View>
                    <ListItem
                        title={'Frequently Asked Questions'}
                        titleStyle={styles.title}
                        containerStyle={styles.settingsItem}
                        leftIcon={
                            <Image
                                source={require('../../assets/images/settings/FAQ-icon.png')}
                                style={styles.icon}
                            />
                        }
                        chevron={true}
                    />
                    <ListItem
                        title={'Contact Us'}
                        titleStyle={styles.title}
                        containerStyle={styles.settingsItem}
                        leftIcon={
                            <Image
                                source={require('../../assets/images/settings/contact-us.png')}
                                style={styles.icon}
                            />
                        }
                        chevron={true}
                    />
                </View>
                <View style={{ height: 30 }} />
                <ListItem
                    contentContainerStyle={{ alignItems: 'center' }}
                    title={'Delete account'}
                    titleStyle={styles.deleteTitle}
                    containerStyle={styles.deleteContainer}
                    onPress={this.goToDelete}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    contentContainer: {
        flexGrow: 1,
    },
    title: {
        fontFamily: MAIN_FONT,
        color: Colors.appBlack,
        fontSize: 13,
    },
    deleteTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
        color: Colors.appRed,
        textAlign: 'center',
    },
    deleteContainer: {
        backgroundColor: Colors.appGray1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: Colors.appGray5,
        paddingVertical: 8,
    },
    settingsItem: {
        backgroundColor: Colors.appGray1,
        borderBottomWidth: 1,
        borderColor: Colors.appGray5,
        paddingVertical: 8,
    },
    sectionHeader: {
        backgroundColor: Colors.appWhite,
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 30,
        borderBottomWidth: 1,
        borderColor: Colors.appGray5,
    },
    sectionHeaderText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.appBlack,
    },
    icon: { width: 25, height: 25, resizeMode: 'contain' },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
