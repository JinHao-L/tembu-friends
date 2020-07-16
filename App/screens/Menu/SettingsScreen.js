import React, { Component } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View>
                        <View style={styles.sectionHeader}>
                            <MainText style={styles.sectionHeaderText}>Push Notifications</MainText>
                        </View>
                        <ListItem
                            title={'Friends Update'}
                            titleStyle={styles.title}
                            containerStyle={styles.settingsItem}
                            leftIcon={{ name: 'account-multiple', type: 'material-community' }}
                            switch={{
                                trackColor: { false: Colors.appRed, true: Colors.appGreen },
                                value: !disableFriendNotification,
                                onValueChange: () =>
                                    this.setState({
                                        disableFriendNotification: !disableFriendNotification,
                                    }),
                            }}
                            topDivider={true}
                        />
                        <ListItem
                            title={'Post Update'}
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
                            leftIcon={{ name: 'text', type: 'material-community' }}
                            topDivider={true}
                            bottomDivider={true}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 30 }}>
                        <MenuButton
                            style={styles.deleteButton}
                            textStyle={{ color: Colors.appRed }}
                            onPress={this.goToDelete}
                        >
                            Delete account
                        </MenuButton>
                    </View>
                </ScrollView>
            </SafeAreaView>
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
        justifyContent: 'space-between',
    },
    title: {
        fontFamily: MAIN_FONT,
        color: Colors.appBlack,
        fontSize: 13,
    },
    deleteButton: {
        alignItems: 'center',
        backgroundColor: Colors.appWhite,
    },
    settingsItem: {
        backgroundColor: Colors.appGray1,
    },
    sectionHeader: {
        backgroundColor: Colors.appWhite,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    sectionHeaderText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.appBlack,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
