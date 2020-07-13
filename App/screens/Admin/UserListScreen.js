import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Image } from 'react-native';
import { ListItem, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { Colors } from '../../constants';
import { withFirebase } from '../../helper/Firebase';
import { MAIN_FONT, MainText, Popup } from '../../components';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

class UserListScreen extends React.Component {
    state = {
        isLoading: false,
        users: [],

        adminSettingsVisible: false,
        targetUser: null,
        isAdmin: null,
        isVerified: null,
    };

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        this.setState({
            isLoading: true,
        });
        this.props.firebase
            .getAllUsers()
            .then((users) => {
                this.setState({
                    users: users,
                    isLoading: false,
                });
            })
            .catch(() => {
                this.setState({
                    isLoading: false,
                });
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
                title={displayName || 'undefined'}
                titleStyle={styles.titleStyle}
                subtitle={email}
                subtitleStyle={[
                    styles.subtitleStyle,
                    !emailVerified && { textDecorationLine: 'line-through' },
                ]}
                leftAvatar={{
                    rounded: true,
                    source: photoURL
                        ? { uri: photoURL }
                        : require('../../assets/images/default/profile.png'),
                }}
                bottomDivider={true}
                rightElement={this.renderBadges(isVerified, isAdmin)}
                onPress={() => {
                    return this.setState({
                        adminSettingsVisible: true,
                        targetUser: uid,
                        isAdmin: isAdmin,
                        isVerified: isVerified,
                    });
                }}
            />
        );
    };
    renderBadges = (isVerified, isAdmin) => {
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
        const { targetUser, isAdmin, isVerified } = this.state;
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.adminSettingsVisible}
                title={'Settings'}
                body={
                    <View>
                        <Button
                            title={'Go to profile'}
                            type={'clear'}
                            titleStyle={styles.iconTitleStyle}
                            icon={{
                                name: 'person',
                                color: Colors.appBlack,
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
                        {!isAdmin && (
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
                                title={'Remove Verified'}
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
                        ) : (
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
                        )}
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
        const { users, isLoading } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                {this.renderAdminSettings()}
                <FlatList
                    data={users}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => this.renderUser(item)}
                    keyExtractor={(item) => item.uid}
                    ListHeaderComponent={this.renderHeader}
                    ListEmptyComponent={() => (
                        <MainText style={{ alignSelf: 'center' }}>No User</MainText>
                    )}
                    refreshing={isLoading}
                    onRefresh={this.refresh}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    itemContainer: {
        paddingVertical: 10,
    },
    separator: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.appDarkGray,
    },
    titleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 14,
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
});

export default connect(mapStateToProps)(withFirebase(UserListScreen));
