import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

function AppLogo({ style }) {
    return <Image source={require('../assets/images/logo.png')} style={[styles.image, style]} />;
}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain',
    },
});

export default AppLogo;
