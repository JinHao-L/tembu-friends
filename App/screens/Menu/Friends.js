import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ListItem } from 'react-native-elements';

import { MAIN_FONT, MainText, UserItem } from '../../components';
import { withFirebase } from '../../helper/Firebase';
import { connect } from 'react-redux';
import { Colors } from '../../constants';
import SearchBar from '../../components/SearchBar';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
        friends: state.friends,
        respondList: state.respondList,
    };
};

class Friends extends Component {
    state = {
        filteredList: [],
        refreshing: false,
        loading: true,

        //Search filter
        searchValue: '',
    };
    friendList = [];

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        if (!this.state.loading) {
            this.setState({
                refreshing: true,
            });
        }

        const friendList = [];
        Object.entries(this.props.friends).forEach((entry) => {
            const status = entry[1].status;
            if (status === 'friends') {
                friendList.push({ uid: entry[0] });
            }
        });

        if (friendList.length === 0) {
            this.friendList = [];
            this.setState({
                filteredList: [],
                refreshing: false,
                loading: false,
            });
            return;
        }

        return this.props.firebase
            .getUsers(friendList)
            .then((list) => list.sort((a, b) => a.displayName.localeCompare(b.displayName)))
            .then((list) => {
                this.friendList = list;
                this.setState({
                    filteredList: list,
                });
            })
            .then(() => this.setSearchValue(this.state.searchValue))
            .finally(() => {
                this.setState({
                    refreshing: false,
                    loading: false,
                });
            });
    };

    navigating = false;
    goToProfile = (uid) => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        if (!uid || uid === 'deleted') {
            console.log('User does not exist', uid);
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.navigate('MyProfile');
        } else {
            this.props.navigation.navigate('UserProfile', { user_uid: uid });
        }
    };

    renderProfile = (userData) => {
        const { displayName, profileImg, uid } = userData;
        return (
            <UserItem
                name={displayName || 'undefined'}
                profileImg={profileImg || ''}
                onPress={() => this.goToProfile(uid)}
            />
        );
    };
    renderEmpty = () => {
        if (this.state.loading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <ActivityIndicator color={Colors.appGreen} />
                </View>
            );
        }
        return (
            <View style={styles.emptyContainerStyle}>
                <Image
                    source={require('../../assets/images/misc/friend-request-icon.png')}
                    style={{ marginBottom: 30, width: 100, height: 100 }}
                />
                <MainText style={styles.emptyText}>
                    You’ll see all of the Tembusians who have added you as friends here.
                </MainText>
            </View>
        );
    };

    setSearchValue = (text) => {
        this.setState({
            searchValue: text,
        });
        const filteredUsers = this.friendList.filter((data) => {
            return data.displayName.indexOf(text) > -1;
        });
        this.setState({
            filteredList: filteredUsers,
        });
    };

    renderHeader = () => {
        if (this.friendList.length === 0 && !this.state.loading) {
            return null;
        }

        return (
            <SearchBar
                value={this.state.searchValue}
                onChangeText={this.setSearchValue}
                onCancel={() => this.setSearchValue('')}
                style={{
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderColor: Colors.appGray2,
                }}
                autoCapitalize={'words'}
            />
        );
    };

    render() {
        const { filteredList, refreshing, loading } = this.state;
        return (
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={{ minHeight: '100%' }}
                    data={filteredList}
                    renderItem={({ item }) => this.renderProfile(item)}
                    keyExtractor={(friend) => friend.uid}
                    ListHeaderComponent={this.renderHeader}
                    ListEmptyComponent={this.renderEmpty}
                    refreshing={refreshing}
                    onRefresh={this.refresh}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    emptyContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginHorizontal: 30,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.appBlack,
        textAlign: 'center',
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
