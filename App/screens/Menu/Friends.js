import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { MainText, UserItem, SearchBar, Popup, GreenButton } from 'components';
import { withFirebase } from 'helper/Firebase';
import { MAIN_FONT, Colors } from 'constant';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        friends: state.friends,
    };
};

class Friends extends Component {
    state = {
        filteredList: [],
        refreshing: false,
        loading: true,

        //Search filter
        searchValue: '',

        buttonLoading: [],

        unfriendPopupVisible: false,
        respondPopupVisible: false,
    };
    friendList = [];

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        if (!this.state.loading) {
            this.setState({
                refreshing: true,
            });
        }

        const friendList = [];
        Object.entries(this.props.friends).forEach((entry) => {
            const status = entry[1].status;
            if (status === 'friends') {
                friendList.push({ uid: entry[0] });
            }
        });

        if (friendList.length === 0) {
            this.friendList = [];
            this.setState({
                filteredList: [],
                refreshing: false,
                loading: false,
            });
            return;
        }

        return this.props.firebase
            .getUsers(friendList)
            .then((list) => {
                const sortedList = list.sort((a, b) => a.displayName.localeCompare(b.displayName));
                this.friendList = sortedList;
                this.setState({
                    filteredList: sortedList,
                });
            })
            .then(() => this.setSearchValue(this.state.searchValue))
            .finally(() => {
                this.setState({
                    refreshing: false,
                    loading: false,
                });
            });
    };

    navigating = false;
    goToProfile = (uid) => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        if (!uid || uid === 'deleted') {
            console.log('User does not exist', uid);
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.navigate('MyProfile');
        } else {
            this.props.navigation.navigate('UserProfile', { user_uid: uid });
        }
    };

    requestFriend = (uid) => {
        this.setState({
            buttonLoading: [...this.state.buttonLoading, uid],
        });
        return this.props.firebase
            .getUserData(uid)
            .then((userData) => {
                const { expoPushToken, pushPermissions } = userData;
                return this.props.firebase.sendFriendRequest(
                    uid,
                    {
                        expoPushToken: expoPushToken,
                        pushPermissions: pushPermissions,
                    },
                    {
                        expoPushToken: this.props.userData.expoPushToken,
                        pushPermissions: this.props.userData.pushPermissions,
                    }
                );
            })
            .catch((error) => console.log('Friend request error', error))
            .finally(() => {
                this.setState({
                    buttonLoading: this.state.buttonLoading.filter((x) => x !== uid),
                });
            });
    };
    acceptFriend = (uid) => {
        this.setState({
            buttonLoading: [...this.state.buttonLoading, uid],
        });
        const friendshipId = this.props.friends[uid]?.id;
        return this.props.firebase
            .getUserData(uid)
            .then((userData) => {
                const { expoPushToken, pushPermissions } = userData;
                return this.props.firebase.acceptFriendRequest(friendshipId, {
                    expoPushToken: expoPushToken,
                    pushPermissions: pushPermissions,
                });
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

    renderProfile = (userData) => {
        const { displayName, profileImg, uid } = userData;
        const friendStatus = this.props.friends[uid]?.status;

        return (
            <UserItem
                name={displayName || 'Deleted User'}
                profileImg={profileImg || ''}
                onPress={() => this.goToProfile(uid)}
                rightElement={
                    friendStatus === 'friends' ? (
                        <GreenButton
                            title="Friends"
                            type="solid"
                            loading={this.state.buttonLoading.includes(uid)}
                            onPress={() =>
                                this.setState({
                                    unfriendPopupVisible: true,
                                    popupTarget: uid,
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
                                    popupTarget: uid,
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
                            onPress={() => this.requestFriend(uid)}
                        />
                    )
                }
            />
        );
    };
    renderEmpty = () => {
        if (this.state.loading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <ActivityIndicator color={Colors.appGreen} />
                </View>
            );
        }
        if (this.state.searchValue) {
            return (
                <View style={styles.emptySearchContainer}>
                    <MainText style={styles.emptySearchText}>No users found</MainText>
                </View>
            );
        }
        return (
            <View style={styles.emptyContainerStyle}>
                <Image
                    source={require('assets/images/misc/friend-request-icon.png')}
                    style={{ marginBottom: 30, width: 100, height: 100 }}
                />
                <MainText style={styles.emptyText}>
                    You’ll see all of the Tembusians who have added you as friends here.
                </MainText>
            </View>
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
                            this.removeFriend(this.state.popupTarget);
                            this.setState({
                                unfriendPopupVisible: false,
                                popupTarget: null,
                            });
                        }}
                    />
                }
                buttonText={'Cancel'}
                callback={() =>
                    this.setState({
                        unfriendPopupVisible: false,
                        popupTarget: null,
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
                                this.acceptFriend(this.state.popupTarget);
                                this.setState({
                                    respondPopupVisible: false,
                                    popupTarget: null,
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
                                this.removeFriend(this.state.popupTarget);
                                this.setState({
                                    respondPopupVisible: false,
                                    popupTarget: null,
                                });
                            }}
                        />
                    </View>
                }
                buttonText={'Cancel'}
                callback={() =>
                    this.setState({
                        respondPopupVisible: false,
                        popupTarget: null,
                    })
                }
            />
        );
    };

    setSearchValue = (text) => {
        this.setState({
            searchValue: text,
        });
        const filteredUsers = this.friendList.filter((data) => {
            return data.displayName.indexOf(text) > -1;
        });
        this.setState({
            filteredList: filteredUsers,
        });
    };

    render() {
        const { filteredList, refreshing } = this.state;
        return (
            <View style={styles.container}>
                {this.renderUnfriendPopup()}
                {this.renderRespondPopup()}
                {this.friendList.length === 0 ? null : (
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
                )}
                <FlatList
                    contentContainerStyle={{ minHeight: '100%' }}
                    data={filteredList}
                    renderItem={({ item }) => this.renderProfile(item)}
                    keyExtractor={(friend) => friend.uid}
                    ListEmptyComponent={this.renderEmpty}
                    refreshing={refreshing}
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
    emptyContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginHorizontal: 30,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.appBlack,
        textAlign: 'center',
    },
    emptySearchContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    emptySearchText: {
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

export default connect(mapStateToProps)(withFirebase(Friends));
