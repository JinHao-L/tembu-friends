import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';

import { Colors } from '../../constants';
import { withFirebase } from '../../config/Firebase';
import { ListItem } from 'react-native-elements';

// Admin feature -- not done
class UserListScreen extends React.Component {
    state = {
        isLoading: true,
        users: null,
    };

    componentDidMount() {
        this.updateUserList();
    }

    updateUserList = () =>
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

    render() {
        const { isLoading, users } = this.state;
        if (isLoading) return <ActivityIndicator size="large" color="#000ff" />;

        return (
            <FlatList
                data={users}
                renderItem={(item) => (
                    <View style={styles.itemContainer}>
                        <Text>{item.name}</Text>
                        <Text>{item.email}</Text>
                    </View>
                )}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: Colors.appLightGreen,
    },
    itemContainer: {
        paddingVertical: 10,
    },
});

export default withFirebase(UserListScreen);
