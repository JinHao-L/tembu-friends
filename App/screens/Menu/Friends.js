import React, { Component } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
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
    goToExplore = () => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        return this.props.navigation.navigate('Explore');
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
        return (
            <View style={styles.emptyContainerStyle}>
                <MainText onPress={this.goToExplore} style={{ color: Colors.appGreen }}>
                    Find some friends
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
        return (
            <SearchBar
                value={this.state.searchValue}
                onChangeText={this.setSearchValue}
                onCancel={() => this.setSearchValue('')}
                style={{
                    paddingVertical: 10,
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
                {loading ? (
                    <View
                        style={[
                            styles.container,
                            { justifyContent: 'center', alignItems: 'center' },
                        ]}
                    >
                        <ActivityIndicator color={Colors.appGreen} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredList}
                        renderItem={({ item }) => this.renderProfile(item)}
                        keyExtractor={(friend) => friend.uid}
                        ListHeaderComponent={this.renderHeader}
                        ListEmptyComponent={this.renderEmpty}
                        refreshing={refreshing}
                        onRefresh={this.refresh}
                    />
                )}
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
});

export default connect(mapStateToProps)(withFirebase(Friends));
