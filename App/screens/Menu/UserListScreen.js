import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';

import { Colors } from '../../constants';

// Admin feature -- not done
class UserListScreen extends React.Component {
    state = {
        isLoading: true,
        users: null,
    };

    // componentDidMount() {
    //     this.updateUserList();
    // }

    // updateUserList = () =>
    //     firebaseDb
    //         .firestore()
    //         .collection('users')
    //         .get()
    //         .then((querySnapshot) => {
    //             const results = [];
    //             querySnapshot.docs.map((documentSnapshot) =>
    //                 results.push(
    //                     documentSnapshot.data()
    //                     // id: documentSnapshot.id,
    //                 )
    //             );
    //             this.setState({ isLoading: false, users: results });
    //         })
    //         .catch((err) => console.error(err));

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
        backgroundColor: Colors.appGreen,
    },
    itemContainer: {
        paddingVertical: 10,
    },
});

export default UserListScreen;
