import React, { Component } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';

import { Colors, MAIN_FONT } from 'constant';
import { MainText } from 'components';

class AllModules extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.filteredData !== nextProps.filteredData;
    }

    renderEmpty = () => {
        if (this.props.searchTerm) {
            return (
                <View style={styles.emptyContainer}>
                    <MainText style={styles.emptyText}>No modules found</MainText>
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={Colors.appGreen} />
                </View>
            );
        }
    };

    renderItem = (moduleCode, moduleName) => {
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
                    checked: false,
                    onPress: () => this.props.select(moduleCode, moduleName),
                }}
            />
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={{ minHeight: '100%' }}
                    data={this.props.filteredData}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => this.renderItem(item.moduleCode, item.title)}
                    ListEmptyComponent={this.renderEmpty}
                    keyExtractor={(item) => item.moduleCode}
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
    emptyContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default AllModules;
