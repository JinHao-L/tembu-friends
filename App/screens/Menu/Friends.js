import React, { Component } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ListItem } from 'react-native-elements';

import { MAIN_FONT, MainText, UserItem } from '../../components';
import { withFirebase } from '../../helper/Firebase';
import { connect } from 'react-redux';
import { Colors } from '../../constants';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        friends: state.friends,
    };
};

class Friends extends Component {
    state = {
        pendingList: [],
        friendList: [],
        refreshing: false,
        loading: true,
    };

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        this.setState({
            refreshing: true,
        });
        const friendList = [];
        const pendingList = [];
        Object.entries(this.props.friends).forEach((entry) => {
            const status = entry[1].status;
            if (status === 'friends') {
                friendList.push({ uid: entry[0] });
            } else if (status === 'respond') {
                pendingList.push({ uid: entry[0] });
            }
        });

        return this.props.firebase
            .getUsers(friendList)
            .then((list) => {
                this.setState({
                    friendList: list,
                });
            })
            .finally(() => {
                this.setState({
                    pendingList: pendingList,
                    refreshing: false,
                    loading: false,
                });
            });
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
    goToExplore = () => {
        return this.props.navigation.navigate('Explore');
    };
    goToFriendRequests = () => {
        return this.props.navigation.navigate('FriendRequests', {
            onGoBack: this.refresh,
            pendingList: this.state.pendingList,
        });
    };

    renderProfile = (userData) => {
        const { displayName, profileImg, uid } = userData;
        return (
            <View style={{ paddingHorizontal: 25 }}>
                <UserItem
                    name={displayName || 'undefined'}
                    profileImg={profileImg || ''}
                    onPress={() => this.goToProfile(uid)}
                />
            </View>
        );
    };
    renderEmpty = () => {
        return (
            <View style={styles.emptyContainerStyle}>
                <MainText onPress={this.goToExplore} style={{ color: Colors.appGreen }}>
                    Find some friends
                </MainText>
            </View>
        );
    };
    renderHeader = () => {
        return (
            <ListItem
                title={'Friend Requests'}
                titleStyle={styles.titleStyle}
                subtitle={'Approve or ignore requests'}
                subtitleStyle={styles.subtitleStyle}
                badge={{
                    value: this.state.pendingList.length,
                    badgeStyle: { backgroundColor: Colors.appGreen },
                    textStyle: styles.titleStyle,
                }}
                onPress={this.goToFriendRequests}
            />
        );
    };

    render() {
        const { friendList, refreshing, loading } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    {loading ? (
                        <View
                            style={[
                                styles.container,
                                { justifyContent: 'center', alignItems: 'center' },
                            ]}
                        >
                            <ActivityIndicator color={Colors.appWhite} />
                        </View>
                    ) : (
                        <FlatList
                            data={friendList.sort((a, b) =>
                                a.displayName.localeCompare(b.displayName)
                            )}
                            renderItem={({ item }) => this.renderProfile(item)}
                            keyExtractor={(friend) => friend.uid}
                            ListHeaderComponent={this.renderHeader}
                            ListEmptyComponent={this.renderEmpty}
                            refreshing={refreshing}
                            onRefresh={this.refresh}
                        />
                    )}
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainerStyle: {
        backgroundColor: Colors.appGray,
        paddingVertical: 7,
        marginTop: 12,
        alignItems: 'center',
        flex: 1,
    },
    titleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 14,
        textAlignVertical: 'center',
    },
    subtitleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
    },
});

export default connect(mapStateToProps)(withFirebase(Friends));
