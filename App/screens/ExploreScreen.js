import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';

import { MainText } from '../components';
import { Colors, Layout } from '../constants/index';

function ExploreScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <MainText style={styles.title}>Explore</MainText>
            </View>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <MainText style={{ color: 'white' }}>Search Bar</MainText>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.floorPlan}>
                        <MainText style={{ color: 'white' }}>Floor Plan</MainText>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.appGreen,
        paddingBottom: 10,
        paddingTop: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.appGreen,
        width: Layout.window.width,
    },
    searchContainer: {
        flex: 1,
        width: Layout.window.width,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'left',
        color: Colors.appWhite,
        fontSize: 24,
        left: 30,
    },
    searchBar: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.appGray,
        marginBottom: 10,
        marginHorizontal: 20,
        borderRadius: 5,
        paddingHorizontal: 5,
    },
    content: {
        flex: 15,
        width: Layout.window.width,
        justifyContent: 'center',
    },
    floorPlan: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ExploreScreen;
