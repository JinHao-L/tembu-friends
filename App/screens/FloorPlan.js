import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Colors} from "../constants/index";

export default function LayoutScreen() {
    return(
        <Text style = {[styles.container]}>
            {this.state.msg}
        </Text>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
})