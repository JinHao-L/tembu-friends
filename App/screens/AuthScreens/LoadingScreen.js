import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../../constants';

function LoadingScreen({ navigation, route }) {
    const { isUserLoading, isAssetsLoading, isUserSignedIn } = route.params.children;

    navigation.setOptions({
        headerShown: false,
    });

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text>Fetching resources... {isAssetsLoading ? '' : 'Done'}</Text>
            <Text>Fetching user data... {isUserLoading ? '' : 'Done'}</Text>
            {/*<Text>{isUserSignedIn ? 'Signing you in...' : 'Bringing you to login page...'}</Text>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.authBackground,
    },
});

export default LoadingScreen;
