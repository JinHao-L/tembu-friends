import React, { Component } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { ListItem, Button } from 'react-native-elements';

import { Colors } from '../../constants';
import { MAIN_FONT, MainText } from '../../components';
import { withFirebase } from '../../helper/Firebase';

class ReportsControl extends Component {
    state = {
        isLoading: false,
        data: [],
    };

    renderSeparator = () => {
        return <View style={{ height: 1, backgroundColor: Colors.appDarkGray }} />;
    };

    renderHeader = () => {
        return (
            <View style={{ alignSelf: 'center' }}>
                <MainText>Not implemented yet</MainText>
            </View>
        );
    };

    renderFooter = () => {
        if (this.state.isLoading) {
            return <ActivityIndicator />;
        } else {
            return null;
        }
    };

    render() {
        const { data } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={data}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item }) => this.renderItem(item)}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    keyExtractor={(item) => item.moduleCode}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
        // backgroundColor: Colors.appWhite,
    },
});

export default withFirebase(ReportsControl);
