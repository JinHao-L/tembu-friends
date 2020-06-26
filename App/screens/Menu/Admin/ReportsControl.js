import React, { Component } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, View } from 'react-native';
import { ListItem, Button } from 'react-native-elements';

import { Colors } from '../../../constants';
import { MAIN_FONT, MainText } from '../../../components';
import { withFirebase } from '../../../config/Firebase';

class ReportsControl extends Component {
    state = {
        isLoading: true,
        data: [],
    };

    renderSeparator = () => {
        return <View style={{ height: 1, backgroundColor: Colors.appDarkGray }} />;
    };

    renderHeader = () => {
        return (
            <View>
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
            <SafeAreaView style={{ flex: 1 }}>
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

export default withFirebase(ReportsControl);
