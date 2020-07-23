import React, { Component } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

import {
    MAIN_FONT,
    MainText,
    Popup,
    ProfilePost,
    ProfileHeader,
    GreenButton,
} from '../../components';
import { Colors } from '../../constants';
import { withFirebase } from '../../helper/Firebase';
import { fetchUserData, updateProfile } from '../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserData: () => {
            dispatch(fetchUserData());
        },
        updateStatus: (uid, status) => {
            dispatch(updateProfile(uid, { statusType: status }));
        },
    };
};

class MyProfile extends Component {
    state = {
        // Post retrieval
        postsData: [],
        limit: 5,
        lastLoaded: null,
        loading: false,
        refreshing: false,
        allPostsLoaded: false,

        // Popup handler
        postOptionsVisible: false,
        postOptionsProps: null,
        roomStatusPopupVisible: false,
    };
    navigating = false;

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={this.goToMyQR}
                    icon={
                        <Image
                            source={require('../../assets/images/profile/QR-Code.png')}
                            style={{ width: 25, height: 25 }}
                        />
                    }
                    type={'clear'}
                    titleStyle={{ color: Colors.appWhite }}
                    containerStyle={{ marginRight: 5, borderRadius: 20 }}
                />
            ),
        });
        this.retrievePosts();
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.props.fetchUserData();
        this.retrievePosts();
    };

    retrievePosts = () => {
        this.setState({ refreshing: true, allPostsLoaded: false });

        return this.props.firebase
            .getPostCollection(this.props.userData.uid)
            .orderBy('time_posted', 'desc')
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving Posts : personal', documents.length);
                return documents.map((document) => document.data());
            })
            .then((postsData) => {
                let lastLoaded = postsData[postsData.length - 1].time_posted;

                return this.setState({
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
            .getPostCollection(this.props.userData.uid)
            .orderBy('time_posted', 'desc')
            .startAfter(this.state.lastLoaded)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving more posts : personal', documents.length);
                if (documents.length !== 0) {
                    let postsData = documents.map((document) => document.data());
                    let lastLoaded = postsData[postsData.length - 1].time_posted;

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

    goToProfileEdit = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        return this.props.navigation.navigate('ProfileEdit');
    };
    goToOtherProfile = (uid) => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        if (!uid || uid === 'deleted') {
            console.log('User does not exist', uid);
        } else {
            this.props.navigation.push('UserProfile', { user_uid: uid });
        }
    };
    goToMyQR = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        this.props.navigation.push('MyQR');
    };

    handleStatus = (statusType) => {
        if (statusType !== this.props.userData.statusType) {
            this.props.updateStatus(this.props.userData.uid, statusType);
        }
        this.toggleRoomStatusPopup();
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
                    .deletePost(this.props.userData.uid, postId)
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
            .reportPost(this.props.userData.uid, postId, this.props.userData.displayName)
            .catch((error) => console.log('report error', error));
    };

    toggleRoomStatusPopup = () => {
        this.setState({
            roomStatusPopupVisible: !this.state.roomStatusPopupVisible,
        });
    };
    togglePostOptions = (id, index, reported) => {
        if (id === undefined) {
            this.setState({
                postOptionsVisible: !this.state.postOptionsVisible,
                postOptionsProps: null,
            });
        } else {
            this.setState({
                postOptionsVisible: !this.state.postOptionsVisible,
                postOptionsProps: {
                    postId: id,
                    index: index,
                    reported: reported,
                },
            });
        }
    };

    RoomStatusButton = (text, color) => {
        let actualColor = Colors.statusYellow;
        switch (color) {
            case 'green':
                actualColor = Colors.statusGreen;
                break;
            case 'yellow':
                actualColor = Colors.statusYellow;
                break;
            case 'red':
                actualColor = Colors.statusRed;
                break;
        }
        return (
            <Button
                title={text}
                type={'clear'}
                titleStyle={styles.optionsTitle}
                icon={{
                    name: 'lens',
                    color: actualColor,
                    size: 25,
                    containerStyle: { paddingHorizontal: 20 },
                }}
                buttonStyle={{ justifyContent: 'flex-start' }}
                containerStyle={{ borderRadius: 0 }}
                onPress={() => this.handleStatus(color)}
            />
        );
    };

    renderRoomStatusPopup = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.roomStatusPopupVisible}
                title={'Room Status'}
                body={
                    <View>
                        {this.RoomStatusButton("I'm in my room!", 'green')}
                        <Popup.Separator />
                        {this.RoomStatusButton("I'm not in my room :(", 'yellow')}
                        <Popup.Separator />
                        {this.RoomStatusButton('Do not disturb!', 'red')}
                    </View>
                }
                buttonText={'Cancel'}
                callback={this.toggleRoomStatusPopup}
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
                        {!this.state.postOptionsProps?.reported ? (
                            <View>
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
                                <Popup.Separator />
                            </View>
                        ) : null}
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
                    </View>
                }
                buttonText={'Cancel'}
                callback={this.togglePostOptions}
            />
        );
    };

    renderHeader = () => {
        return (
            <ProfileHeader
                userData={this.props.userData}
                onAccessoryPress={this.toggleRoomStatusPopup}
                button={
                    <GreenButton
                        containerStyle={styles.editButtonContainer}
                        type={'outline'}
                        onPress={this.goToProfileEdit}
                        title={'Edit Profile'}
                    />
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

    renderPost = (post, index) => {
        return (
            <ProfilePost
                postDetails={post}
                onUserPress={this.goToOtherProfile}
                postOptionsVisible={true}
                onPostOptionsPress={(id, reported) => this.togglePostOptions(id, index, reported)}
            />
        );
    };

    render() {
        const { userData } = this.props;
        const { postsData, refreshing } = this.state;
        if (!userData.uid) {
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
                <View style={styles.container}>
                    {this.renderRoomStatusPopup()}
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
    editButtonContainer: {
        marginRight: 20,
        marginBottom: 5,
    },
    emptyText: {
        fontFamily: MAIN_FONT,
        color: Colors.appGray4,
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 5,
    },
    optionsTitle: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appBlack,
        flexShrink: 1,
        textAlign: 'left',
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(MyProfile));
