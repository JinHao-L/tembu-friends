import React, { Component } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { MAIN_FONT, Colors } from 'constant';
import { MainText, Popup, NotificationItem } from 'components';
import { withFirebase } from 'helper/Firebase';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        respondList: state.respondList,
    };
};

class NotificationScreen extends Component {
    state = {
        notifications: null,
        friendRequest: null,
        friendRequestStatus: '',
        pressed: false,

        limit: 8,
        lastLoaded: null,
        fetchingMore: false,
        refreshing: false,
        allNotificationsLoaded: false,
        loading: true,

        notificationOptionsVisible: false,
        notificationOptionsProps: null,
    };
    navigating = false;

    componentDidMount() {
        this.onRefresh().then(() => this.setState({ loading: false }));
    }

    onRefresh = () => {
        return this.retrieveNotifications().then(this.getLatestFriendRequest);
    };

    getLatestFriendRequest = () => {
        if (this.props.respondList.length === 0) {
            this.setState({
                friendRequest: null,
                friendRequestStatus: '',
                pressed: false,
            });
        } else {
            this.setState({ refreshing: true });
            const sortedList = this.props.respondList.sort(
                (x, y) => y.time_requested.toMillis() - x.time_requested.toMillis()
            );
            return this.props.firebase
                .getUsers([{ uid: sortedList[0].uid }])
                .then((userRecords) => {
                    return { ...sortedList[0], ...userRecords[0] };
                })
                .then((friendRequest) => {
                    this.setState({
                        friendRequest: friendRequest,
                        friendRequestStatus: '',
                        pressed: false,
                    });
                })
                .finally(() => {
                    this.setState({ refreshing: false });
                });
        }
    };

    retrieveNotifications = () => {
        this.setState({ refreshing: true, allNotificationsLoaded: false });

        return this.props.firebase
            .getUserNotifications(this.props.userData.uid)
            .orderBy('timeCreated', 'desc')
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving notifications', documents.length);
                return documents.map((document) => document.data());
            })
            .then((notifications) => {
                let lastLoaded = notifications[notifications.length - 1].timeCreated;

                return this.setState({
                    notifications: notifications,
                    lastLoaded: lastLoaded,
                    refreshing: false,
                    allNotificationsLoaded: notifications.length === 0,
                });
            })
            .catch((error) => {
                this.setState({ notifications: [], refreshing: false });
                console.log(error);
            });
    };
    retrieveMoreNotifications = () => {
        if (this.state.allNotificationsLoaded || this.state.fetchingMore || this.state.refreshing) {
            return;
        }
        this.setState({ fetchingMore: true });

        return this.props.firebase
            .getUserNotifications(this.props.userData.uid)
            .orderBy('timeCreated', 'desc')
            .startAfter(this.state.lastLoaded)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving more notifications', documents.length);
                if (documents.length !== 0) {
                    let notifications = documents.map((document) => document.data());
                    let lastLoaded = notifications[notifications.length - 1].timeCreated;

                    this.setState({
                        notifications: [...this.state.notifications, ...notifications],
                        lastLoaded: lastLoaded,
                        fetchingMore: false,
                    });
                } else {
                    this.setState({ fetchingMore: false, allNotificationsLoaded: true });
                }
            })
            .catch((error) => {
                this.setState({ fetchingMore: false });
                console.log(error);
            });
    };

    goToProfile = (uid) => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        if (!uid || uid === 'deleted') {
            console.log('User does not exist');
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.push('MyProfile');
        } else {
            this.props.navigation.push('UserProfile', { user_uid: uid });
        }
    };
    goToFriendRequests = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.props.navigation.navigate('FriendRequests', {
            onGoBack: this.getLatestFriendRequest,
        });
    };

    markAsRead = ({ id, index }) => {
        this.setState((prevState) => {
            const updated = prevState.notifications;
            updated[index].seen = true;
            return { notifications: updated };
        });
        return this.props.firebase.updateNotification(this.props.userData.uid, id, { seen: true });
    };
    removeNotification = ({ id, index }) => {
        this.setState(
            {
                notifications: [
                    ...this.state.notifications.slice(0, index),
                    ...this.state.notifications.slice(index + 1),
                ],
            },
            () => {
                if (id === this.state.lastLoaded) {
                    this.setState({
                        lastLoaded: this.state.notifications[this.state.notifications.length - 1]
                            .timeCreated,
                    });
                }
                console.log('Deleting notification');
                return this.props.firebase
                    .deleteNotification(this.props.userData.uid, id)
                    .catch((error) => console.log(error));
            }
        );
    };

    renderNotification = (notification, index) => {
        const {
            message,
            notification_id,
            seen,
            timeCreated,
            type,
            uid,
            sender_img,
            sender_uid,
        } = notification;
        const notificationOptionsProps = {
            id: notification_id,
            seen: seen,
            index: index,
        };
        let iconName;
        switch (type) {
            case 'Friends':
                iconName = 'account-multiple';
                break;
            case 'Post':
                iconName = 'text';
                break;
            default:
                iconName = undefined;
                break;
        }
        return (
            <NotificationItem
                message={message}
                timeCreated={timeCreated}
                seen={seen}
                avatarImg={sender_img}
                accessoryIcon={iconName}
                avatarOnPress={
                    sender_uid
                        ? () => {
                              this.goToProfile(sender_uid);
                          }
                        : undefined
                }
                onPress={() => {
                    if (!seen) {
                        this.markAsRead(notificationOptionsProps);
                    }
                    this.goToProfile(uid);
                }}
                onLongPress={() =>
                    this.setState({
                        notificationOptionsVisible: true,
                        notificationOptionsProps: notificationOptionsProps,
                    })
                }
                bottomBorder={true}
            />
        );
    };

    acceptFriend = (friendshipId, expoPushToken, pushPermissions) => {
        this.setState((prevState) => {
            const updated = prevState.friendRequest;
            updated.seen = true;
            return { friendRequest: updated, pressed: true };
        });
        return this.props.firebase
            .acceptFriendRequest(friendshipId, {
                expoPushToken: expoPushToken,
                pushPermissions: pushPermissions,
            })
            .then(() => this.setState({ friendRequestStatus: 'Friend request accepted.' }))
            .catch((error) => console.log('Accept friend error', error));
    };
    removeFriend = (friendshipId) => {
        this.setState((prevState) => {
            const updated = prevState.friendRequest;
            updated.seen = true;
            return { friendRequest: updated, pressed: true };
        });
        return this.props.firebase
            .deleteFriend(friendshipId)
            .then(() => this.setState({ friendRequestStatus: 'Friend request deleted.' }))
            .catch((error) => console.log('Remove friend error', error));
    };
    renderFriendRequests = (request, responseStatus) => {
        return (
            <NotificationItem
                message={request.displayName + ' sent you a friend request.'}
                seen={request.seen}
                timeCreated={request.time_requested}
                avatarImg={request.profileImg}
                onPress={() => {
                    if (!request.seen) {
                        this.markRequestAsRead(request.id);
                    }
                    this.goToProfile(request.uid);
                }}
                subtitleElement={
                    responseStatus ? (
                        <MainText
                            style={{ color: Colors.appGray5, paddingVertical: 5, marginTop: 5 }}
                        >
                            {responseStatus}
                        </MainText>
                    ) : (
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Button
                                title={'Confirm'}
                                titleStyle={styles.confirmTitle}
                                buttonStyle={{
                                    backgroundColor: Colors.appGreen,
                                    paddingVertical: 5,
                                    marginRight: 5,
                                }}
                                containerStyle={{ flex: 1 }}
                                disabled={this.state.pressed}
                                onPress={() => {
                                    this.acceptFriend(
                                        request.id,
                                        request.expoPushToken,
                                        request.pushPermissions
                                    );
                                }}
                            />
                            <Button
                                title={'Delete'}
                                titleStyle={styles.deleteTitle}
                                buttonStyle={{
                                    backgroundColor: Colors.appGray3,
                                    paddingVertical: 5,
                                    marginLeft: 5,
                                }}
                                containerStyle={{ flex: 1 }}
                                disabled={this.state.pressed}
                                onPress={() => {
                                    this.removeFriend(request.id);
                                }}
                            />
                        </View>
                    )
                }
            />
        );
    };
    markRequestAsRead = (id) => {
        this.setState((prevState) => {
            const updated = prevState.friendRequest;
            updated.seen = true;
            return { friendRequest: updated };
        });
        return this.props.firebase.markFriendRequestAsSeen(id);
    };

    renderHeader = () => {
        const { friendRequest, friendRequestStatus } = this.state;
        return (
            <View>
                <View style={styles.listHeader}>
                    <MainText style={styles.listHeaderText}>Friend Requests</MainText>
                    <MainText onPress={this.goToFriendRequests} style={{ color: Colors.appGreen }}>
                        See all ({this.props.respondList.length})
                    </MainText>
                </View>
                {friendRequest ? (
                    this.renderFriendRequests(friendRequest, friendRequestStatus)
                ) : (
                    <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
                        <MainText style={styles.emptyText}>
                            You have no friend requests at the moment.
                        </MainText>
                    </View>
                )}
                <View style={styles.separator} />
                <View style={styles.listHeader}>
                    <MainText style={styles.listHeaderText}>Activity</MainText>
                </View>
            </View>
        );
    };
    renderEmptyNotifications = () => {
        return (
            <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
                <MainText style={styles.emptyText}>You have no activity at the moment.</MainText>
            </View>
        );
    };
    renderFooter = () => {
        if (this.state.fetchingMore) {
            return <ActivityIndicator color={Colors.appGreen} />;
        } else {
            return null;
        }
    };

    renderNotificationOptions = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.notificationOptionsVisible}
                title={'Options'}
                body={
                    <View>
                        {!this.state.notificationOptionsProps?.seen && (
                            <View>
                                <Button
                                    title={'Mark as read'}
                                    type={'clear'}
                                    titleStyle={styles.optionsTitle}
                                    icon={{
                                        name: 'done',
                                        color: Colors.statusGreen,
                                        size: 25,
                                        containerStyle: { paddingHorizontal: 10 },
                                    }}
                                    buttonStyle={{ justifyContent: 'flex-start' }}
                                    containerStyle={{ borderRadius: 0 }}
                                    onPress={() => {
                                        this.markAsRead(this.state.notificationOptionsProps);
                                        this.setState({
                                            notificationOptionsVisible: false,
                                            notificationOptionsProps: null,
                                        });
                                    }}
                                />
                                <Popup.Separator />
                            </View>
                        )}
                        <Button
                            title={'Remove this notification'}
                            type={'clear'}
                            titleStyle={styles.optionsTitle}
                            icon={{
                                name: 'delete',
                                color: Colors.statusRed,
                                size: 25,
                                containerStyle: { paddingHorizontal: 10 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => {
                                this.removeNotification(this.state.notificationOptionsProps);
                                this.setState({
                                    notificationOptionsVisible: false,
                                    notificationOptionsProps: null,
                                });
                            }}
                        />
                    </View>
                }
                buttonText={'Cancel'}
                callback={() => {
                    this.setState({
                        notificationOptionsVisible: false,
                        notificationOptionsProps: null,
                    });
                }}
            />
        );
    };

    render() {
        const { notifications, refreshing, loading } = this.state;
        if (loading) {
            return (
                <View
                    style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}
                >
                    <ActivityIndicator color={Colors.appGreen} />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {this.renderNotificationOptions()}
                    <FlatList
                        data={notifications}
                        renderItem={({ item, index }) => this.renderNotification(item, index)}
                        keyExtractor={(notification) => notification.notification_id}
                        ListHeaderComponent={this.renderHeader}
                        ListEmptyComponent={this.renderEmptyNotifications}
                        ListFooterComponent={this.renderFooter}
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                        onEndReached={this.retrieveMoreNotifications}
                        onEndReachedThreshold={0}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    listHeader: {
        backgroundColor: Colors.appWhite,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    listHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appBlack,
    },
    confirmTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '600',
        color: Colors.appWhite,
    },
    deleteTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '600',
        color: Colors.appBlack,
    },
    optionsTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appBlack,
        flexShrink: 1,
        textAlign: 'left',
    },
    separator: { height: 3, backgroundColor: Colors.appGray2 },
    emptyText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.appGray5,
    },
});

export default connect(mapStateToProps)(withFirebase(NotificationScreen));
