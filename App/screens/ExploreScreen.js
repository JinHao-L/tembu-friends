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
            searchStarted: false,
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
            searchStarted: false,
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
            this.setState({ loading: true, searchStarted: true });
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
        console.log('Searching by name', name_title);
        return this.props.firebase
            .getUserCollection()
            .where('displayName', '>=', name_title)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving', documents.length, 'users');
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
                console.log('Search by name failed:', error);
            });
    };
    searchByMod = (module) => {
        const mod = module.toUpperCase();
        console.log('Searching module:', mod);
        return this.props.firebase
            .getUserCollection()
            .where('moduleCodes', 'array-contains', mod)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving', documents.length, 'users');
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
                console.log('Search by module failed:', error);
            });
    };
    searchByRole = (role) => {
        const role_title = this.toTitleCase(role);
        console.log('Searching by role:', role_title);
        return this.props.firebase
            .getUserCollection()
            .where('role', '>=', role_title)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving', documents.length, 'users');
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
                console.log('Search by role failed:', error);
            });
    };
    searchByRoom = (room) => {
        console.log('Searching by room:', room);
        return this.props.firebase
            .getUserCollection()
            .where('roomNumber', '>=', room)
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving', documents.length, 'users');
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
                console.log('Search by room failed:', error);
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
                <MainText style={{ fontSize: 15, borderBottomWidth: 1 }}>Search examples</MainText>
                <View style={{ flexDirection: 'row' }}>
                    <View
                        style={{ flexDirection: 'column', alignItems: 'flex-end', paddingRight: 5 }}
                    >
                        <MainText style={styles.labelStyle}>Search by name:</MainText>
                        <MainText style={styles.labelStyle}>Search by module:</MainText>
                        <MainText style={styles.labelStyle}>Search by role:</MainText>
                        <MainText style={styles.labelStyle}>Search by room:</MainText>
                    </View>
                    <View style={{ flexDirection: 'column', paddingLeft: 5 }}>
                        <MainText style={styles.exampleStyle}>'John Doe'</MainText>
                        <MainText style={styles.exampleStyle}>'mod:CS1101S'</MainText>
                        <MainText style={styles.exampleStyle}>'role:Developer'</MainText>
                        <MainText style={styles.exampleStyle}>'room:#00-000'</MainText>
                    </View>
                </View>
            </View>
        );
    };

    renderEmpty = () => {
        if (this.state.searchStarted) {
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
                    <MainText style={{ color: Colors.appDarkGray }}>No results</MainText>
                    <MainText style={{ color: Colors.appDarkGray }}>
                        Did you use the correct prefix?
                    </MainText>
                </View>
            );
        } else {
            return this.searchIntro();
        }
    };
    renderProfile = (userData) => {
        const { displayName, profileImg, uid, role } = userData;
        if (uid === this.props.userData.uid) {
            return null;
        } else {
            return (
                <UserItem
                    name={displayName}
                    subtext={role}
                    profileImg={profileImg}
                    onPress={() => this.goToProfile(userData)}
                />
            );
        }
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
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                            data={userList}
                            renderItem={({ item }) => this.renderProfile(item)}
                            keyExtractor={(user) => user.uid}
                            ListEmptyComponent={this.renderEmpty}
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
        paddingHorizontal: 15,
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
        backgroundColor: Colors.appWhite,
    },
    leftIconContainerStyle: {
        marginLeft: 8,
    },
    rightIconContainerStyle: {
        marginRight: 8,
    },
    labelStyle: {
        // color: Colors.appDarkGray,
    },
    exampleStyle: {
        fontStyle: 'italic',
    },
});

export default connect(mapStateToProps)(withFirebase(ExploreScreen));
