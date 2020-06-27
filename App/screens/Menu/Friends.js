import React, { Component } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import { MainText, UserItem } from '../../components';
import { withFirebase } from '../../config/Firebase';
import { connect } from 'react-redux';
import { Colors } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
    };
};

class Friends extends Component {
    state = {
        friendList: [],
        loading: false,
    };

    componentDidMount() {
        const friends = this.props.userData.friends;
        if (friends.length === 0) {
            return;
        }
        this.setState({ loading: true });
        return this.props.firebase
            .getUserCollection()
            .where('uid', 'in', friends)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving Users :' + documents.length);
                return documents.map((document) => document.data());
            })
            .then((userList) =>
                this.setState({
                    friendList: userList,
                    loading: false,
                })
            )
            .catch((error) => {
                this.setState({ loading: false });
                console.log('Get friends failed', error);
            });
    }

    goToProfile = (userData) => {
        const { uid } = userData;
        if (!uid || uid === 'deleted') {
            console.log('User does not exist', uid);
        } else if (uid === this.props.userData.uid) {
            this.props.navigation.navigate('MyProfile');
        } else {
            this.props.navigation.navigate('UserProfile', { userData: userData });
        }
    };
    goToExplore = () => {
        return this.props.navigation.navigate('ExploreNav');
    };

    renderProfile = (userData) => {
        const { displayName, profileImg, uid, role } = userData;
        return (
            <UserItem
                outerContainerStyle={{ borderWidth: 3, borderColor: Colors.appGreen }}
                name={displayName}
                subtext={role}
                profileImg={profileImg}
                onPress={() => this.goToProfile(userData)}
            />
        );
    };
    renderEmpty = () => {
        return (
            <View
                style={{
                    backgroundColor: Colors.appGray,
                    paddingVertical: 7,
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <MainText onPress={this.goToExplore} style={{ color: Colors.appGreen }}>
                    Find some friends
                </MainText>
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

    render() {
        const { userData } = this.props;
        const { friendList } = this.state;

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
        }
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <FlatList
                        data={friendList}
                        renderItem={({ item }) => this.renderProfile(item)}
                        keyExtractor={(friend) => friend.uid}
                        ListFooterComponent={this.renderFooter}
                        ListEmptyComponent={this.renderEmpty}
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
        paddingHorizontal: 25,
    },
});

export default connect(mapStateToProps)(withFirebase(Friends));
