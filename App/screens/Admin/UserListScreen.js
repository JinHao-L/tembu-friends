import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { ListItem, Button, Icon, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';

import { Colors, MAIN_FONT } from 'constant';
import { MainText, Popup, SearchBar } from 'components';
import { withFirebase } from 'helper/Firebase';

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
        isDisabled: null,
        activated: null,
        index: null,
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

    renderUser = (user, index) => {
        const {
            uid,
            photoURL,
            displayName,
            email,
            emailVerified,
            isAdmin,
            isVerified,
            isDisabled,
        } = user;
        return (
            <ListItem
                containerStyle={[
                    styles.outerContainer,
                    isDisabled && { backgroundColor: 'rgba(255, 0, 0, 0.25)' },
                ]}
                onPress={() => {
                    this.setState({
                        adminSettingsVisible: true,
                        targetUser: uid,
                        isAdmin: isAdmin,
                        isVerified: isVerified,
                        isDisabled: isDisabled,
                        activated: emailVerified,
                        index: index,
                    });
                }}
                underlayColor={isDisabled ? Colors.appGray4 : undefined}
            >
                <Avatar
                    rounded
                    size={50}
                    source={
                        photoURL
                            ? { uri: photoURL }
                            : require('../../assets/images/default/profile.png')
                    }
                />
                <ListItem.Content>
                    <ListItem.Title style={styles.titleStyle}>
                        {displayName || 'undefined'}
                    </ListItem.Title>
                    <ListItem.Subtitle>
                        <MainText style={styles.subtitleStyle}>
                            {email}
                            <Text style={styles.unverifiedText}>
                                {!emailVerified ? ' (Unverified)' : ''}
                            </Text>
                        </MainText>
                    </ListItem.Subtitle>
                </ListItem.Content>
                {this.renderBadges(isVerified, isAdmin)}
            </ListItem>
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
        const { targetUser, isAdmin, isVerified, activated, isDisabled, index } = this.state;
        const allowed = activated && !isDisabled;
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
                        {!isAdmin && allowed && (
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
                                        this.users[index].isAdmin = true;
                                        this.setSearchValue(this.state.searchValue);
                                        this.closeAdminSettingsPopup();
                                        return this.props.firebase.updateUserData(targetUser, {
                                            admin: true,
                                        });
                                    }}
                                />
                                <Popup.Separator />
                            </View>
                        )}
                        {isVerified ? (
                            <View>
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
                                        this.users[index].isVerified = false;
                                        this.setSearchValue(this.state.searchValue);
                                        this.closeAdminSettingsPopup();
                                        return this.props.firebase.updateUserData(targetUser, {
                                            verified: false,
                                        });
                                    }}
                                />
                                {!isAdmin && <Popup.Separator />}
                            </View>
                        ) : allowed ? (
                            <View>
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
                                        this.users[index].isVerified = true;
                                        this.setSearchValue(this.state.searchValue);
                                        this.closeAdminSettingsPopup();
                                        return this.props.firebase.updateUserData(targetUser, {
                                            verified: true,
                                        });
                                    }}
                                />
                                {!isAdmin && <Popup.Separator />}
                            </View>
                        ) : null}
                        {isDisabled && !isAdmin ? (
                            <Button
                                title={'Remove Ban'}
                                type={'clear'}
                                titleStyle={styles.iconTitleStyle}
                                icon={{
                                    name: 'block',
                                    color: Colors.appGreen,
                                    size: 25,
                                    containerStyle: { paddingHorizontal: 10 },
                                }}
                                buttonStyle={{ justifyContent: 'flex-start' }}
                                containerStyle={{ borderRadius: 0 }}
                                onPress={() => {
                                    this.users[index].isDisabled = false;
                                    this.setSearchValue(this.state.searchValue);
                                    this.closeAdminSettingsPopup();
                                    return this.props.firebase.updateUserData(targetUser, {
                                        disabled: false,
                                    });
                                }}
                            />
                        ) : !isAdmin ? (
                            <Button
                                title={'Ban User'}
                                type={'clear'}
                                titleStyle={styles.iconTitleStyle}
                                icon={{
                                    name: 'block',
                                    color: Colors.appRed,
                                    size: 25,
                                    containerStyle: { paddingHorizontal: 10 },
                                }}
                                buttonStyle={{ justifyContent: 'flex-start' }}
                                containerStyle={{ borderRadius: 0 }}
                                onPress={() => {
                                    this.users[index].isDisabled = true;
                                    this.setSearchValue(this.state.searchValue);
                                    this.closeAdminSettingsPopup();
                                    return this.props.firebase.updateUserData(targetUser, {
                                        disabled: true,
                                    });
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
            isDisabled: null,
            activated: null,
            index: null,
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
                    renderItem={({ item, index }) => this.renderUser(item, index)}
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
        backgroundColor: Colors.appWhite,
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
