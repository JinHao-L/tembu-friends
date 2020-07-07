import React, { Component } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { Avatar, Button } from 'react-native-elements';

import { Colors } from '../../../constants';
import { MainText, MAIN_FONT, ProfilePost, ProfileHeader } from '../../../components';
import { withFirebase } from '../../../config/Firebase';
import { connect } from 'react-redux';
import { updateProfile } from '../../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateFriends: (uid, friends, friendsDetails) =>
            dispatch(
                updateProfile(uid, {
                    friends: friends,
                    friendsDetails: friendsDetails,
                })
            ),
    };
};

class UserProfile extends Component {
    state = {
        postsData: [],
        limit: 5,
        lastLoaded: null,
        loading: false,
        refreshing: false,
        allPostsLoaded: false,
    };

    componentDidMount() {
        const { userData, user_uid } = this.props.route.params;
        if (userData) {
            this.setState(
                {
                    profileData: userData,
                    uid: userData.uid,
                    areFriends: this.props.userData.friends?.includes(userData.uid),
                },
                () => this.retrievePosts()
            );
        } else {
            this.getUser(user_uid);
        }
    }

    goToProfile = (uid) => {
        if (!uid || uid === 'deleted') {
            console.log('User does not exist');
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.push('MyProfile');
        } else {
            this.props.navigation.push('UserProfile', { user_uid: uid });
        }
    };

    goToWritePost = () => {
        this.props.navigation.navigate('PostCreate', {
            myName: this.props.userData.displayName,
            profileImg: this.props.userData.profileImg,
            receiverName: this.state.profileData.firstName,
            receiverUid: this.state.uid,
            refetch: this.retrievePosts,
        });
    };

    getUser = (uid) => {
        return this.props.firebase
            .getUserData(uid)
            .then((profileData) => {
                if (profileData === undefined) {
                    console.log('User not found', uid);
                    this.props.navigation.goBack();
                } else {
                    this.setState(
                        {
                            uid: uid,
                            profileData: profileData,
                            areFriends: this.props.userData.friends?.includes(uid),
                        },
                        () => this.retrievePosts()
                    );
                }
            })
            .catch((error) => console.log('Failed to get user', error));
    };

    onRefresh = () => {
        console.log('User refreshing');
        this.setState({ refreshing: true });
        this.getUser(this.state.uid);
        return this.retrievePosts;
    };

    retrievePosts = () => {
        this.setState({ refreshing: true, allPostsLoaded: false });

        return this.props.firebase
            .getPostCollection(this.state.uid)
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
            .getPostCollection(this.state.uid)
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

    addFriend = () => {
        this.setState(
            {
                areFriends: true,
            },
            () => {
                const currFriendList = this.props.userData.friends || [];
                const currFriendDetails = this.props.userData.friendsDetails || [];
                const userDetails = {
                    uid: this.state.profileData.uid,
                    displayName: this.state.profileData.displayName,
                    profileImg: this.state.profileData.profileImg || '',
                    role: this.state.profileData.role || '',
                };
                this.props.updateFriends(
                    this.props.userData.uid,
                    [this.state.profileData.uid, ...currFriendList],
                    [userDetails, ...currFriendDetails]
                );
            }
        );
    };
    removeFriend = () => {
        this.setState(
            {
                areFriends: false,
            },
            () => {
                const currFriendList = this.props.userData.friends || [];
                const currFriendDetails = this.props.userData.friendsDetails || [];

                this.props.updateFriends(
                    this.props.userData.uid,
                    currFriendList.filter((uid) => uid !== this.state.profileData.uid),
                    currFriendDetails.filter(
                        (userDetails) => userDetails.uid !== this.state.profileData.uid
                    )
                );
            }
        );
    };

    renderHeader = () => {
        const { areFriends } = this.state;
        return (
            <ProfileHeader
                userData={this.state.profileData}
                button={
                    areFriends ? (
                        <Button
                            containerStyle={styles.friendButtonContainer}
                            buttonStyle={[
                                styles.friendButton,
                                { backgroundColor: Colors.appGreen },
                            ]}
                            title="Friends"
                            titleStyle={styles.friendButtonText}
                            type={'solid'}
                            onPress={this.removeFriend}
                        />
                    ) : (
                        <Button
                            containerStyle={styles.friendButtonContainer}
                            buttonStyle={[
                                styles.friendButton,
                                {
                                    borderColor: Colors.appGreen,
                                    borderWidth: 1,
                                },
                            ]}
                            title="Add Friend"
                            titleStyle={[styles.friendButtonText, { color: Colors.appGreen }]}
                            type={'outline'}
                            onPress={this.addFriend}
                        />
                    )
                }
                bottomElement={
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
                                title={this.props.userData.firstName[0]}
                                source={
                                    this.props.userData.profileImg
                                        ? { uri: this.props.userData.profileImg }
                                        : require('../../../assets/images/default/profile.png')
                                }
                                containerStyle={{
                                    marginRight: 10,
                                    borderWidth: StyleSheet.hairlineWidth,
                                    borderColor: Colors.appGray,
                                }}
                            />
                            <MainText style={{ color: Colors.appGray }}>
                                Write something to {this.state.profileData.firstName}...
                            </MainText>
                        </View>
                        <Button
                            title={'Write Post'}
                            titleStyle={styles.postButtonText}
                            containerStyle={styles.postButtonContainer}
                            buttonStyle={{ backgroundColor: Colors.appGreen }}
                            onPress={this.goToWritePost}
                        />
                    </View>
                }
            />
        );
    };
    renderFooter = () => {
        if (this.state.loading) {
            return <ActivityIndicator color={Colors.appGreen} />;
        } else {
            return null;
        }
    };
    renderPost = (post) => {
        return (
            <ProfilePost
                postDetails={post}
                onUserPress={this.goToProfile}
                postOptionsVisible={false}
            />
        );
    };

    render() {
        const { profileData, postsData, refreshing } = this.state;
        if (!profileData || !this.props.userData) {
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
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={postsData}
                        renderItem={({ item }) => this.renderPost(item)}
                        keyExtractor={(post) => post.post_id}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.retrieveMorePosts}
                        onEndReachedThreshold={0.5}
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                        ListEmptyComponent={() => {
                            return <MainText style={styles.emptyText}>No Posts</MainText>;
                        }}
                    />
                </SafeAreaView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.appWhite,
        flex: 1,
    },
    friendButtonContainer: {
        marginRight: 20,
        borderRadius: 20,
        marginBottom: 5,
    },
    friendButton: {
        paddingVertical: 5,
        width: 86,
        borderRadius: 20,
        paddingHorizontal: 0,
    },
    friendButtonText: {
        fontFamily: MAIN_FONT,
        fontSize: 12,
    },
    postButtonText: {
        fontFamily: MAIN_FONT,
        color: Colors.appWhite,
        fontSize: 15,
    },
    postButtonContainer: {
        height: 30,
        borderRadius: 5,
        marginVertical: 5,
        justifyContent: 'center',
    },
    emptyText: {
        fontFamily: MAIN_FONT,
        color: Colors.appDarkGray,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 5,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(UserProfile));
