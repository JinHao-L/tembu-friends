import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, Input } from 'react-native-elements';
import { connect } from 'react-redux';

import { MAIN_FONT, MainText, UserItem } from '../components';
import { Colors } from '../constants/index';
import { withFirebase } from '../config/Firebase';

const mapStateToProps = (state) => {
    return {
        userData: state.userData,
    };
};

class ExploreScreen extends Component {
    constructor(props) {
        super(props);
        this.searchBarRef = React.createRef();
        this.state = {
            loading: false,
            userList: [],
            limit: 10,
        };
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
    clearSearch = () => {
        this.searchBarRef.current.clear();
        this.setState({
            userList: [],
        });
    };

    search = (event) => {
        const searchArr = event.nativeEvent.text.split(':', 2);
        let search = searchArr[0];
        let code = 'name';
        if (searchArr.length !== 1) {
            code = searchArr[0];
            search = searchArr[1];
        }
        if (search) {
            this.setState({ loading: true });
            if (code === 'name') {
                return this.searchByName(search);
            } else if (code === 'mod') {
                return this.searchByMod(search);
            } else if (code === 'role') {
                return this.searchByRole(search);
            } else if (code === 'room') {
                return this.searchByRoom(search);
            }
        }
    };
    searchByName = (name) => {
        const name_title = this.toTitleCase(name);
        console.log('Searching name', name_title);
        return this.props.firebase
            .getUserCollection()
            .where('displayName', '>=', name_title)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving Users :' + documents.length);
                return documents.map((document) => document.data());
            })
            .then((userList) =>
                this.setState({
                    userList: userList,
                    loading: false,
                })
            )
            .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
            });
    };
    searchByMod = (module) => {
        const mod = module.toUpperCase();
        console.log('Searching module', mod);
        return this.props.firebase
            .getUserCollection()
            .where('moduleCodes', 'array-contains', mod)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving Users :' + documents.length);
                return documents.map((document) => document.data());
            })
            .then((userList) =>
                this.setState({
                    userList: userList,
                    loading: false,
                })
            )
            .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
            });
    };
    searchByRole = (role) => {
        const role_title = this.toTitleCase(role);
        console.log('Searching role', role_title);
        return this.props.firebase
            .getUserCollection()
            .where('role', '>=', role_title)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving Users :' + documents.length);
                return documents.map((document) => document.data());
            })
            .then((userList) =>
                this.setState({
                    userList: userList,
                    loading: false,
                })
            )
            .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
            });
    };
    searchByRoom = (room) => {
        console.log('Searching room', room);
        return this.props.firebase
            .getUserCollection()
            .where('roomNumber', '>=', room)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving Users :' + documents.length);
                return documents.map((document) => document.data());
            })
            .then((userList) =>
                this.setState({
                    userList: userList,
                    loading: false,
                })
            )
            .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
            });
    };

    toTitleCase = (text) => {
        const lower = text.toLowerCase();
        const arr = text.split(' ');
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        return arr.join(' ');
    };

    searchIntro = () => {
        return (
            <View
                style={{
                    backgroundColor: Colors.appGray,
                    paddingHorizontal: 5,
                    paddingVertical: 7,
                    alignItems: 'center',
                    borderRadius: 10,
                }}
            >
                <MainText>Search examples</MainText>
                <View style={{ flexDirection: 'row' }}>
                    <View
                        style={{ flexDirection: 'column', alignItems: 'flex-end', paddingRight: 5 }}
                    >
                        <MainText>Search by name:</MainText>
                        <MainText>Search by module:</MainText>
                        <MainText>Search by role:</MainText>
                        <MainText>Search by room:</MainText>
                    </View>
                    <View style={{ flexDirection: 'column', paddingLeft: 5 }}>
                        <MainText>'John Doe'</MainText>
                        <MainText>'mod:CS1101S'</MainText>
                        <MainText>'role:Developer'</MainText>
                        <MainText>'room:#00-000'</MainText>
                    </View>
                </View>
            </View>
        );
    };

    renderProfile = (userData) => {
        const { displayName, profileImg, uid, role } = userData;
        return (
            <UserItem
                name={displayName}
                subtext={role}
                profileImg={profileImg}
                onPress={() => this.goToProfile(userData)}
            />
        );
    };
    renderRightIcon = () => {
        const { loading } = this.state;
        return loading ? (
            <ActivityIndicator style={{ marginRight: 5 }} />
        ) : (
            <Icon
                type={'material'}
                size={18}
                name={'clear'}
                color={Colors.appDarkGray}
                onPress={this.clearSearch}
            />
        );
    };

    render() {
        const { userList } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <LinearGradient
                    colors={[Colors.appGreen, Colors.appLightGreen]}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <MainText style={styles.title}>Explore</MainText>
                    </View>
                    <View style={styles.contentContainer}>
                        <View>
                            <Input
                                ref={this.searchBarRef}
                                style={{ flex: 1 }}
                                containerStyle={{ paddingHorizontal: 0, marginBottom: 10 }}
                                testID="searchInput"
                                placeholder={'Search for users'}
                                autoCorrect={true}
                                renderErrorMessage={false}
                                autoCapitalize={'none'}
                                onEndEditing={(text) => this.search(text)}
                                placeholderTextColor={Colors.appDarkGray}
                                inputStyle={styles.searchBarInput}
                                inputContainerStyle={styles.inputContentContainer}
                                leftIcon={{
                                    type: 'material',
                                    size: 18,
                                    name: 'search',
                                    color: Colors.appDarkGray,
                                }}
                                leftIconContainerStyle={styles.leftIconContainerStyle}
                                rightIcon={this.renderRightIcon()}
                                rightIconContainerStyle={styles.rightIconContainerStyle}
                            />
                        </View>
                        <FlatList
                            data={userList}
                            renderItem={({ item }) => this.renderProfile(item)}
                            keyExtractor={(user) => user.uid}
                            ListEmptyComponent={this.searchIntro}
                        />
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingBottom: 10,
        paddingTop: 20,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    title: {
        textAlign: 'left',
        color: Colors.appWhite,
        fontSize: 24,
        left: 30,
    },
    floorPlan: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBarInput: {
        marginLeft: 10,
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '100',
    },
    inputContentContainer: {
        borderRadius: 15,
        borderBottomWidth: 0,
        overflow: 'hidden',
        height: 30,
        backgroundColor: Colors.appGray,
    },
    leftIconContainerStyle: {
        marginLeft: 8,
    },
    rightIconContainerStyle: {
        marginRight: 8,
    },
});

export default connect(mapStateToProps)(withFirebase(ExploreScreen));
