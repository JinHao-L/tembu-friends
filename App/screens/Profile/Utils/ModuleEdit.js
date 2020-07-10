import React, { Component } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Button, ButtonGroup, Input, ListItem } from 'react-native-elements';
import Colors from '../../../constants/Colors';
import { MAIN_FONT, Popup } from '../../../components';

class ModuleEdit extends Component {
    state = {
        isLoading: true,
        year: '2019-2020',
        searchTerm: '',

        filteredData: [],

        selectedCodes: this.props.route.params.moduleCodes,
        selectedNames: this.props.route.params.moduleNames,

        // Control
        selectedIndex: 0,
        moduleLimitPopupShown: false,
    };
    allData = [];
    limit = 50;

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={this.onConfirm}
                    title={'Save'}
                    type={'clear'}
                    titleStyle={{
                        color: Colors.appWhite,
                        fontFamily: MAIN_FONT,
                    }}
                    containerStyle={{ marginRight: 5, borderRadius: 20 }}
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
        const url = `https://api.nusmods.com/v2/${this.state.year}/moduleList.json`;
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

    searchFilter = (searchTerm) => {
        if (searchTerm === undefined) {
            searchTerm = this.state.searchTerm;
        } else {
            this.setState({ searchTerm: searchTerm });
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
        });
    };

    select = (moduleCode, moduleName) => {
        const { selectedCodes, selectedNames, filteredData } = this.state;

        if (!selectedCodes.includes(moduleCode)) {
            if (selectedCodes.length >= this.limit) {
                this.toggleModuleLimitPopup();
            } else {
                this.setState({
                    selectedCodes: [...selectedCodes, moduleCode],
                    selectedNames: [...selectedNames, moduleName],
                    filteredData: filteredData.filter((m) => m.moduleCode !== moduleCode),
                });
            }
        } else {
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
                },
                () => this.searchFilter()
            );
        }
    };

    updateIndex = (selectedIndex) => {
        this.setState({ selectedIndex });
    };

    renderItem = (moduleCode, moduleName, override) => {
        const found = override || this.state.selectedCodes.includes(moduleCode);

        return (
            <ListItem
                title={moduleCode}
                titleStyle={styles.titleStyle}
                subtitle={moduleName}
                subtitleStyle={styles.subtitleStyle}
                checkBox={{
                    iconType: 'material',
                    checkedIcon: 'remove',
                    uncheckedIcon: 'add',
                    checkedColor: Colors.appGreen,
                    uncheckedColor: Colors.appGreen,
                    checked: found,
                    onPress: () => this.select(moduleCode, moduleName),
                }}
            />
        );
    };
    renderHeader = () => {
        const { selectedIndex, searchTerm } = this.state;
        const buttons = ['All Modules', 'My Modules'];

        return (
            <View>
                <ButtonGroup
                    buttons={buttons}
                    selectedIndex={selectedIndex}
                    onPress={this.updateIndex}
                    textStyle={styles.titleStyle}
                    selectedButtonStyle={{ backgroundColor: Colors.appGreen }}
                />
                {selectedIndex === 0 && (
                    <View style={styles.searchBarContainer}>
                        <Input
                            style={{ flex: 1 }}
                            testID="searchInput"
                            value={searchTerm}
                            placeholder={'Type Here...'}
                            autoCorrect={true}
                            renderErrorMessage={false}
                            onChangeText={this.searchFilter}
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
                        />
                        {/*<Picker*/}
                        {/*    style={{ flex: 1, height: 30 }}*/}
                        {/*    itemStyle={{ fontSize: 15, fontFamily: MAIN_FONT }}*/}
                        {/*    // mode="dropdown"*/}
                        {/*    selectedValue={this.state.year}*/}
                        {/*    onValueChange={(val) => {*/}
                        {/*        this.setState({ year: val }, this.fetchData);*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <Picker.Item label={'AY 19/20'} value={'2019-2020'} />*/}
                        {/*    <Picker.Item label={'AY 18/19'} value={'2018-2019'} />*/}
                        {/*</Picker>*/}
                    </View>
                )}
            </View>
        );
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
    renderFooter = () => {
        if (this.state.isLoading) {
            return <ActivityIndicator color={Colors.appGreen} />;
        } else {
            return null;
        }
    };

    render() {
        const { filteredData, selectedCodes, selectedNames, selectedIndex } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                {this.renderModuleLimitPopup()}
                {selectedIndex === 0 ? (
                    <FlatList
                        data={filteredData}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderItem={({ item }) => this.renderItem(item.moduleCode, item.title)}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        keyExtractor={(item) => item.moduleCode}
                    />
                ) : (
                    <FlatList
                        data={selectedCodes}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderItem={({ item, index }) =>
                            this.renderItem(item, selectedNames[index], true)
                        }
                        keyExtractor={(item) => item}
                        ListHeaderComponent={this.renderHeader}
                        ListEmptyComponent={() => (
                            <ListItem
                                titleStyle={{ textAlign: 'center' }}
                                title={'No saved modules'}
                            />
                        )}
                    />
                )}
            </SafeAreaView>
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
        borderColor: Colors.appDarkGray,
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
        backgroundColor: Colors.appGray,
    },
    leftIconContainerStyle: {
        marginLeft: 8,
    },
});

export default ModuleEdit;
