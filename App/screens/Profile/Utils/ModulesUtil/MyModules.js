import { FlatList, StyleSheet, View } from 'react-native';
import React, { Component } from 'react';
import Colors from '../../../../constants/Colors';
import { ListItem } from 'react-native-elements';
import { MAIN_FONT, MainText } from '../../../../components';

class MyModules extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.filteredSelectedCodes !== nextProps.filteredSelectedCodes;
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
                <View style={styles.emptyContainer}>
                    <MainText style={styles.emptyText}>No saved modules</MainText>
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
                    checked: true,
                    onPress: () => this.props.unselect(moduleCode, moduleName),
                }}
            />
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.props.filteredSelectedCodes}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item, index }) =>
                        this.renderItem(item, this.props.filteredSelectedNames[index])
                    }
                    keyExtractor={(item) => item}
                    ListEmptyComponent={this.renderEmpty}
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

export default MyModules;
