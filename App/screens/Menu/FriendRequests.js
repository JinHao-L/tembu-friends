import React, { Component } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
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

        loading: true,
    };

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <Button
                    containerStyle={{ borderRadius: 28 }}
                    titleStyle={{ color: Colors.appWhite }}
                    buttonStyle={{ padding: 0, height: 28, width: 28 }}
                    icon={{
                        type: 'ionicon',
                        name: 'ios-arrow-back',
                        size: 28,
                        color: Colors.appWhite,
                    }}
                    onPress={() => {
                        this.props.route.params.onGoBack();
                        this.props.navigation.goBack();
                    }}
                    type={'clear'}
                />
            ),
        });
        this.getFriendRequest();
        console.log(this.state.requests);
    }

    getFriendRequest = () => {
        if (this.props.respondList.length === 0) {
            this.setState({
                requests: [],
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
                    });
                })
                .finally(() => {
                    this.setState({ refreshing: false, loading: false });
                });
        }
    };

    goToProfile = (uid) => {
        if (!uid || uid === 'deleted') {
            console.log('User does not exist', uid);
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.navigate('MyProfile');
        } else {
            this.props.navigation.navigate('UserProfile', { user_uid: uid });
        }
    };

    acceptFriend = (index, friendshipId, expoPushToken, pushPermissions) => {
        return this.props.firebase
            .acceptFriendRequest(friendshipId, {
                expoPushToken: expoPushToken,
                pushPermissions: pushPermissions,
            })
            .catch((error) => console.log('Accept friend error', error))
            .finally(() => {
                this.setState({
                    requests: [
                        ...this.state.requests.slice(0, index),
                        ...this.state.requests.slice(index + 1),
                    ],
                });
            });
    };

    removeFriend = (index, friendshipId) => {
        return this.props.firebase
            .deleteFriend(friendshipId)
            .catch((error) => console.log('Remove friend error', error))
            .finally(() => {
                this.setState({
                    requests: [
                        ...this.state.requests.slice(0, index),
                        ...this.state.requests.slice(index + 1),
                    ],
                });
            });
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
        let confirmLoading = false;
        let deleteLoading = false;
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
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Button
                            title={'Confirm'}
                            titleStyle={styles.confirmTitle}
                            buttonStyle={{
                                backgroundColor: Colors.appGreen,
                                height: 30,
                                marginRight: 5,
                            }}
                            containerStyle={{ flex: 1 }}
                            loading={confirmLoading}
                            onPress={() => {
                                confirmLoading = true;
                                this.acceptFriend(
                                    index,
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
                                height: 30,
                                marginLeft: 5,
                            }}
                            containerStyle={{ flex: 1 }}
                            loading={deleteLoading}
                            onPress={() => {
                                deleteLoading = true;
                                this.removeFriend(index, request.id);
                            }}
                        />
                    </View>
                }
            />
        );
    };

    renderEmpty = () => {
        return (
            <View style={styles.emptyContainerStyle}>
                <MainText
                    onPress={this.goToExplore}
                    style={{ color: Colors.appBlack, textAlign: 'center' }}
                >
                    No Friend Requests
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
            <SafeAreaView style={styles.container}>
                <FlatList
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
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.appWhite,
        flex: 1,
    },
    emptyContainerStyle: {
        marginTop: 10,
        paddingVertical: 10,
        alignItems: 'center',
        flex: 1,
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
});

export default connect(mapStateToProps)(withFirebase(FriendRequests));
