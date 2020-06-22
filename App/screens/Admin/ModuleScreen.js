import React, { Component } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, View } from 'react-native';
import { ListItem, Button } from 'react-native-elements';

import { Colors } from '../../constants';
import { MAIN_FONT } from '../../components';
import { withFirebase } from '../../config/Firebase';

class ModuleScreen extends Component {
    state = {
        isLoading: true,
        year: '2018-2019',
        data: [],
    };

    componentDidMount() {
        const url = `https://api.nusmods.com/v2/${this.state.year}/moduleList.json`;
        this.setState({ isLoading: true });
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('Fetched');
                this.setState({
                    data: responseJson,
                    isLoading: false,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    upload = () => {
        // refine data
        const refined = this.state.data.map(({ semesters, ...rest }) => rest);

        this.props.firebase
            .updateModulesInfo({ mods: refined })
            .then(() => this.props.navigation.goBack())
            .catch((error) => console.log(error));
    };

    renderSeparator = () => {
        return <View style={{ height: 1, backgroundColor: Colors.appDarkGray }} />;
    };

    renderItem = (item) => {
        return (
            <ListItem
                title={item.moduleCode}
                titleStyle={{ fontFamily: MAIN_FONT }}
                subtitle={item.title}
                subtitleStyle={{ fontFamily: MAIN_FONT }}
            />
        );
    };

    renderHeader = () => {
        return (
            <View>
                <Button title={'Upload'} disabled={true} />
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
        const { year, data, isLoading } = this.state;

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

export default withFirebase(ModuleScreen);
