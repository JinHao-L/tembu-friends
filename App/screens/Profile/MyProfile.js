import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
} from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Button, ListItem } from 'react-native-elements';

import { MAIN_FONT, MainText, Popup, ProfilePost, ProfileHeader } from '../../components';
import { Colors, Layout } from '../../constants';
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

const RoomStatusButton = ({ text, color }) => {
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
            .reportPost(this.props.userData.uid, postId)
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

    renderRoomStatusPopup = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.roomStatusPopupVisible}
                title={'Room Status'}
                body={
                    <View>
                        <RoomStatusButton text="I'm in my room!" color="green" />
                        <Popup.Separator />
                        <RoomStatusButton text="I'm not in my room :(" color="yellow" />
                        <Popup.Separator />
                        <RoomStatusButton text="Do not disturb!" color="red" />
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

    renderHouseText = (house) => {
        let color = Colors.appBlack;
        switch (house) {
            case 'Shan':
                color = Colors.shanHouse;
                break;
            case 'Ora':
                color = Colors.oraHouse;
                break;
            case 'Gaja':
                color = Colors.gajaHouse;
                break;
            case 'Tancho':
                color = Colors.tanchoHouse;
                break;
            case 'Ponya':
                color = Colors.ponyaHouse;
                break;
        }
        return <Text style={{ color: color }}>{house}</Text>;
    };
    getStatusColor = (type) => {
        switch (type) {
            case 'green':
                return Colors.statusGreen;
            case 'yellow':
                return Colors.statusYellow;
            case 'red':
                return Colors.statusRed;
            default:
                return Colors.statusYellow;
        }
    };

    renderHeader = () => {
        const {
            bannerImg,
            profileImg,
            displayName,
            role = 'Resident',
            major = 'Undeclared',
            year = 'Y0',
            house = 'Undeclared',
            roomNumber = '',
            friendsCount = 0,
            aboutText = "Hello, I'm new to TembuFriends",
            moduleCodes = [],
            moduleNames = [],
            verified,
            statusType,
        } = this.props.userData;
        return (
            <View>
                <View style={styles.header}>
                    <Image
                        style={styles.bannerImg}
                        source={
                            bannerImg
                                ? { uri: bannerImg }
                                : require('../../assets/images/default/banner.png')
                        }
                    />

                    <View style={styles.avatarContainerStyle}>
                        <Avatar
                            size={80}
                            containerStyle={styles.profileImg}
                            rounded
                            source={
                                profileImg
                                    ? { uri: profileImg }
                                    : require('../../assets/images/default/profile.png')
                            }
                            showAccessory
                            accessory={{
                                color: this.getStatusColor(statusType),
                                size: 22,
                                name: 'lens',
                                style: {
                                    backgroundColor: Colors.appWhite,
                                    borderRadius: 50,
                                },
                            }}
                            onAccessoryPress={this.toggleRoomStatusPopup}
                        />
                        <Button
                            containerStyle={styles.editButtonContainer}
                            buttonStyle={styles.editButton}
                            title="Edit Profile"
                            titleStyle={styles.editButtonText}
                            type={'outline'}
                            onPress={this.goToProfileEdit}
                        />
                    </View>
                </View>
                <View style={styles.spacing} />
                <View style={[styles.box, { paddingTop: 0 }]}>
                    <View style={styles.userDetails}>
                        <MainText style={{ fontSize: 18, color: Colors.appGreen }}>
                            {displayName}
                        </MainText>
                        {verified && (
                            <Image
                                style={{ height: 18, width: 18, marginHorizontal: 5 }}
                                source={require('../../assets/images/profile/verified-icon.png')}
                            />
                        )}
                    </View>
                    <View style={styles.userDetails}>
                        <Image
                            source={require('../../assets/images/profile/job-icon.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                        />
                        <MainText style={{ fontSize: 15 }}>{role}</MainText>
                    </View>
                    <View style={styles.userDetails}>
                        <Image
                            source={require('../../assets/images/profile/study-icon.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                        />
                        <MainText style={{ fontSize: 15 }}>
                            {major}, {year}
                        </MainText>
                    </View>
                    <View style={styles.userDetails}>
                        <Image
                            source={require('../../assets/images/profile/house-icon.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                        />
                        <MainText style={{ fontSize: 15 }}>
                            {this.renderHouseText(house)} {roomNumber}
                            {roomNumber ? ' ' : ''}• {friendsCount}{' '}
                            {friendsCount <= 1 ? 'Friend' : 'Friends'}
                        </MainText>
                    </View>
                </View>
                <View style={styles.box}>
                    <MainText style={styles.title}>About</MainText>
                    <MainText>{aboutText}</MainText>
                </View>
                <View style={styles.box}>
                    <MainText style={styles.title}>Modules that I’ve taken in Tembusu</MainText>
                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled={true}>
                        {moduleCodes.length === 0 ? (
                            <MainText style={styles.emptyText}>None</MainText>
                        ) : (
                            moduleCodes.map((item, index) => (
                                <ListItem
                                    key={item}
                                    leftElement={<MainText>•</MainText>}
                                    title={`${item} ${moduleNames[index]}`}
                                    titleStyle={{
                                        fontFamily: MAIN_FONT,
                                        fontSize: 13,
                                    }}
                                    containerStyle={{
                                        padding: 0,
                                        paddingBottom: 1,
                                    }}
                                />
                            ))
                        )}
                    </ScrollView>
                </View>
                <View style={[styles.box, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                    <MainText style={styles.title}>Posts</MainText>
                </View>
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
    bannerImg: {
        width: Layout.window.width,
        height: Layout.window.width / 3,
        justifyContent: 'flex-end',
    },
    profileImg: {
        backgroundColor: Colors.appWhite,
        borderColor: Colors.appWhite,
        borderWidth: 4,
        marginLeft: 20,
    },
    avatarContainerStyle: {
        position: 'absolute',
        top: Layout.window.width / 3 - 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
    },
    spacing: {
        height: 40,
    },
    userDetails: {
        marginBottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appGreen,
        marginBottom: 2,
    },
    icon: {
        marginLeft: 3,
        marginRight: 8,
        width: 15,
        height: 15,
    },
    box: {
        borderBottomWidth: 5,
        borderColor: Colors.appGray2,
        backgroundColor: Colors.appWhite,
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 10,
    },
    editButtonContainer: {
        marginRight: 20,
        borderRadius: 20,
        marginBottom: 5,
    },
    editButton: {
        paddingVertical: 2,
        width: 86,
        borderRadius: 20,
        paddingHorizontal: 0,
        borderColor: Colors.appGreen,
        borderWidth: 1,
    },
    editButtonText: {
        fontFamily: MAIN_FONT,
        fontSize: 12,
        color: Colors.appGreen,
    },
    emptyText: {
        fontFamily: MAIN_FONT,
        color: Colors.appGray4,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 5,
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
