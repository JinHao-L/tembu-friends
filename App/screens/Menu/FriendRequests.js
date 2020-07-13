import React, { Component } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';

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

class FriendRequests extends Component {
    state = {
        pendingList: [],
        refreshing: false,

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
        this.refresh();
    }

    refresh = () => {
        this.setState({
            refreshing: true,
        });
        return this.props.firebase
            .getUsers(this.props.route.params.pendingList)
            .then((list) => {
                this.setState({
                    pendingList: list,
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

    removeRequest = (uid, index) => {
        const friendshipId = this.props.friends[uid]?.id;
        return this.props.firebase
            .deleteFriend(friendshipId)
            .catch((error) => console.log('Remove friend error', error))
            .finally(() => {
                this.setState({
                    pendingList: [
                        ...this.state.pendingList.slice(0, index),
                        ...this.state.pendingList.slice(index + 1),
                    ],
                });
            });
    };

    renderProfile = (userData, index) => {
        const { displayName, profileImg, uid } = userData;
        return (
            <UserItem
                name={displayName || 'undefined'}
                profileImg={profileImg || ''}
                onPress={() => this.goToProfile(uid)}
                rightElement={() => (
                    <View style={{ flexDirection: 'row' }}>
                        <Button
                            type={'clear'}
                            icon={{ name: 'clear', color: Colors.appRed, size: 25 }}
                            buttonStyle={{ padding: 0, margin: 0 }}
                            containerStyle={{ borderRadius: 30 }}
                            titleStyle={{ color: Colors.appGray }}
                            onPress={() => this.removeRequest(uid, index)}
                        />
                    </View>
                )}
            />
        );
    };
    renderEmpty = () => {
        return (
            <View style={styles.emptyContainerStyle}>
                <MainText onPress={this.goToExplore} style={{ color: Colors.appGreen }}>
                    No Friend Requests
                </MainText>
            </View>
        );
    };

    render() {
        const { pendingList, refreshing, loading } = this.state;
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
                            contentContainerStyle={{ paddingHorizontal: 25 }}
                            data={pendingList.sort((a, b) =>
                                a.displayName.localeCompare(b.displayName)
                            )}
                            renderItem={({ item, index }) => this.renderProfile(item, index)}
                            keyExtractor={(friend) => friend.uid}
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
        marginTop: 20,
        backgroundColor: Colors.appGray,
        paddingVertical: 7,
        alignItems: 'center',
        flex: 1,
    },
    titleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 14,
    },
    subtitleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
    },
});

export default connect(mapStateToProps)(withFirebase(FriendRequests));
