import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { ListItem, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { Colors } from '../../constants';
import { withFirebase } from '../../helper/Firebase';
import { MAIN_FONT, MainText, Popup, SearchBar } from '../../components';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

class UserListScreen extends Component {
    state = {
        isLoading: false,
        filteredUsers: [],

        searchValue: '',

        adminSettingsVisible: false,
        targetUser: null,
        isAdmin: null,
        isVerified: null,
    };
    users = [];

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        this.setState({
            isLoading: true,
            searchValue: '',
        });
        this.props.firebase
            .getAllUsers()
            .then((users) =>
                users.sort((x, y) =>
                    x.displayName ? x.displayName.localeCompare(y.displayName) : -1
                )
            )
            .then((users) => {
                this.users = users;
                this.setState({
                    filteredUsers: users,
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() =>
                this.setState({
                    isLoading: false,
                })
            );
    };

    setSearchValue = (text) => {
        this.setState({
            searchValue: text,
        });
        const filteredUsers = this.users.filter((data) => {
            return data.displayName.indexOf(text) > -1;
        });
        this.setState({
            filteredUsers: filteredUsers,
        });
    };

    goToProfile = (uid) => {
        if (uid === this.props.userData.uid) {
            this.props.navigation.push('MyProfile');
        } else {
            this.props.navigation.push('UserProfile', { user_uid: uid });
        }
    };

    renderUser = (user) => {
        const { uid, photoURL, displayName, email, emailVerified, isAdmin, isVerified } = user;
        return (
            <ListItem
                containerStyle={styles.outerContainer}
                title={displayName || 'undefined'}
                titleStyle={styles.titleStyle}
                subtitle={
                    <MainText style={styles.subtitleStyle}>
                        {email}
                        <Text style={styles.unverifiedText}>
                            {!emailVerified ? ' (Unverified)' : ''}
                        </Text>
                    </MainText>
                }
                subtitleStyle={styles.subtitleStyle}
                leftAvatar={{
                    rounded: true,
                    size: 50,
                    source: photoURL
                        ? { uri: photoURL }
                        : require('../../assets/images/default/profile.png'),
                }}
                rightElement={this.renderBadges(isVerified, isAdmin)}
                onPress={() => {
                    return this.setState({
                        adminSettingsVisible: true,
                        targetUser: uid,
                        isAdmin: isAdmin,
                        isVerified: isVerified,
                        activated: emailVerified,
                    });
                }}
            />
        );
    };
    renderBadges = (isVerified, isAdmin) => {
        if (!isVerified && !isAdmin) {
            return undefined;
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                {isAdmin && (
                    <Icon
                        style={styles.badge}
                        name={'crown'}
                        type={'material-community'}
                        size={20}
                        color={Colors.appGreen}
                    />
                )}
                {isVerified && (
                    <Icon
                        style={styles.badge}
                        name={'check-circle'}
                        size={20}
                        color={Colors.appGreen}
                    />
                )}
            </View>
        );
    };
    renderAdminSettings = () => {
        const { targetUser, isAdmin, isVerified, activated } = this.state;
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.adminSettingsVisible}
                title={'Settings'}
                body={
                    <View>
                        <Button
                            title={'User Profile'}
                            type={'clear'}
                            titleStyle={styles.iconTitleStyle}
                            icon={{
                                name: 'person',
                                color: Colors.appGreen,
                                size: 25,
                                containerStyle: { paddingHorizontal: 10 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => {
                                this.goToProfile(targetUser);
                                this.closeAdminSettingsPopup();
                            }}
                        />
                        <Popup.Separator />
                        {!isAdmin && activated && (
                            <View>
                                <Button
                                    title={'Make Admin'}
                                    type={'clear'}
                                    titleStyle={styles.iconTitleStyle}
                                    icon={{
                                        name: 'account-circle',
                                        color: Colors.appGreen,
                                        size: 25,
                                        containerStyle: { paddingHorizontal: 10 },
                                    }}
                                    buttonStyle={{ justifyContent: 'flex-start' }}
                                    containerStyle={{ borderRadius: 0 }}
                                    onPress={() => {
                                        return this.props.firebase
                                            .updateUserData(targetUser, { admin: true })
                                            .then(this.closeAdminSettingsPopup);
                                    }}
                                />
                                <Popup.Separator />
                            </View>
                        )}
                        {isVerified ? (
                            <Button
                                title={'Remove Verification'}
                                type={'clear'}
                                titleStyle={styles.iconTitleStyle}
                                icon={{
                                    name: 'remove-circle',
                                    color: Colors.appRed,
                                    size: 25,
                                    containerStyle: { paddingHorizontal: 10 },
                                }}
                                buttonStyle={{ justifyContent: 'flex-start' }}
                                containerStyle={{ borderRadius: 0 }}
                                onPress={() => {
                                    return this.props.firebase
                                        .updateUserData(targetUser, { verified: false })
                                        .then(this.closeAdminSettingsPopup);
                                }}
                            />
                        ) : activated ? (
                            <Button
                                title={'Verify User'}
                                type={'clear'}
                                titleStyle={styles.iconTitleStyle}
                                icon={{
                                    name: 'check-circle',
                                    color: Colors.appGreen,
                                    size: 25,
                                    containerStyle: { paddingHorizontal: 10 },
                                }}
                                buttonStyle={{ justifyContent: 'flex-start' }}
                                containerStyle={{ borderRadius: 0 }}
                                onPress={() => {
                                    return this.props.firebase
                                        .updateUserData(targetUser, { verified: true })
                                        .then(this.closeAdminSettingsPopup);
                                }}
                            />
                        ) : null}
                    </View>
                }
                buttonText={'Cancel'}
                callback={this.closeAdminSettingsPopup}
            />
        );
    };

    closeAdminSettingsPopup = () => {
        return this.setState({
            adminSettingsVisible: false,
            targetUser: null,
            isAdmin: null,
            isVerified: null,
        });
    };

    render() {
        const { filteredUsers, isLoading } = this.state;

        return (
            <View style={styles.container}>
                {this.renderAdminSettings()}
                <SearchBar
                    value={this.state.searchValue}
                    onChangeText={this.setSearchValue}
                    onCancel={() => this.setSearchValue('')}
                    style={{
                        paddingVertical: 15,
                        borderBottomWidth: 1,
                        borderColor: Colors.appGray2,
                        zIndex: 1,
                    }}
                />
                <FlatList
                    data={filteredUsers}
                    renderItem={({ item }) => this.renderUser(item)}
                    keyExtractor={(item) => item.uid}
                    ListEmptyComponent={() => (
                        <MainText style={{ alignSelf: 'center', paddingTop: 5 }}>No User</MainText>
                    )}
                    refreshing={isLoading}
                    onRefresh={this.refresh}
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
    outerContainer: {
        borderBottomWidth: 3,
        borderColor: Colors.appGray2,
        paddingVertical: 8,
    },
    titleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
    },
    subtitleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
    },
    iconTitleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appBlack,
        flexShrink: 1,
        textAlign: 'left',
    },
    badge: {
        marginLeft: 5,
        resizeMode: 'contain',
    },
    unverifiedText: {
        fontSize: 12,
        textAlign: 'center',
        color: Colors.appGray4,
    },
});

export default connect(mapStateToProps)(withFirebase(UserListScreen));
