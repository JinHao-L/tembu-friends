import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { MAIN_FONT, MainText, NotificationItem } from '../../components';
import { withFirebase } from '../../helper/Firebase';
import { connect } from 'react-redux';
import { Colors } from '../../constants';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        respondList: state.respondList,
    };
};

class FriendRequests extends Component {
    state = {
        requests: null,
        lastLoaded: null,
        allRequestsLoaded: false,
        refreshing: false,
        fetchingMore: false,
        limit: 10,

        pressed: [],
        loading: true,
    };

    componentDidMount() {
        // this.props.navigation.setOptions({
        //     headerLeft: () => (
        //         <Button
        //             containerStyle={{ borderRadius: 26 }}
        //             titleStyle={{ color: Colors.appWhite }}
        //             buttonStyle={{ padding: 0, height: 26, width: 26 }}
        //             icon={{
        //                 type: 'ionicon',
        //                 name: 'ios-arrow-back',
        //                 size: 26,
        //                 color: Colors.appWhite,
        //             }}
        //             onPress={() => {
        //                 this.props.route.params.onGoBack();
        //                 this.props.navigation.goBack();
        //             }}
        //             type={'clear'}
        //         />
        //     ),
        // });
        this.getFriendRequest();
    }

    getFriendRequest = () => {
        if (this.props.respondList.length === 0) {
            this.setState({
                requests: [],
                refreshing: false,
                loading: false,
            });
        } else {
            this.setState({ refreshing: true });
            const userRequests = [];
            this.props.respondList.forEach((entry) => {
                userRequests.push({ uid: entry.uid });
            });
            return this.props.firebase
                .getUsers(userRequests)
                .then((userRecords) => {
                    return userRecords.map((value, index) => {
                        return { ...value, ...this.props.respondList[index] };
                    });
                })
                .then((requests) => {
                    this.setState({
                        requests: requests,
                        refreshing: false,
                        loading: false,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({
                        requests: [],
                        refreshing: false,
                        loading: false,
                    });
                });
        }
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

    acceptFriend = (index, friendshipId, expoPushToken, pushPermissions) => {
        this.setState({
            pressed: [...this.state.pressed, friendshipId],
        });
        return this.props.firebase
            .acceptFriendRequest(friendshipId, {
                expoPushToken: expoPushToken,
                pushPermissions: pushPermissions,
            })
            .then(() => {
                this.state.requests[index].respondStatus = 'Friend request accepted';
                this.state.requests[index].seen = true;
                this.setState({
                    requests: [
                        ...this.state.requests.slice(0, index),
                        this.state.requests[index],
                        ...this.state.requests.slice(index + 1),
                    ],
                });
            })
            .catch((error) => console.log('Accept friend error', error));
    };

    removeFriend = (index, friendshipId) => {
        this.setState({
            pressed: [...this.state.pressed, friendshipId],
        });
        return this.props.firebase
            .deleteFriend(friendshipId)
            .then(() => {
                this.state.requests[index].respondStatus = 'Friend request deleted';
                this.state.requests[index].seen = true;
                this.setState({
                    requests: [
                        ...this.state.requests.slice(0, index),
                        this.state.requests[index],
                        ...this.state.requests.slice(index + 1),
                    ],
                });
            })
            .catch((error) => console.log('Remove friend error', error));
    };

    markRequestAsRead = (id, index) => {
        this.setState((prevState) => {
            const updated = prevState.requests;
            updated[index].seen = true;
            return { requests: updated };
        });
        return this.props.firebase.markFriendRequestAsSeen(id);
    };

    renderFriendRequests = (request, index) => {
        return (
            <NotificationItem
                message={request.displayName}
                seen={request.seen}
                titleSpread={true}
                timeCreated={request.time_requested}
                avatarImg={request.profileImg}
                onPress={() => {
                    if (!request.seen) {
                        this.markRequestAsRead(request.id, index);
                    }
                    this.goToProfile(request.uid);
                }}
                subtitleElement={
                    request.respondStatus ? (
                        <MainText
                            style={{ color: Colors.appGray5, paddingVertical: 5, marginTop: 5 }}
                        >
                            {request.respondStatus}
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
                                disabled={this.state.pressed.includes(request.id)}
                                onPress={() =>
                                    this.acceptFriend(
                                        index,
                                        request.id,
                                        request.expoPushToken,
                                        request.pushPermissions
                                    )
                                }
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
                                disabled={this.state.pressed.includes(request.id)}
                                onPress={() => this.removeFriend(index, request.id)}
                            />
                        </View>
                    )
                }
            />
        );
    };

    renderEmpty = () => {
        return (
            <View style={styles.emptyContainerStyle}>
                <Image
                    source={require('../../assets/images/misc/friend-request-icon.png')}
                    style={{ marginBottom: 30, width: 100, height: 100 }}
                />
                <MainText style={styles.emptyText}>
                    When other Tembusians ask to add you as a friend, you will see their requests
                    here.
                </MainText>
            </View>
        );
    };

    render() {
        const { requests, refreshing, loading } = this.state;
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
                <FlatList
                    contentContainerStyle={{ minHeight: '100%' }}
                    data={requests.sort(
                        (x, y) => y.time_requested.toMillis() - x.time_requested.toMillis()
                    )}
                    renderItem={({ item, index }) => this.renderFriendRequests(item, index)}
                    keyExtractor={(friend) => friend.id}
                    ListEmptyComponent={this.renderEmpty}
                    refreshing={refreshing}
                    onRefresh={this.getFriendRequest}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.appWhite,
        flex: 1,
    },
    emptyContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 12,
        fontWeight: '600',
        color: Colors.appWhite,
    },
    deleteTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 12,
        fontWeight: '600',
        color: Colors.appBlack,
    },
    separator: { height: 5, backgroundColor: Colors.appGray2 },
    emptyText: {
        marginHorizontal: 30,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.appBlack,
        textAlign: 'center',
    },
});

export default connect(mapStateToProps)(withFirebase(FriendRequests));
