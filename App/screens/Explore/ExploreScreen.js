import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

import { MAIN_FONT } from '../../components';
import { Colors } from '../../constants';
import { withFirebase } from '../../helper/Firebase';
import Layout from '../../constants/Layout';
import SearchResults from './SearchResults';
import SearchBar from '../../components/SearchBar';

class ExploreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userList: [],
            limit: 10,

            value: '',

            index: 0,
            routes: [
                { key: 'name', title: 'Name' },
                { key: 'role', title: 'Role' },
                { key: 'room', title: 'Room' },
                { key: 'module', title: 'Module' },
            ],

            nameUserList: [],
            roleUserList: [],
            roomUserList: [],
            moduleUserList: [],
        };
        this.searchValue = '';

        this.loaded = {
            name: false,
            role: false,
            room: false,
            module: false,
        };
    }

    setValue = (text) => {
        this.setState({
            value: text,
            nameUserList: [],
            roleUserList: [],
            roomUserList: [],
            moduleUserList: [],
        });
        this.searchValue = '';
    };
    setSearchValue = (text) => {
        this.loaded = {
            name: false,
            role: false,
            room: false,
            module: false,
        };
        this.searchValue = text;
        this.search(text);
    };
    setIndex = (index) => {
        this.setState(
            {
                index: index,
            },
            () => {
                this.search(this.searchValue);
            }
        );
    };

    renderScene = ({ route }) => {
        switch (route.key) {
            case 'name':
                return (
                    <SearchResults
                        navigation={this.props.navigation}
                        searchValue={this.searchValue}
                        userList={this.state.nameUserList}
                    />
                );
            case 'role':
                return (
                    <SearchResults
                        navigation={this.props.navigation}
                        searchValue={this.searchValue}
                        userList={this.state.roleUserList}
                    />
                );
            case 'room':
                return (
                    <SearchResults
                        navigation={this.props.navigation}
                        searchValue={this.searchValue}
                        userList={this.state.roomUserList}
                    />
                );
            case 'module':
                return (
                    <SearchResults
                        navigation={this.props.navigation}
                        searchValue={this.searchValue}
                        userList={this.state.moduleUserList}
                    />
                );
        }
    };

    search = (searchValue) => {
        const key = this.state.routes[this.state.index].key;
        if (searchValue) {
            if (key === 'name') {
                if (this.loaded.name) {
                    return;
                }
                return this.searchByName(searchValue);
            } else if (key === 'role') {
                if (this.loaded.role) {
                    return;
                }
                return this.searchByRole(searchValue);
            } else if (key === 'room') {
                if (this.loaded.room) {
                    return;
                }
                return this.searchByRoom(searchValue);
            } else if (key === 'module') {
                if (this.loaded.module) {
                    return;
                }
                return this.searchByMod(searchValue);
            }
        }
    };
    searchByName = (name) => {
        this.setState({ loading: true });
        const name_title = this.toTitleCase(name);
        console.log('Searching by name:', name_title);
        return this.props.firebase
            .getUserCollection()
            .orderBy('displayName', 'asc')
            .startAt(name_title)
            .endAt(name_title + '\uf8ff')
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving', documents.length, 'users');
                return documents.map((document) => document.data());
            })
            .then((userList) => {
                this.setState({
                    loading: false,
                    nameUserList: userList,
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log('Search by name failed:', error);
            })
            .finally(() => {
                this.loaded.name = true;
            });
    };
    searchByMod = (module) => {
        this.setState({ loading: true });
        const mod = module.toUpperCase();
        console.log('Searching by module:', mod);
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
            .then((userList) => {
                this.setState({
                    loading: false,
                    moduleUserList: userList,
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log('Search by module failed:', error);
            })
            .finally(() => {
                this.loaded.module = true;
            });
    };
    searchByRole = (role) => {
        this.setState({ loading: true });
        const role_title = this.toTitleCase(role);
        console.log('Searching by role:', role_title);
        return this.props.firebase
            .getUserCollection()
            .orderBy('role', 'asc')
            .startAt(role_title)
            .endAt(role_title + '\uf8ff')
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving', documents.length, 'users');
                return documents.map((document) => document.data());
            })
            .then((userList) => {
                this.setState({
                    loading: false,
                    roleUserList: userList,
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log('Search by role failed:', error);
            })
            .finally(() => {
                this.loaded.role = true;
            });
    };
    searchByRoom = (room) => {
        this.setState({ loading: true });
        let roomNumber = room;
        if (roomNumber.charAt(0) !== '#') {
            roomNumber = '#' + room;
        }
        console.log('Searching by room:', roomNumber);
        return this.props.firebase
            .getUserCollection()
            .orderBy('roomNumber', 'asc')
            .startAt(roomNumber)
            .endAt(roomNumber + '\uf8ff')
            .limit(this.state.limit)
            .get()
            .then((documentSnapshots) => documentSnapshots.docs)
            .then((documents) => {
                console.log('Retrieving', documents.length, 'users');
                return documents.map((document) => document.data());
            })
            .then((userList) => {
                this.setState({
                    loading: false,
                    roomUserList: userList,
                });
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log('Search by room failed:', error);
            })
            .finally(() => {
                this.loaded.room = true;
            });
    };

    toTitleCase = (text) => {
        const arr = text.split(' ');
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        return arr.join(' ');
    };

    render() {
        const { value, index, routes, loading } = this.state;
        return (
            <View style={styles.container}>
                <SearchBar
                    value={value}
                    onChangeText={this.setValue}
                    onEndEditing={this.setSearchValue}
                    onCancel={() => this.setValue('')}
                    loading={loading}
                    style={{ marginTop: 10, marginBottom: 5 }}
                />
                <TabView
                    renderScene={this.renderScene}
                    onIndexChange={this.setIndex}
                    navigationState={{ index, routes }}
                    lazy={true}
                    swipeEnabled={false}
                    initialLayout={{ width: Layout.window.width }}
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            style={{ backgroundColor: Colors.appWhite, elevation: 2 }}
                            tabStyle={{ minHeight: 40, alignItems: 'center' }}
                            getLabelText={({ route }) => route.title}
                            labelStyle={{
                                color: Colors.appBlack,
                                fontFamily: MAIN_FONT,
                                fontSize: 12,
                            }}
                            indicatorStyle={{ backgroundColor: Colors.appGreen }}
                        />
                    )}
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
});

export default withFirebase(ExploreScreen);
