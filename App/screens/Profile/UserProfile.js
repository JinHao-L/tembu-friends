import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { Colors, MAIN_FONT } from 'constant';
import { MainText, ProfilePost, ProfileHeader, Popup, GreenButton } from 'components';
import { withFirebase } from 'helper/Firebase';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        friends: state.friends,
    };
};

class UserProfile extends Component {
    state = {
        postsData: [],
        limit: 5,
        lastLoaded: null,
        userLoading: true,
        loading: false,
        refreshing: false,
        allPostsLoaded: false,
        buttonLoading: false,

        postOptionsVisible: false,
        postOptionsProps: null,
        unfriendPopupVisible: false,
        respondPopupVisible: false,
    };
    navigating = false;

    componentDidMount() {
        const { userData, user_uid } = this.props.route.params;
        if (userData) {
            this.setState(
                {
                    profileData: userData,
                    userLoading: false,
                },
                () => this.retrievePosts()
            );
        } else if (user_uid) {
            this.getUser(user_uid);
        } else {
            this.setState({
                profileData: null,
                userLoading: false,
            });
        }
    }

    goToProfile = (uid) => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        if (uid === this.props.userData.uid) {
            this.props.navigation.push('MyProfile');
        } else {
            this.props.navigation.push('UserProfile', { user_uid: uid });
        }
    };

    goToWritePost = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.props.navigation.navigate('PostCreate', {
            myName: this.props.userData.displayName,
            profileImg: this.props.userData.profileImg,
            profileData: this.state.profileData,
            refetch: this.retrievePosts,
        });
    };

    getUser = (uid) => {
        return this.props.firebase.getUserData(uid).then((profileData) => {
            if (profileData === null) {
                console.log('User not found', uid);
                this.setState({
                    profileData: profileData,
                    userLoading: false,
                });
            } else {
                this.setState(
                    {
                        profileData: profileData,
                        userLoading: false,
                    },
                    () => this.retrievePosts()
                );
            }
        });
    };

    onRefresh = () => {
        console.log('User refreshing');
        this.setState({ refreshing: true });
        return this.getUser(this.state.profileData.uid);
    };

    retrievePosts = () => {
        this.setState({ refreshing: true, allPostsLoaded: false });

        return this.props.firebase
            .getPostCollection(this.state.profileData.uid)
            .orderBy('time_posted', 'desc')
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving Posts : visiting - ' + documents.length);
                return documents.map((document) => document.data());
            })
            .then((postsData) => {
                let lastLoaded = postsData[postsData.length - 1].time_posted;
                postsData = postsData.filter(
                    (post) => !(post.is_private && post.sender_uid !== this.props.userData.uid)
                );

                this.setState({
                    postsData: postsData,
                    lastLoaded: lastLoaded,
                    refreshing: false,
                    allPostsLoaded: postsData.length === 0,
                });
            })
            .catch((error) => {
                this.setState({ refreshing: false });
                console.log(error);
            });
    };

    retrieveMorePosts = () => {
        if (this.state.allPostsLoaded || this.state.loading || this.state.refreshing) {
            return;
        }
        this.setState({
            loading: true,
        });

        return this.props.firebase
            .getPostCollection(this.state.profileData.uid)
            .orderBy('time_posted', 'desc')
            .startAfter(this.state.lastLoaded)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving more posts : visiting', documents.length);
                if (documents.length !== 0) {
                    let postsData = documents.map((document) => document.data());
                    let lastLoaded = postsData[postsData.length - 1].time_posted;
                    postsData = postsData.filter(
                        (post) => !(post.is_private && post.sender_uid !== this.props.userData.uid)
                    );

                    this.setState({
                        postsData: [...this.state.postsData, ...postsData],
                        lastLoaded: lastLoaded,
                        loading: false,
                    });
                } else {
                    this.setState({ loading: false, allPostsLoaded: true });
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
            });
    };

    requestFriend = () => {
        this.setState({
            buttonLoading: true,
        });
        const { uid, expoPushToken, pushPermissions } = this.state.profileData;
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
                    buttonLoading: false,
                });
            });
    };
    acceptFriend = () => {
        this.setState({
            buttonLoading: true,
        });
        const { expoPushToken, pushPermissions, uid } = this.state.profileData;
        const friendshipId = this.props.friends[uid]?.id;
        return this.props.firebase
            .acceptFriendRequest(friendshipId, {
                expoPushToken: expoPushToken,
                pushPermissions: pushPermissions,
            })
            .catch((error) => console.log('Accept friend error', error))
            .finally(() => {
                this.setState({
                    buttonLoading: false,
                });
            });
    };
    removeFriend = () => {
        this.setState({
            buttonLoading: true,
        });
        const { uid } = this.state.profileData;
        const friendshipId = this.props.friends[uid]?.id;
        return this.props.firebase
            .deleteFriend(friendshipId)
            .catch((error) => console.log('Remove friend error', error))
            .finally(() => {
                this.setState({
                    buttonLoading: false,
                });
            });
    };

    renderHeader = () => {
        const { uid } = this.state.profileData;
        const friendStatus = this.props.friends[uid]?.status;
        return (
            <ProfileHeader
                userData={this.state.profileData}
                button={
                    friendStatus === 'friends' ? (
                        <GreenButton
                            containerStyle={styles.friendsButtonContainer}
                            title="Friends"
                            type="solid"
                            loading={this.state.buttonLoading}
                            onPress={() =>
                                this.setState({
                                    unfriendPopupVisible: true,
                                })
                            }
                        />
                    ) : friendStatus === 'respond' ? (
                        <GreenButton
                            containerStyle={styles.friendsButtonContainer}
                            title="Respond"
                            type="outline"
                            loading={this.state.buttonLoading}
                            onPress={() =>
                                this.setState({
                                    respondPopupVisible: true,
                                })
                            }
                        />
                    ) : friendStatus === 'requested' ? (
                        <GreenButton
                            containerStyle={styles.friendsButtonContainer}
                            title="Requested"
                            type="solid"
                            loading={this.state.buttonLoading}
                            onPress={this.removeFriend}
                        />
                    ) : (
                        <GreenButton
                            containerStyle={styles.friendsButtonContainer}
                            title="Add Friend"
                            type="outline"
                            loading={this.state.buttonLoading}
                            onPress={this.requestFriend}
                        />
                    )
                }
                bottomElement={this.renderWritePost()}
            />
        );
    };
    renderWritePost = () => {
        const { firstName } = this.state.profileData;
        return (
            <View>
                <View
                    style={{
                        marginVertical: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        size={35}
                        rounded
                        title={firstName && firstName[0]}
                        source={
                            this.props.userData.profileImg
                                ? { uri: this.props.userData.profileImg }
                                : require('assets/images/default/profile.png')
                        }
                        containerStyle={{
                            marginRight: 10,
                            borderWidth: 1,
                            borderColor: Colors.appGray2,
                        }}
                    />
                    <MainText style={{ color: Colors.appGray2 }} onPress={this.goToWritePost}>
                        Write something to {firstName}...
                    </MainText>
                </View>
                <Button
                    title={'Write Post'}
                    titleStyle={styles.postButtonText}
                    containerStyle={styles.postButtonContainer}
                    buttonStyle={styles.postButton}
                    onPress={this.goToWritePost}
                />
            </View>
        );
    };
    renderFooter = () => {
        if (this.state.loading) {
            return <ActivityIndicator color={Colors.appGreen} />;
        } else {
            return null;
        }
    };
    renderPost = (post, index) => {
        const isOwner = post.sender_uid === this.props.userData.uid;
        return (
            <ProfilePost
                postDetails={post}
                onUserPress={this.goToProfile}
                postOptionsVisible={!post.reported || isOwner}
                onPostOptionsPress={(id, reported) =>
                    this.togglePostOptions(id, index, reported, isOwner)
                }
            />
        );
    };

    togglePostOptions = (id, index, reported, isOwner) => {
        if (id === undefined) {
            this.setState({
                postOptionsVisible: !this.state.postOptionsVisible,
                postOptionsProps: null,
            });
        } else {
            this.setState(
                {
                    postOptionsVisible: !this.state.postOptionsVisible,
                    postOptionsProps: {
                        postId: id,
                        index: index,
                        reported: reported,
                        isOwner: isOwner,
                    },
                },
                () => console.log(this.state.postOptionsProps)
            );
        }
    };

    deletePost = ({ postId, index }) => {
        this.setState(
            {
                postsData: [
                    ...this.state.postsData.slice(0, index),
                    ...this.state.postsData.slice(index + 1),
                ],
            },
            () => {
                if (postId === this.state.lastLoaded) {
                    this.setState({
                        lastLoaded: this.state.postsData[this.state.postsData.length - 1]
                            .time_posted,
                    });
                }
                console.log('Deleting Posts');
                this.props.firebase
                    .deletePost(this.state.profileData.uid, postId)
                    .catch((error) => console.log(error));
            }
        );
    };
    reportPost = ({ postId, index }) => {
        this.state.postsData[index].reported = true;
        this.setState({
            postsData: [
                ...this.state.postsData.slice(0, index),
                this.state.postsData[index],
                ...this.state.postsData.slice(index + 1),
            ],
        });
        return this.props.firebase
            .reportPost(
                this.state.profileData.uid,
                postId,
                this.state.profileData.displayName,
                this.props.userData.displayName
            )
            .catch((error) => console.log('report error', error));
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
                            this.removeFriend();
                            this.setState({
                                unfriendPopupVisible: false,
                            });
                        }}
                    />
                }
                buttonText={'Cancel'}
                callback={() =>
                    this.setState({
                        unfriendPopupVisible: false,
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
                                this.acceptFriend();
                                this.setState({
                                    respondPopupVisible: false,
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
                                this.removeFriend();
                                this.setState({
                                    respondPopupVisible: false,
                                });
                            }}
                        />
                    </View>
                }
                buttonText={'Cancel'}
                callback={() =>
                    this.setState({
                        respondPopupVisible: false,
                    })
                }
            />
        );
    };
    renderPostOptions = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.postOptionsVisible}
                title={'Options'}
                body={
                    <View>
                        {this.state.postOptionsProps?.isOwner ? (
                            <Button
                                title={'Delete this post'}
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
                                    this.deletePost(this.state.postOptionsProps);
                                    this.togglePostOptions();
                                }}
                            />
                        ) : !this.state.postOptionsProps?.reported ? (
                            <Button
                                title={'Flag post as inappropriate'}
                                type={'clear'}
                                titleStyle={styles.optionsTitle}
                                icon={{
                                    name: 'flag',
                                    color: Colors.statusYellow,
                                    size: 25,
                                    containerStyle: { paddingHorizontal: 10 },
                                }}
                                buttonStyle={{ justifyContent: 'flex-start' }}
                                containerStyle={{ borderRadius: 0 }}
                                onPress={() => {
                                    this.reportPost(this.state.postOptionsProps);
                                    this.togglePostOptions();
                                }}
                            />
                        ) : null}
                    </View>
                }
                buttonText={'Cancel'}
                callback={this.togglePostOptions}
            />
        );
    };

    render() {
        const { profileData, postsData, refreshing, userLoading } = this.state;
        if (userLoading || !this.props.userData) {
            return (
                <View
                    style={[
                        styles.container,
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                >
                    <ActivityIndicator size={'large'} />
                </View>
            );
        } else if (!userLoading && !profileData) {
            return (
                <View style={styles.userDeletedContainer}>
                    <Image
                        source={require('assets/images/profile/user-deleted-icon.png')}
                        style={{ marginBottom: 30, width: 100, height: 100 }}
                    />
                    <MainText style={styles.userDeletedText}>This account is deleted</MainText>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    {this.renderRespondPopup()}
                    {this.renderUnfriendPopup()}
                    {this.renderPostOptions()}
                    <FlatList
                        data={postsData}
                        renderItem={({ item, index }) => this.renderPost(item, index)}
                        keyExtractor={(post) => post.post_id}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.retrieveMorePosts}
                        onEndReachedThreshold={0.1}
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                        ListEmptyComponent={() => {
                            return <MainText style={styles.emptyText}>No Posts</MainText>;
                        }}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.appWhite,
        flex: 1,
    },
    postButtonText: {
        fontFamily: MAIN_FONT,
        color: Colors.appWhite,
        fontSize: 15,
    },
    postButtonContainer: {
        // height: 30,
        borderRadius: 5,
        marginVertical: 5,
        justifyContent: 'center',
    },
    postButton: {
        backgroundColor: Colors.appGreen,
        paddingVertical: 2,
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: MAIN_FONT,
        color: Colors.appGray4,
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 5,
    },
    popupTitleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appBlack,
        flexShrink: 1,
        textAlign: 'left',
    },
    friendsButtonContainer: {
        marginRight: 20,
        marginBottom: 5,
    },
    userDeletedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.appWhite,
    },
    userDeletedText: {
        marginHorizontal: 30,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.appBlack,
        textAlign: 'center',
    },
    optionsTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appBlack,
        flexShrink: 1,
        textAlign: 'left',
    },
});

export default connect(mapStateToProps)(withFirebase(UserProfile));
