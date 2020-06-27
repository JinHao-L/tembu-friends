import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    ActivityIndicator,
    Image,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Icon, Button, ListItem } from 'react-native-elements';

import { MAIN_FONT, MainText, Popup } from '../../components';
import { Colors, Layout } from '../../constants';
import { withFirebase } from '../../config/Firebase';
import { updateProfile } from '../../redux';

const mapStateToProps = (state) => {
    return { userData: state.userData };
};

const mapDispatchToProps = (dispatch) => {
    return { updateStatus: (uid, status) => dispatch(updateProfile(uid, { statusType: status })) };
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
        roomStatusPopupVisible: false,
    };
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    componentDidMount() {
        this.retrievePosts();
    }

    componentWillUnmount() {
        if (this.state.statusType && this.state.statusType !== this.props.userData.statusType) {
            this.props.updateStatus(this.props.userData.uid, this.state.statusType);
        }
    }

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
        return this.props.navigation.navigate('ProfileEdit');
    };
    goToOtherProfile = (uid) => {
        if (!uid || uid === 'deleted') {
            console.log('User does not exist', uid);
        } else {
            this.props.navigation.navigate('UserProfile', { user_uid: uid });
        }
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

    handleStatus = (statusType) => {
        this.setState({
            statusType: statusType,
        });
        this.toggleRoomStatusPopup();
    };
    statusColor = () => {
        switch (this.state.statusType || this.props.userData.statusType) {
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
    deletePost = (postId, index) => {
        this.setState(
            {
                postsData: [
                    ...this.state.postsData.slice(0, index),
                    ...this.state.postsData.slice(index + 1),
                ],
            },
            async () => {
                try {
                    if (postId === this.state.lastLoaded) {
                        this.setState({
                            lastLoaded: this.state.postsData[this.state.postsData.length - 1].id,
                        });
                    }
                    console.log('Deleting Posts');
                    this.props.firebase.deletePost(this.props.userData.uid, postId);
                } catch (error) {
                    console.log(error);
                }
            }
        );
    };

    toggleRoomStatusPopup = () => {
        this.setState({
            roomStatusPopupVisible: !this.state.roomStatusPopupVisible,
        });
    };
    togglePostOptions = (id, index) => {
        this.setState({
            postOptionsVisible: !this.state.postOptionsVisible,
            postOptionsId: id,
            postOptionsIndex: index,
        });
    };

    renderRoomStatusPopup = () => {
        return (
            <Popup
                imageType={'Custom'}
                isVisible={this.state.roomStatusPopupVisible}
                title={'Room Status'}
                body={
                    <View>
                        <Button
                            title={"I'm in my room!"}
                            type={'clear'}
                            titleStyle={{
                                fontFamily: MAIN_FONT,
                                fontSize: 15,
                                color: Colors.appBlack,
                            }}
                            icon={{
                                name: 'lens',
                                color: Colors.statusGreen,
                                size: 25,
                                containerStyle: { paddingHorizontal: 20 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => this.handleStatus('green')}
                        />
                        <Popup.Separator />
                        <Button
                            title={"I'm not in my room :("}
                            type={'clear'}
                            titleStyle={{
                                fontFamily: MAIN_FONT,
                                fontSize: 15,
                                color: Colors.appBlack,
                            }}
                            icon={{
                                name: 'lens',
                                color: Colors.statusYellow,
                                size: 25,
                                containerStyle: { paddingHorizontal: 20 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => this.handleStatus('yellow')}
                        />
                        <Popup.Separator />
                        <Button
                            title={'Do not disturb!'}
                            type={'clear'}
                            titleStyle={{
                                fontFamily: MAIN_FONT,
                                fontSize: 15,
                                color: Colors.appBlack,
                            }}
                            icon={{
                                name: 'lens',
                                color: Colors.statusRed,
                                size: 25,
                                containerStyle: { paddingHorizontal: 20 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            onPress={() => this.handleStatus('red')}
                        />
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
                        <Button
                            title={'Report as inappropriate'}
                            type={'clear'}
                            titleStyle={{
                                fontFamily: MAIN_FONT,
                                fontSize: 15,
                                color: Colors.appBlack,
                            }}
                            icon={{
                                name: 'report',
                                color: Colors.statusYellow,
                                size: 25,
                                containerStyle: { paddingHorizontal: 10 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            // TODO:
                            onPress={() => Alert.alert('Work in progress', 'Not available')}
                        />
                        <Popup.Separator />
                        <Button
                            title={'Delete post'}
                            type={'clear'}
                            titleStyle={{
                                fontFamily: MAIN_FONT,
                                fontSize: 15,
                                color: Colors.appBlack,
                            }}
                            icon={{
                                name: 'delete',
                                color: Colors.statusRed,
                                size: 25,
                                containerStyle: { paddingHorizontal: 10 },
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            containerStyle={{ borderRadius: 0 }}
                            // onPress={() => Alert.alert('Disabled', 'Disabled temporarily')}
                            onPress={() =>
                                this.deletePost(
                                    this.state.postOptionsId,
                                    this.state.postOptionsIndex
                                )
                            }
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
            friends = [],
            aboutText = "Hello, I'm new to TembuFriends",
            moduleCodes = [],
            moduleNames = [],
            verified,
        } = this.props.userData;
        const friendsCount = friends.length;
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
                                    : require('../../assets/images/default/profile.png')
                            }
                            showAccessory
                            accessory={{
                                color: this.statusColor(),
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
                            onAccessoryPress={this.toggleRoomStatusPopup}
                        />
                        <Button
                            containerStyle={styles.editButtonContainer}
                            buttonStyle={[
                                styles.editButton,
                                { borderColor: Colors.appGreen, borderWidth: 1 },
                            ]}
                            title="Edit Profile"
                            titleStyle={[styles.editButtonText, { color: Colors.appGreen }]}
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
                <View style={[styles.box, { borderBottomWidth: 0 }]}>
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
                                : require('../../assets/images/default/profile.png')
                        }
                        containerStyle={{
                            marginRight: 10,
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: Colors.appGray,
                        }}
                        onPress={() => this.goToOtherProfile(sender_uid)}
                    />
                    <View style={{ flexDirection: 'column' }}>
                        <MainText
                            style={{ fontSize: 15 }}
                            onPress={() => this.goToOtherProfile(sender_uid)}
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
                    <Icon
                        name={'more-horiz'}
                        size={18}
                        color={Colors.appGreen}
                        containerStyle={{ alignSelf: 'flex-start', marginLeft: 'auto' }}
                        onPress={() => this.togglePostOptions(post_id, index)}
                    />
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
                <SafeAreaView style={styles.container}>
                    {this.renderRoomStatusPopup()}
                    {this.renderPostOptions()}
                    <FlatList
                        data={postsData}
                        renderItem={({ item, index }) => this.renderPost(item, index)}
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
    editButtonContainer: {
        marginRight: 20,
        borderRadius: 20,
        marginBottom: 5,
    },
    editButton: {
        paddingVertical: 5,
        width: 86,
        height: 25,
        borderRadius: 20,
        paddingHorizontal: 0,
    },
    editButtonText: {
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

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(MyProfile));
