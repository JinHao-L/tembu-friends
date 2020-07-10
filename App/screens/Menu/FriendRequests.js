import React, { Component } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ListItem } from 'react-native-elements';

import { MAIN_FONT, MainText, UserItem } from '../../components';
import { withFirebase } from '../../helper/Firebase';
import { connect } from 'react-redux';
import { Colors } from '../../constants';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
    };
};

class FriendRequests extends Component {
    state = {
        pendingList: [],
        refreshing: false,
    };

    componentDidMount() {
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

    renderProfile = (userData) => {
        const { displayName, profileImg, uid } = userData;
        return (
            <UserItem
                outerContainerStyle={{ borderWidth: 3, borderColor: Colors.appGreen }}
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
                    No Friend Requests
                </MainText>
            </View>
        );
    };

    render() {
        const { pendingList, refreshing } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <FlatList
                        data={pendingList}
                        renderItem={({ item }) => this.renderProfile(item)}
                        keyExtractor={(friend) => friend.uid}
                        ListEmptyComponent={this.renderEmpty}
                        refreshing={refreshing}
                        onRefresh={this.refresh}
                    />
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    emptyContainerStyle: {
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
