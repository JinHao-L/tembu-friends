import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';

import { MAIN_FONT, MainText, UserItem } from '../../components';
import { Colors } from '../../constants';
import { withFirebase } from '../../helper/Firebase';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
    };
};

class SearchResults extends Component {
    constructor(props) {
        super(props);
        this.navigating = false;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.userList !== nextProps.userList;
    }

    goToProfile = (userData) => {
        if (this.navigating) {
            return;
        }
        this.navigating = true;
        setTimeout(() => (this.navigating = false), 500);
        const { uid } = userData;
        if (!uid || uid === 'deleted') {
            console.log('User does not exist', uid);
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.navigate('MyProfile');
        } else {
            this.props.navigation.navigate('UserProfile', {
                userData: userData,
            });
        }
    };

    renderEmpty = () => {
        if (this.props.searchValue) {
            return (
                <View style={styles.emptyContainer}>
                    <MainText style={styles.emptyText}>No users found</MainText>
                </View>
            );
        } else {
            return (
                <View style={{ marginTop: 50, alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/misc/search-guide.png')}
                        style={{
                            width: 300,
                            height: 100,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
            );
        }
    };
    renderProfile = (userData) => {
        const { displayName, profileImg } = userData;

        return (
            <UserItem
                name={displayName}
                profileImg={profileImg}
                onPress={() => this.goToProfile(userData)}
            />
        );
    };

    render() {
        const { userList } = this.props;
        return (
            <View style={styles.container}>
                <FlatList
                    data={userList}
                    renderItem={({ item }) => this.renderProfile(item)}
                    keyExtractor={(user) => user.uid}
                    ListEmptyComponent={this.renderEmpty}
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
    emptyContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '600',
    },
    searchBarInput: {
        marginLeft: 10,
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '100',
    },
    inputContainer: {
        margin: 0,
        padding: 0,
    },
    inputContentContainer: {
        height: 40,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.appGray4,
        backgroundColor: Colors.appWhite,
        margin: 0,
        padding: 0,
    },
    leftIconContainerStyle: {
        paddingLeft: 8,
    },
    rightIconContainerStyle: {
        marginRight: 8,
    },
});

export default connect(mapStateToProps)(withFirebase(SearchResults));
