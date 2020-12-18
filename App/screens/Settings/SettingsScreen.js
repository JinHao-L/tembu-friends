import React, { Component } from 'react';
import { View, StyleSheet, Image, Switch } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

import { MainText } from 'components';
import { MAIN_FONT, Colors } from 'constant';
import { updateProfile } from 'app/redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePermissions: (uid, permission) =>
            dispatch(updateProfile(uid, { pushPermissions: permission })),
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
        if (
            disableFriendNotification !==
                !!this.props.userData.pushPermissions?.disableFriendNotification ||
            disablePostNotifications !==
                !!this.props.userData.pushPermissions?.disablePostNotifications
        ) {
            const changes = {
                disableFriendNotification,
                disablePostNotifications,
            };

            return this.props.updatePermissions(this.props.userData.uid, changes);
        }
    };

    goToDelete = () => {
        this.props.navigation.navigate('Delete');
    };

    goToFAQ = () => {
        this.props.navigation.navigate('FAQ');
    };

    goToContactUs = () => {
        this.props.navigation.navigate('ContactUs');
    };

    render() {
        const { disableFriendNotification, disablePostNotifications } = this.state;
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.sectionHeader}>
                        <MainText style={styles.sectionHeaderText}>Notifications</MainText>
                    </View>
                    <ListItem containerStyle={styles.settingsItem}>
                        <Image
                            source={require('assets/images/menu/FriendsIcon.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                            resizeMethod={'scale'}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={styles.title}>Friend Requests</ListItem.Title>
                        </ListItem.Content>
                        <Switch
                            trackColor={{ false: Colors.appRed, true: Colors.appGreen }}
                            value={!disableFriendNotification}
                            onValueChange={() =>
                                this.setState({
                                    disableFriendNotification: !disableFriendNotification,
                                })
                            }
                        />
                    </ListItem>
                    <ListItem containerStyle={styles.settingsItem}>
                        <Image
                            source={require('assets/images/settings/post-icon.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                            resizeMethod={'scale'}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={styles.title}>Posts</ListItem.Title>
                        </ListItem.Content>
                        <Switch
                            trackColor={{ false: Colors.appRed, true: Colors.appGreen }}
                            value={!disablePostNotifications}
                            onValueChange={() =>
                                this.setState({
                                    disablePostNotifications: !disablePostNotifications,
                                })
                            }
                        />
                    </ListItem>
                </View>
                <View>
                    <View style={styles.sectionHeader}>
                        <MainText style={styles.sectionHeaderText}>Support</MainText>
                    </View>
                    <ListItem containerStyle={styles.settingsItem} onPress={this.goToFAQ}>
                        <Image
                            source={require('assets/images/settings/FAQ-icon.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                            resizeMethod={'scale'}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={styles.title}>
                                Frequently Asked Questions
                            </ListItem.Title>
                        </ListItem.Content>
                        <Image
                            source={require('assets/images/settings/next-icon.png')}
                            style={styles.nextIcon}
                            resizeMode={'contain'}
                        />
                    </ListItem>
                    <ListItem containerStyle={styles.settingsItem} onPress={this.goToContactUs}>
                        <Image
                            source={require('assets/images/settings/contact-us.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                            resizeMethod={'scale'}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={styles.title}>Contact Us</ListItem.Title>
                        </ListItem.Content>
                        <Image
                            source={require('assets/images/settings/next-icon.png')}
                            style={styles.nextIcon}
                            resizeMode={'contain'}
                        />
                    </ListItem>
                </View>
                <View style={{ height: 30 }} />
                <ListItem containerStyle={styles.deleteContainer} onPress={this.goToDelete}>
                    <ListItem.Content style={{ alignItems: 'center' }}>
                        <ListItem.Title style={styles.deleteTitle}>Delete Account</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    title: {
        fontFamily: MAIN_FONT,
        color: Colors.appBlack,
        fontSize: 15,
        fontWeight: '600',
        paddingLeft: 5,
    },
    deleteTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appRed,
        textAlign: 'center',
    },
    deleteContainer: {
        backgroundColor: Colors.appGray1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: Colors.appGray5,
        paddingVertical: 10, //So that the box is of comparable size to the rest
    },
    settingsItem: {
        paddingLeft: 20,
        backgroundColor: Colors.appGray1,
        borderBottomWidth: 1,
        borderColor: Colors.appGray5,
        paddingVertical: 8,
    },
    sectionHeader: {
        backgroundColor: Colors.appWhite,
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderColor: Colors.appGray5,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appBlack,
    },
    icon: {
        width: 25,
        height: 25,
    },
    nextIcon: {
        width: 20,
        height: 27,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
