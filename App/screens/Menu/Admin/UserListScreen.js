import React from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';

import { Colors } from '../../../constants';
import { withFirebase } from '../../../config/Firebase';
import { ListItem } from 'react-native-elements';
import { MainText } from '../../../components';

class UserListScreen extends React.Component {
    state = {
        isLoading: false,
        users: [],
    };

    // componentDidMount() {
    //     this.updateUserList();
    // }

    updateUserList = () => {
        this.props.firebase
            .firestore()
            .collection('users')
            .get()
            .then((querySnapshot) => {
                const results = [];
                querySnapshot.docs.map((documentSnapshot) =>
                    results.push(
                        documentSnapshot.data()
                        // id: documentSnapshot.id,
                    )
                );
                this.setState({ isLoading: false, users: results });
            })
            .catch((err) => console.error(err));
    };

    renderUser = ({ user }) => (
        <ListItem
            title={user.displayName}
            leftAvatar={{
                source: user.profilePicture && { uri: user.profilePicture },
                title: user.displayName[0],
            }}
            bottomDivider
            // rightElement={this.state.userVerified}
        />
    );

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
        const { users } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={users}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item }) => this.renderUser(item)}
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
    itemContainer: {
        paddingVertical: 10,
    },
});

export default withFirebase(UserListScreen);
