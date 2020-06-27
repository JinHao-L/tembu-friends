import React, { Component } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Avatar, Icon, Button, ListItem } from 'react-native-elements';

import { Colors, Layout } from '../../../constants';
import { MainText, MAIN_FONT } from '../../../components';
import { withFirebase } from '../../../config/Firebase';
import { connect } from 'react-redux';
import { updateProfile } from '../../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return { updateFriends: (uid, friends) => dispatch(updateProfile(uid, { friends: friends })) };
};

class UserProfile extends Component {
    state = {
        friendToggled: false,

        postsData: [],
        limit: 5,
        lastLoaded: null,
        loading: false,
        refreshing: false,
        allPostsLoaded: false,
    };
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    componentDidMount() {
        const { userData, user_uid } = this.props.route.params;
        if (userData) {
            this.setState(
                {
                    profileData: userData,
                    uid: userData.uid,
                    statusColor: this.getStatusColor(userData.statusType),
                    areFriends: this.props.userData.friends?.includes(userData.uid),
                },
                () => this.retrievePosts()
            );
        } else {
            this.props.firebase
                .getUserData(user_uid)
                .then((profileData) => {
                    if (profileData === undefined) {
                        console.log('user not found', user_uid);
                        this.props.navigation.goBack();
                    } else {
                        this.setState(
                            {
                                profileData: profileData,
                                uid: user_uid,
                                statusColor: this.getStatusColor(profileData.statusType),
                                areFriends: this.props.userData.friends?.includes(user_uid),
                            },
                            () => this.retrievePosts()
                        );
                    }
                })
                .catch((error) => console.log('Failed to get user', error));
        }
    }

    componentWillUnmount() {
        if (this.state.friendToggled) {
            const currFriendList = this.props.userData.friends || [];
            if (currFriendList.includes(this.state.uid)) {
                this.props.updateFriends(
                    this.props.userData.uid,
                    currFriendList.filter((uid) => uid !== this.state.profileData.uid)
                );
            } else {
                this.props.updateFriends(this.props.userData.uid, [
                    ...currFriendList,
                    this.state.profileData.uid,
                ]);
            }
        }
    }

    goToProfile = (uid) => {
        if (!uid || uid === 'deleted') {
            console.log('User does not exist');
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.navigate('MyProfile');
        } else {
            this.props.navigation.navigate('UserProfile', { user_uid: uid });
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

    toggleFriend = () => {
        this.setState({
            friendToggled: !this.state.friendToggled,
        });
    };
    formatDate = (timestamp) => {
        if (timestamp) {
            const dateTimeFormat = timestamp.toDate();
            const day = dateTimeFormat.getDay();
            const month = this.months[dateTimeFormat.getMonth()];

            let hours = dateTimeFormat.getHours();
            let minutes = dateTimeFormat.getMinutes();
            const ampm = hours >= 12 ? ' PM' : ' AM';
            hours = hours % 12 || 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            const time = hours + ':' + minutes + ampm;

            return day + ' ' + month + ' at ' + time;
        } else {
            return null;
        }
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

    renderHeader = () => {
        const { friendToggled, areFriends } = this.state;
        const {
            bannerImg,
            profileImg,
            firstName,
            displayName,
            role = 'Resident',
            major = 'Undeclared',
            year = 'Y0',
            house = 'Undeclared',
            roomNumber = '',
            friends = [],
            aboutText = "Hello, I'm new to TembuFriends",
            moduleCodes = [],
            moduleNames = [],
            verified,
        } = this.state.profileData;
        const friendsCount = friends.length;
        return (
            <View>
                <View style={styles.header}>
                    <Image
                        style={styles.bannerImg}
                        source={
                            bannerImg
                                ? { uri: bannerImg }
                                : require('../../../assets/images/default/banner.png')
                        }
                    />

                    <View
                        style={{
                            position: 'absolute',
                            top: Layout.window.width / 3 - 40,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <Avatar
                            size={80}
                            containerStyle={styles.profileImg}
                            rounded
                            source={
                                profileImg
                                    ? { uri: profileImg }
                                    : require('../../../assets/images/default/profile.png')
                            }
                            showAccessory
                            accessory={{
                                color: this.state.statusColor,
                                size: 22,
                                name: 'lens',
                                style: {
                                    backgroundColor: Colors.appWhite,
                                    borderColor: Colors.appWhite,
                                    overflow: 'hidden',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                            }}
                        />
                        {(friendToggled && !areFriends) || (!friendToggled && areFriends) ? (
                            <Button
                                containerStyle={styles.friendButtonContainer}
                                buttonStyle={[
                                    styles.friendButton,
                                    { backgroundColor: Colors.appGreen },
                                ]}
                                title="Friends"
                                titleStyle={styles.friendButtonText}
                                type={'solid'}
                                onPress={this.toggleFriend}
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
                                onPress={this.toggleFriend}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.spacing} />
                <View style={[styles.box, { paddingTop: 0 }]}>
                    <View style={styles.userDetails}>
                        <MainText
                            style={{ fontSize: 18, color: Colors.appGreen, textAlign: 'center' }}
                        >
                            {displayName}
                        </MainText>
                        {verified && (
                            <Image
                                style={{ height: 18, width: 18, marginHorizontal: 5 }}
                                source={require('../../../assets/images/profile/verified-icon.png')}
                            />
                        )}
                    </View>
                    <View style={styles.userDetails}>
                        <Image
                            source={require('../../../assets/images/profile/job-icon.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                        />
                        <MainText style={{ fontSize: 15 }}>{role}</MainText>
                    </View>
                    <View style={styles.userDetails}>
                        <Image
                            source={require('../../../assets/images/profile/study-icon.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                        />
                        <MainText style={{ fontSize: 15 }}>
                            {major}, {year}
                        </MainText>
                    </View>
                    <View style={styles.userDetails}>
                        <Image
                            source={require('../../../assets/images/profile/house-icon.png')}
                            style={styles.icon}
                            resizeMode={'contain'}
                        />
                        <MainText style={{ fontSize: 15 }}>
                            {this.renderHouseText(house)} {roomNumber}
                            {roomNumber ? ' ' : ''}• {friendsCount}{' '}
                            {friendsCount === 0 ? 'Friend' : 'Friends'}
                        </MainText>
                    </View>
                </View>
                <View style={styles.box}>
                    <MainText style={styles.title}>About</MainText>
                    <MainText>{aboutText}</MainText>
                </View>
                <View style={styles.box}>
                    <MainText style={styles.title}>Modules that I’ve taken in Tembusu</MainText>
                    <ScrollView style={{ maxHeight: 150 }}>
                        {moduleCodes.length === 0 ? (
                            <ListItem
                                title={'None'}
                                titleStyle={styles.emptyText}
                                containerStyle={{ padding: 0 }}
                            />
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
                <View style={styles.box}>
                    <MainText style={styles.title}>Posts</MainText>
                    <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
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
                            Write something to {firstName}...
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
    renderPost = (post) => {
        if (post.is_private && post.sender_uid !== this.props.userData.uid) {
            return null;
        }
        const {
            body,
            is_private,
            //TODO: implement likes
            likes,
            sender_img,
            sender_name,
            sender_uid,
            time_posted,
            post_id,
            imgUrl,
            imgRatio,
        } = post;
        return (
            <View style={[styles.box, is_private && { backgroundColor: Colors.appLightGray }]}>
                <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar
                        size={35}
                        rounded
                        title={sender_name[0]}
                        source={
                            sender_img
                                ? { uri: sender_img }
                                : require('../../../assets/images/default/profile.png')
                        }
                        containerStyle={{
                            marginRight: 10,
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: Colors.appGray,
                        }}
                        onPress={() => this.goToProfile(sender_uid)}
                    />
                    <View style={{ flexDirection: 'column' }}>
                        <MainText
                            style={{ fontSize: 15 }}
                            onPress={() => this.goToProfile(sender_uid)}
                        >
                            {sender_name}
                        </MainText>
                        <MainText>{this.formatDate(time_posted)}</MainText>
                    </View>
                    {is_private && (
                        <MainText
                            style={{
                                alignSelf: 'flex-end',
                                marginLeft: 5,
                                color: Colors.appDarkGray,
                            }}
                        >
                            (Private)
                        </MainText>
                    )}
                </View>
                <MainText>{body}</MainText>
                {imgUrl ? (
                    <Image
                        source={{ uri: imgUrl }}
                        style={{
                            marginTop: 5,
                            width: '100%',
                            aspectRatio: imgRatio,
                            resizeMode: 'contain',
                        }}
                    />
                ) : null}
            </View>
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
                        onRefresh={this.retrievePosts}
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
    header: {},
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
    spacing: {
        height: 40,
    },
    userDetails: {
        marginBottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appGreen,
        marginBottom: 2,
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
    icon: {
        marginLeft: 3,
        marginRight: 8,
        width: 15,
        height: 15,
    },
    box: {
        borderBottomWidth: 5,
        borderColor: Colors.appGray,
        backgroundColor: Colors.appWhite,
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 10,
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
