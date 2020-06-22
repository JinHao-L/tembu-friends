import React, { Component } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Avatar, Icon, Button, Badge, ListItem } from 'react-native-elements';

import { Colors, Layout } from '../../constants';
import { MainText, MAIN_FONT } from '../../components';
import { withFirebase } from '../../config/Firebase';

class UserProfile extends Component {
    state = {
        // bannerImg: undefined,
        // profileImg: undefined,
        // displayName: undefined,
        // // todo: implement verification system
        // verified: true,
        // role: undefined,
        // major: undefined,
        // year: undefined,
        // house: undefined,
        // roomNumber: undefined,
        // friendsCount: undefined,
        // aboutText: undefined,
        // moduleCodes: undefined,
        // moduleNames: undefined,
        profileData: null,
        following: undefined,

        postsData: [],
        limit: 10,
        lastLoaded: null,
        loading: false,
        refreshing: false,
    };
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    componentDidMount() {
        this.props.firebase.getUserData(this.props.navigation.route.params.user_uid).then(
            (userData) => {
                this.setState({ profileData: userData });
            },
            () => this.retrievePosts().catch((error) => console.log(error))
        );
    }

    retrievePosts = async () => {
        try {
            this.setState({ loading: true });
            console.log('Retrieving Posts');

            let initialQuery = await this.props.firebase
                .getPostCollection(this.state.profileData.uid)
                // .where('isPrivate', '==', false)
                .limit(this.state.limit);

            let documentSnapshots = await initialQuery.get();
            let postsData = documentSnapshots.docs.map((document) => document.data());

            let lastLoaded = postsData[postsData.length - 1].id;

            this.setState({
                postsData: postsData,
                lastLoaded: lastLoaded,
                loading: false,
            });
        } catch (error) {
            console.log(error);
        }
    };

    retrieveMorePosts = async () => {
        try {
            this.setState({
                refreshing: true,
            });
            console.log('Retrieving more posts');

            let additionalQuery = await this.props.firebase
                .getPostCollection(this.state.profileData.uid)
                // .where('isPrivate', '==', false)
                .startAfter(this.state.lastLoaded)
                .limitToLast(this.state.limit);

            let documentSnapshots = await additionalQuery.get();
            let postsData = documentSnapshots.docs.map((document) => document.data());

            let lastLoaded = postsData[postsData.length - 1].id;

            this.setState({
                postsData: [...this.state.postsData, ...postsData],
                lastLoaded: lastLoaded,
                refreshing: false,
            });
        } catch (error) {
            console.log(error);
        }
    };

    toggleFollow = () => {
        if (this.state.following) {
            this.setState({
                following: false,
            });
        } else {
            this.setState({
                following: true,
            });
        }
    };
    formatDate = (timestamp) => {
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
    };
    renderHouseText = () => {
        const house = this.props.userData.house || 'Undeclared';
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
        const { profileData, following, verified } = this.state;
        return (
            <>
                <View style={styles.header}>
                    <Image
                        style={styles.bannerImg}
                        source={
                            profileData.bannerImg
                                ? { uri: profileData.bannerImg }
                                : require('../../../assets/images/DefaultBanner.png')
                        }
                    />

                    <View
                        style={{
                            position: 'absolute',
                            top: (Layout.window.width * 8) / 25 - 40,
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
                                profileData.profileImg
                                    ? { uri: profileData.profileImg }
                                    : require('../../../assets/images/DefaultProfile.png')
                            }
                            showAccessory
                            accessory={{
                                color: Colors.appGreen,
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
                        {following ? (
                            <Button
                                containerStyle={styles.followButtonContainer}
                                buttonStyle={[
                                    styles.followButton,
                                    { backgroundColor: Colors.appGreen },
                                ]}
                                title="Following"
                                titleStyle={styles.followButtonText}
                                type={'solid'}
                                onPress={this.toggleFollow}
                            />
                        ) : (
                            <Button
                                containerStyle={styles.followButtonContainer}
                                buttonStyle={[
                                    styles.followButton,
                                    { borderColor: Colors.appGreen },
                                ]}
                                title="Follow"
                                titleStyle={[styles.followButtonText, { color: Colors.appGreen }]}
                                type={'outline'}
                                onPress={this.toggleFollow}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.spacing} />
                <View style={[styles.box, { paddingTop: 0 }]}>
                    <View style={styles.userDetails}>
                        <MainText style={{ fontSize: 18, color: Colors.appGreen }}>
                            {profileData.displayName}
                        </MainText>
                        {verified && (
                            <Image
                                style={{ height: 18, width: 18, marginHorizontal: 5 }}
                                source={require('../../../assets/images/verified-icon.png')}
                            />
                        )}
                    </View>
                    <View style={styles.userDetails}>
                        <Icon
                            type={'simple-line-icon'}
                            name={'briefcase'}
                            size={15}
                            color={Colors.appGreen}
                            containerStyle={styles.icon}
                        />
                        <MainText style={{ fontSize: 15 }}>{profileData.role}</MainText>
                    </View>
                    <View style={styles.userDetails}>
                        <Icon
                            type={'simple-line-icon'}
                            name={'book-open'}
                            size={15}
                            color={Colors.appGreen}
                            containerStyle={styles.icon}
                        />
                        <MainText style={{ fontSize: 15 }}>
                            {profileData.major}, {profileData.year}
                        </MainText>
                    </View>
                    <View style={styles.userDetails}>
                        <Icon
                            type={'simple-line-icon'}
                            name={'home'}
                            size={15}
                            color={Colors.appGreen}
                            containerStyle={styles.icon}
                        />
                        <MainText style={{ fontSize: 15 }}>
                            {this.renderHouseText()} {profileData.roomNumber} •{' '}
                            {profileData.friendsCount}{' '}
                            {profileData.friendsCount === 0 ? 'Friend' : 'Friends'}
                        </MainText>
                    </View>
                </View>
                <View style={styles.box}>
                    <MainText style={styles.title}>About</MainText>
                    <MainText>{profileData.aboutText}</MainText>
                </View>
                <View style={styles.box}>
                    <MainText style={styles.title}>Modules that I’ve taken in Tembusu</MainText>
                    <ScrollView style={{ maxHeight: 150 }}>
                        {profileData.moduleCodes.length === 0 ? (
                            <ListItem
                                title={'None'}
                                titleStyle={{
                                    fontFamily: MAIN_FONT,
                                    color: Colors.appDarkGray,
                                    fontSize: 12,
                                    textAlign: 'center',
                                }}
                                containerStyle={{ padding: 0, paddingBottom: 1 }}
                            />
                        ) : (
                            profileData.moduleCodes.map((item, index) => (
                                <ListItem
                                    key={item}
                                    leftElement={<MainText>•</MainText>}
                                    title={`${item} ${profileData.moduleNames[index]}`}
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
                    <MainText>Write something to {profileData.firstName}</MainText>
                    <Button title={'Write Post'} />
                </View>
            </>
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
        const {
            body,
            isPrivate,
            likeCount,
            likes,
            sender_img,
            sender_name,
            sender_uid,
            timePosted,
            id,
        } = post;
        return (
            <View style={styles.box}>
                <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar
                        size={35}
                        rounded
                        title={sender_name[0]}
                        source={
                            sender_img
                                ? { uri: sender_img }
                                : require('../../../assets/images/DefaultProfile.png')
                        }
                        containerStyle={{ marginRight: 10 }}
                    />
                    <View style={{ flexDirection: 'column' }}>
                        <MainText style={{ fontSize: 15 }}>{sender_name}</MainText>
                        <MainText>{this.formatDate(timePosted)}</MainText>
                    </View>
                    {isPrivate && (
                        <MainText
                            style={{ alignSelf: 'flex-end', marginLeft: 5, color: Colors.appGray }}
                        >
                            **Private**
                        </MainText>
                    )}
                </View>
                <MainText>{body}</MainText>
            </View>
        );
    };

    render() {
        const { profileData, postsData, refreshing } = this.state;
        if (profileData === null) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            );
        } else {
            return (
                <ScrollView style={styles.container}>
                    <FlatList
                        data={postsData}
                        renderItem={({ item }) => this.renderPost(item)}
                        keyExtractor={(post) => post.id}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.retrieveMorePosts}
                        onEndReachedThreshold={0}
                        refreshing={refreshing}
                    />
                </ScrollView>
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
        height: (Layout.window.width * 8) / 25,
        justifyContent: 'flex-end',
    },
    profileImg: {
        backgroundColor: Colors.appWhite,
        borderColor: Colors.appWhite,
        borderWidth: 4,
        marginLeft: 20,
    },
    followButtonContainer: {
        marginRight: 20,
        borderRadius: 20,
        marginBottom: 5,
    },
    followButton: {
        paddingVertical: 5,
        width: 86,
        borderRadius: 20,
    },
    followButtonText: {
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
    },
    box: {
        borderBottomWidth: 5,
        borderColor: Colors.appGray,
        backgroundColor: Colors.appWhite,
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 10,
    },
});

export default withFirebase(UserProfile);
