import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { GreenButton, MainText, Popup, UserItem } from 'components';
import { Colors, MAIN_FONT } from 'constant';
import { withFirebase } from 'helper/Firebase';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        friends: state.friends,
    };
};

class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.navigating = false;
        this.state = {
            buttonLoading: [],

            unfriendPopupVisible: false,
            respondPopupVisible: false,
        };
    }

    goToProfile = (userData) => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        const { uid } = userData;
        if (uid === this.props.userData.uid) {
            this.props.navigation.navigate('MyProfile');
        } else {
            this.props.navigation.navigate('UserProfile', {
                userData: userData,
            });
        }
    };

    requestFriend = (uid, expoPushToken, pushPermissions) => {
        this.setState({
            buttonLoading: [...this.state.buttonLoading, uid],
        });
        return this.props.firebase
            .sendFriendRequest(
                uid,
                {
                    expoPushToken: expoPushToken,
                    pushPermissions: pushPermissions,
                },
                {
                    expoPushToken: this.props.userData.expoPushToken,
                    pushPermissions: this.props.userData.pushPermissions,
                }
            )
            .catch((error) => console.log('Friend request error', error))
            .finally(() => {
                this.setState({
                    buttonLoading: this.state.buttonLoading.filter((x) => x !== uid),
                });
            });
    };
    acceptFriend = (uid, expoPushToken, pushPermissions) => {
        this.setState({
            buttonLoading: [...this.state.buttonLoading, uid],
        });
        const friendshipId = this.props.friends[uid]?.id;
        return this.props.firebase
            .acceptFriendRequest(friendshipId, {
                expoPushToken: expoPushToken,
                pushPermissions: pushPermissions,
            })
            .catch((error) => console.log('Accept friend error', error))
            .finally(() => {
                this.setState({
                    buttonLoading: this.state.buttonLoading.filter((x) => x !== uid),
                });
            });
    };
    removeFriend = (uid) => {
        this.setState({
            buttonLoading: [...this.state.buttonLoading, uid],
        });
        const friendshipId = this.props.friends[uid]?.id;
        return this.props.firebase
            .deleteFriend(friendshipId)
            .catch((error) => console.log('Remove friend error', error))
            .finally(() => {
                this.setState({
                    buttonLoading: this.state.buttonLoading.filter((x) => x !== uid),
                });
            });
    };

    renderEmpty = () => {
        if (!this.props.searchValue || this.props.loading) {
            return (
                <View style={{ marginTop: 50, alignItems: 'center' }}>
                    <Image
                        source={require('assets/images/misc/search-guide.png')}
                        style={{
                            width: 300,
                            height: 100,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.emptyContainer}>
                    <MainText style={styles.emptyText}>No users found</MainText>
                </View>
            );
        }
    };
    renderProfile = (userData) => {
        const { displayName, profileImg, uid, expoPushToken, pushPermissions } = userData;
        const friendStatus = this.props.friends[uid]?.status;

        return (
            <UserItem
                name={displayName}
                profileImg={profileImg}
                onPress={() => this.goToProfile(userData)}
                rightElement={
                    uid === this.props.userData.uid ? undefined : friendStatus === 'friends' ? (
                        <GreenButton
                            title="Friends"
                            type="solid"
                            loading={this.state.buttonLoading.includes(uid)}
                            onPress={() =>
                                this.setState({
                                    unfriendPopupVisible: true,
                                    popupProps: { uid, expoPushToken, pushPermissions },
                                })
                            }
                        />
                    ) : friendStatus === 'respond' ? (
                        <GreenButton
                            title="Respond"
                            type="outline"
                            loading={this.state.buttonLoading.includes(uid)}
                            onPress={() =>
                                this.setState({
                                    respondPopupVisible: true,
                                    popupProps: { uid, expoPushToken, pushPermissions },
                                })
                            }
                        />
                    ) : friendStatus === 'requested' ? (
                        <GreenButton
                            title="Requested"
                            type="solid"
                            loading={this.state.buttonLoading.includes(uid)}
                            onPress={() => this.removeFriend(uid)}
                        />
                    ) : (
                        <GreenButton
                            title="Add Friend"
                            type="outline"
                            loading={this.state.buttonLoading.includes(uid)}
                            onPress={() => this.requestFriend(uid, expoPushToken, pushPermissions)}
                        />
                    )
                }
            />
        );
    };

    renderUnfriendPopup = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.unfriendPopupVisible}
                title={'Options'}
                body={
                    <Button
                        title={'Unfriend'}
                        type={'clear'}
                        titleStyle={styles.popupTitleStyle}
                        icon={{
                            type: 'material-community',
                            name: 'account-minus-outline',
                            color: Colors.appRed,
                            size: 25,
                            containerStyle: { paddingHorizontal: 10 },
                        }}
                        buttonStyle={{ justifyContent: 'flex-start' }}
                        containerStyle={{ borderRadius: 0 }}
                        onPress={() => {
                            this.removeFriend(this.state.popupProps.uid);
                            this.setState({
                                unfriendPopupVisible: false,
                                popupProps: null,
                            });
                        }}
                    />
                }
                buttonText={'Cancel'}
                callback={() =>
                    this.setState({
                        unfriendPopupVisible: false,
                        popupProps: null,
                    })
                }
            />
        );
    };
    renderRespondPopup = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.respondPopupVisible}
                title={'Options'}
                body={
                    <View>
                        <Button
                            title={'Approve Request'}
                            type={'clear'}
                            titleStyle={styles.popupTitleStyle}
                            icon={{
                                name: 'person-add',
                                color: Colors.statusGreen,
                                size: 25,
                                containerStyle: { paddingHorizontal: 10 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => {
                                const {
                                    uid,
                                    expoPushToken,
                                    pushPermissions,
                                } = this.state.popupProps;
                                this.acceptFriend(uid, expoPushToken, pushPermissions);
                                this.setState({
                                    respondPopupVisible: false,
                                    popupProps: null,
                                });
                            }}
                        />
                        <Popup.Separator />
                        <Button
                            title={'Ignore Request'}
                            type={'clear'}
                            titleStyle={styles.popupTitleStyle}
                            icon={{
                                name: 'clear',
                                color: Colors.statusRed,
                                size: 25,
                                containerStyle: { paddingHorizontal: 10 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => {
                                const { uid } = this.state.popupProps;
                                this.removeFriend(uid);
                                this.setState({
                                    respondPopupVisible: false,
                                    popupProps: null,
                                });
                            }}
                        />
                    </View>
                }
                buttonText={'Cancel'}
                callback={() =>
                    this.setState({
                        respondPopupVisible: false,
                        popupProps: null,
                    })
                }
            />
        );
    };

    render() {
        const { userList } = this.props;
        return (
            <View style={styles.container}>
                {this.renderUnfriendPopup()}
                {this.renderRespondPopup()}
                <FlatList
                    data={userList}
                    renderItem={({ item }) => this.renderProfile(item)}
                    keyExtractor={(user) => user.uid}
                    ListEmptyComponent={this.renderEmpty}
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
    emptyContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '600',
    },
    popupTitleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appBlack,
        flexShrink: 1,
        textAlign: 'left',
    },
});

export default connect(mapStateToProps)(withFirebase(SearchResults));
