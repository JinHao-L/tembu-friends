import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../../constants';
import AppLogo from '../../components/AppLogo';

function LoadingScreen(loading) {
    const { isUserLoading, isAssetsLoading } = loading;

    return (
        <View style={styles.container}>
            <AppLogo style={styles.logo} />
            <View style={styles.text}>
                <ActivityIndicator size="small" />
                <Text>Fetching resources...{isAssetsLoading ? '' : ' Done'}</Text>
                <Text>Fetching user data...{isUserLoading ? '' : ' Done'}</Text>
                {isUserLoading && isAssetsLoading && <Text>Signing you in</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    text: {
        bottom: 5,
    },
});

export default LoadingScreen;
