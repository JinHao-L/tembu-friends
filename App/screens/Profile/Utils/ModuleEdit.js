import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ButtonGroup, Input, ListItem } from 'react-native-elements';
import { TabBar, TabView } from 'react-native-tab-view';

import Colors from '../../../constants/Colors';
import { MAIN_FONT, Popup } from '../../../components';
import SearchBar from '../../../components/SearchBar';
import Layout from '../../../constants/Layout';
import { AllModules, MyModules } from './ModulesUtil';

class ModuleEdit extends Component {
    state = {
        isLoading: true,
        searchTerm: '',

        filteredData: [],
        filteredSelectedCodes: [],
        filteredSelectedNames: [],

        index: 0,
        routes: [
            { key: 'allMods', title: 'All Modules' },
            { key: 'myMods', title: 'My Modules' },
        ],

        selectedCodes: this.props.route.params.moduleCodes,
        selectedNames: this.props.route.params.moduleNames,

        // Control
        moduleLimitPopupShown: false,
        exitConfirmationPopupVisible: false,
        allLoaded: false,
        myLoaded: false,
        changes: false,
    };
    year = '2019-2020';
    allData = [];
    limit = 50;

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={this.onConfirm}
                    title={'Save'}
                    type={'clear'}
                    titleStyle={{ color: Colors.appWhite, fontFamily: MAIN_FONT, fontSize: 18 }}
                    containerStyle={{ marginRight: 5, borderRadius: 20 }}
                />
            ),
            //TODO:
            headerLeft: () => (
                <Button
                    containerStyle={{ borderRadius: 26 }}
                    titleStyle={{ color: Colors.appWhite }}
                    buttonStyle={{ padding: 0, height: 26, width: 26 }}
                    icon={{
                        type: 'ionicon',
                        name: 'ios-arrow-back',
                        size: 26,
                        color: Colors.appWhite,
                    }}
                    onPress={
                        this.state.changes
                            ? this.toggleExitConfirmationPopup
                            : this.props.navigation.goBack
                    }
                    type={'clear'}
                />
            ),
        });
        this.fetchData();
    }

    onConfirm = () => {
        this.props.route.params.setModules(this.state.selectedCodes, this.state.selectedNames);
        this.props.navigation.goBack();
    };

    fetchData = () => {
        const url = `https://api.nusmods.com/v2/${this.year}/moduleList.json`;
        this.setState({ isLoading: true });
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                const newData = responseJson.filter((data) => {
                    return !this.state.selectedCodes.includes(data.moduleCode);
                });
                this.setState({
                    filteredData: newData,
                    isLoading: false,
                });
                this.allData = responseJson;
            })
            .catch((error) => {
                console.log('Fetching from nusmods failed', error);
            });
    };

    setSearchTerm = (text) => {
        this.setState(
            {
                searchTerm: text,
                allLoaded: false,
                myLoaded: false,
            },
            () => this.search()
        );
    };
    setIndex = (index) => {
        this.setState(
            {
                index: index,
            },
            () => this.search()
        );
    };

    search = () => {
        const searchTerm = this.state.searchTerm;
        const key = this.state.routes[this.state.index].key;
        if (key === 'allMods') {
            return this.filterAllMods(searchTerm);
        } else if (key === 'myMods') {
            return this.filterSelected(searchTerm);
        }
    };

    filterAllMods = (searchTerm) => {
        if (this.state.allLoaded) {
            return;
        }
        const newData = this.allData.filter((data) => {
            const moduleCode = data.moduleCode;
            const moduleName = data.title.toUpperCase();

            const searchData = searchTerm.toUpperCase();

            return (
                !this.state.selectedCodes.includes(moduleCode) &&
                (moduleCode.indexOf(searchData) > -1 || moduleName.indexOf(searchData) > -1)
            );
        });
        this.setState({
            filteredData: newData,
            allLoaded: true,
        });
    };

    filterSelected = (searchTerm) => {
        if (this.state.myLoaded) {
            return;
        }
        if (!searchTerm) {
            this.setState({
                filteredSelectedCodes: this.state.selectedCodes,
                filteredSelectedNames: this.state.selectedNames,
            });
            return;
        }
        const filteredCode = [];
        const filteredName = [];
        this.state.selectedCodes.forEach((value, index) => {
            const moduleCode = value;
            const moduleName = this.state.selectedNames[index];

            const standardName = moduleName.toUpperCase();
            const searchData = searchTerm.toUpperCase();

            if (moduleCode.indexOf(searchData) > -1 || standardName.indexOf(searchData) > -1) {
                filteredCode.push(moduleCode);
                filteredName.push(moduleName);
            }
        });
        this.setState({
            filteredSelectedCodes: filteredCode,
            filteredSelectedNames: filteredName,
            myLoaded: false,
        });
    };

    toggleModuleLimitPopup = () => {
        this.setState({
            moduleLimitPopupShown: !this.state.moduleLimitPopupShown,
        });
    };
    renderModuleLimitPopup = () => {
        return (
            <Popup
                imageType={'Failure'}
                isVisible={this.state.moduleLimitPopupShown}
                title={'Limit reached'}
                body={'Max number of modules selected. Please unselect some modules'}
                buttonText={'Close'}
                callback={this.toggleModuleLimitPopup}
            />
        );
    };

    toggleExitConfirmationPopup = () => {
        this.setState({
            exitConfirmationPopupVisible: !this.state.exitConfirmationPopupVisible,
        });
    };
    renderExitConfirmationPopup = () => {
        return (
            <Popup
                imageType={'Warning'}
                isVisible={this.state.exitConfirmationPopupVisible}
                title={'Unsaved Changes'}
                body={'Do you want to save your changes?'}
                additionalButtonText={'Yes'}
                additionalButtonCall={() => {
                    this.toggleExitConfirmationPopup();
                    this.onConfirm();
                }}
                buttonText={'No'}
                callback={() => {
                    this.toggleExitConfirmationPopup();
                    this.props.navigation.goBack();
                }}
                defaultCallback={this.toggleExitConfirmationPopup}
            />
        );
    };

    unselect = (moduleCode) => {
        const { selectedCodes, selectedNames } = this.state;
        const index = selectedCodes.findIndex((x) => x === moduleCode);
        this.setState(
            {
                selectedCodes: [
                    ...selectedCodes.slice(0, index),
                    ...selectedCodes.slice(index + 1),
                ],
                selectedNames: [
                    ...selectedNames.slice(0, index),
                    ...selectedNames.slice(index + 1),
                ],
                changes: true,
            },
            () => this.search()
        );
    };

    select = (moduleCode, moduleName) => {
        const { selectedCodes, selectedNames, filteredData } = this.state;

        if (selectedCodes.length >= this.limit) {
            this.toggleModuleLimitPopup();
        } else {
            this.setState(
                {
                    selectedCodes: [...selectedCodes, moduleCode],
                    selectedNames: [...selectedNames, moduleName],
                    filteredData: filteredData.filter((m) => m.moduleCode !== moduleCode),
                    changes: true,
                },
                () => this.search()
            );
        }
    };

    renderScene = ({ route }) => {
        switch (route.key) {
            case 'allMods':
                return (
                    <AllModules
                        select={this.select}
                        filteredData={this.state.filteredData}
                        searchTerm={this.state.searchTerm}
                    />
                );
            case 'myMods':
                return (
                    <MyModules
                        filteredSelectedCodes={this.state.filteredSelectedCodes}
                        filteredSelectedNames={this.state.filteredSelectedNames}
                        unselect={this.unselect}
                        searchTerm={this.state.searchTerm}
                    />
                );
        }
    };

    render() {
        const { searchTerm, index, routes } = this.state;
        return (
            <View style={styles.container}>
                {this.renderModuleLimitPopup()}
                {this.renderExitConfirmationPopup()}
                <SearchBar
                    value={searchTerm}
                    onChangeText={this.setSearchTerm}
                    onCancel={() => this.setSearchTerm('')}
                    style={{ marginTop: 15, marginBottom: 5 }}
                    autoCapitalize={'words'}
                />
                <TabView
                    renderScene={this.renderScene}
                    onIndexChange={this.setIndex}
                    navigationState={{ index, routes }}
                    lazy={true}
                    swipeEnabled={true}
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
                                fontSize: 15,
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
    loading: {
        flex: 1,
        alignItems: 'center',
    },
    separator: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.appGray4,
    },
    titleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 14,
    },
    subtitleStyle: {
        fontFamily: MAIN_FONT,
        fontSize: 13,
    },
    searchBarContainer: {
        flexDirection: 'column',
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
        // borderRadius: 3,
        overflow: 'hidden',
        height: 40,
        backgroundColor: Colors.appGray2,
    },
    leftIconContainerStyle: {
        marginLeft: 8,
    },
});

export default ModuleEdit;
