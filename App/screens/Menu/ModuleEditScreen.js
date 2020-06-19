import React, { Component } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Button, ButtonGroup, Input, ListItem, SearchBar } from 'react-native-elements';
import Colors from '../../constants/Colors';
import { MainText, MAIN_FONT } from '../../components';
import { Picker } from '@react-native-community/picker';

class ModuleEditScreen extends Component {
    state = {
        isLoading: true,
        year: '2019-2020',
        searchTerm: '',

        allData: [],
        filteredData: [],

        selected: this.props.route.params.modules,

        selectedIndex: 0,
    };

    componentDidMount() {
        console.log(this.props.route.params.modules);
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={this.onConfirm}
                    title={'Save'}
                    type={'clear'}
                    titleStyle={{ color: Colors.appWhite }}
                    containerStyle={{ marginRight: 5, borderRadius: 20 }}
                />
            ),
        });

        this.fetchData();
    }

    onConfirm = () => {
        this.props.route.params.setModules(this.state.selected);
        this.props.navigation.goBack();
    };

    fetchData = () => {
        const url = `https://api.nusmods.com/v2/${this.state.year}/moduleList.json`;
        this.setState({ isLoading: true });
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                const refinedData = responseJson.map(({ semesters, ...rest }) => rest);
                console.log('Fetched');
                const newData = refinedData.filter((data) => {
                    return !this.state.selected.some((s) => s.moduleCode === data.moduleCode);
                });
                this.setState({
                    allData: refinedData,
                    filteredData: newData,
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    searchFilter = (searchTerm) => {
        this.setState({ searchTerm: searchTerm });

        const newData = this.state.allData.filter((data) => {
            const moduleCode = data.moduleCode;
            const moduleName = data.title.toUpperCase();

            const searchData = searchTerm.toUpperCase();

            return (
                !this.state.selected.some((s) => s.moduleCode === moduleCode) &&
                (moduleCode.indexOf(searchData) > -1 || moduleName.indexOf(searchData) > -1)
            );
        });
        this.setState({
            filteredData: newData,
        });
    };

    select = (item) => {
        const { selected, filteredData } = this.state;

        if (!selected.some((s) => s.moduleCode === item.moduleCode)) {
            this.setState({
                selected: [...selected, item],
                filteredData: filteredData.filter((m) => m.moduleCode !== item.moduleCode),
            });
        } else {
            this.setState({
                selected: selected.filter((m) => m.moduleCode !== item.moduleCode),
                filteredData: [...filteredData, item],
            });
        }
    };

    updateIndex = (selectedIndex) => {
        this.setState({ selectedIndex });
    };
    renderItem = (item) => {
        const includes = this.state.selected.some((s) => s.moduleCode === item.moduleCode);

        return (
            <ListItem
                title={item.moduleCode}
                titleStyle={styles.titleStyle}
                subtitle={item.title}
                subtitleStyle={styles.subtitleStyle}
                checkBox={{
                    iconType: 'material',
                    checkedIcon: 'remove',
                    uncheckedIcon: 'add',
                    checkedColor: Colors.appRed,
                    uncheckedColor: Colors.appDarkGray,
                    checked: includes,
                    onPress: () => this.select(item),
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
                            containerStyle={styles.inputContainer}
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
                    // </View>
                )}
            </View>
        );
    };

    render() {
        const { filteredData, selected, selectedIndex, isLoading } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                {isLoading ? (
                    <View style={styles.loading}>
                        <ActivityIndicator size={'large'} />
                    </View>
                ) : selectedIndex === 0 ? (
                    <FlatList
                        data={filteredData}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderItem={({ item }) => this.renderItem(item)}
                        ListHeaderComponent={this.renderHeader}
                        keyExtractor={(item) => item.moduleCode}
                    />
                ) : (
                    <FlatList
                        data={selected}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderItem={({ item }) => this.renderItem(item)}
                        keyExtractor={(item) => item.moduleCode}
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
        // borderTopWidth: 1,
        // borderBottomWidth: 1,
        // borderTopColor: '#e1e1e1',
        // borderBottomColor: '#e1e1e1',
        // backgroundColor: Colors.appWhite,
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
        minHeight: 30,
        backgroundColor: Colors.appGray,
    },
    leftIconContainerStyle: {
        marginLeft: 8,
    },
});

export default ModuleEditScreen;
