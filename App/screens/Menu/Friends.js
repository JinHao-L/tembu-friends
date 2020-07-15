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
        respondList: state.respondList,
    };
};

class Friends extends Component {
    state = {
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
        Object.entries(this.props.friends).forEach((entry) => {
            const status = entry[1].status;
            if (status === 'friends') {
                friendList.push({ uid: entry[0] });
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
                    value: this.props.respondList.length,
                    badgeStyle: { backgroundColor: Colors.appGreen },
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
                            // ItemSeparatorComponent={() => <View style={styles.separator} />}
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
        backgroundColor: Colors.appGray2,
        paddingVertical: 7,
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
    separator: {
        height: 5,
        backgroundColor: Colors.appGray2,
    },
});

export default connect(mapStateToProps)(withFirebase(Friends));
