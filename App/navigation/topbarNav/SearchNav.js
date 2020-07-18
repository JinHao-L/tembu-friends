import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import { Colors } from '../../constants';
import { MAIN_FONT, MainText } from '../../components';
import { ByRoom, ByRole, ByModule, ByName } from '../../screens/Explore';
import { Input } from 'react-native-elements';
import Layout from '../../constants/Layout';

class SearchNav extends Component {
    state = {
        value: '',

        index: 0,
        routes: [
            { key: 'name', title: 'Name' },
            { key: 'role', title: 'Role' },
            { key: 'room', title: 'Room' },
            { key: 'module', title: 'Module' },
        ],
    };
    searchValue = '';
    setValue = (text) => {
        this.setState({
            value: text,
        });
    };
    setSearchValue = (text) => {
        this.searchValue = text;
    };
    setIndex = (index) => {
        this.setState({
            index: index,
        });
    };

    renderScene = ({ route, jumpTo }) => {
        console.log(route);
        switch (route.key) {
            case 'name':
                return <ByName navigation={this.props.navigation} searchValue={this.searchValue} />;
            case 'role':
                return <ByName navigation={this.props.navigation} searchValue={this.searchValue} />;
            case 'room':
                return <ByName navigation={this.props.navigation} searchValue={this.searchValue} />;
            case 'module':
                return <ByName navigation={this.props.navigation} searchValue={this.searchValue} />;
        }
    };

    render() {
        const { value, index, routes } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Input
                    containerStyle={styles.inputContainer}
                    placeholder={'Search'}
                    autoCapitalize={'none'}
                    value={value}
                    onChangeText={this.setValue}
                    onEndEditing={({ nativeEvent: { text } }) => this.setSearchValue(text)}
                    placeholderTextColor={Colors.appGray4}
                    inputStyle={styles.searchBarInput}
                    inputContainerStyle={styles.inputContentContainer}
                    leftIcon={{
                        size: 18,
                        name: 'search',
                        color: Colors.appGray4,
                    }}
                    leftIconContainerStyle={styles.leftIconContainerStyle}
                    rightIcon={
                        value
                            ? {
                                  size: 18,
                                  name: 'cancel',
                                  color: Colors.appGray4,
                                  onPress: () => this.setValue(''),
                              }
                            : undefined
                    }
                    rightIconContainerStyle={styles.rightIconContainerStyle}
                    renderErrorMessage={false}
                />
                <TabView
                    renderScene={this.renderScene}
                    onIndexChange={this.setIndex}
                    navigationState={{ index, routes }}
                    lazy={true}
                    initialLayout={{ width: Layout.window.width }}
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            style={{ backgroundColor: Colors.appWhite, elevation: 2 }}
                            tabStyle={{ height: 40, alignItems: 'center' }}
                            getLabelText={({ route }) => route.title}
                            labelStyle={{
                                color: Colors.appBlack,
                                fontFamily: MAIN_FONT,
                                fontSize: 12,
                            }}
                            indicatorStyle={{ backgroundColor: Colors.appGreen }}
                        />
                    )}
                    style={{ padding: 0, margin: 0 }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    searchBarInput: {
        marginLeft: 10,
        fontFamily: MAIN_FONT,
        fontSize: 13,
        fontWeight: '100',
    },
    inputContainer: {
        paddingTop: 20,
        backgroundColor: Colors.appWhite,
    },
    inputContentContainer: {
        height: 30,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.appGray4,
        backgroundColor: Colors.appWhite,
    },
    leftIconContainerStyle: {
        paddingLeft: 8,
    },
    rightIconContainerStyle: {
        marginRight: 8,
    },
});

export default SearchNav;
