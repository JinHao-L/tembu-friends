import React, {Component} from 'react';
import {TextInput, View, SafeAreaView, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { onSignIn } from "../auth";
import {Colors} from "../constants";

export default class Login extends Component {
    state = {
        username: '',
        password: '',
    };

    handleUsername = (text) => {
        this.setState({username: text})
    }

    handlePassword = (text) => {
        this.setState({password: text})
    }

    login = (user, pass) => {
        // return (this.user !== '' || this.pw !== '')
        alert('username: ' + user + 'password: ' + pass)
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style = {styles.box}>
                    <TextInput
                        style = {styles.input}
                        placeholder = "Username"
                        placeholderTextColor = "#9a73ef"
                        underlineColorAndroid = "transparent"
                        autoCapitalize = "none"
                        onChangeText = {this.handleUsername}
                        value = {this.state.username}
                    />

                    <TextInput
                        style = {styles.input}
                        placeholder = "Password"
                        placeholderTextColor = "#9a73ef"
                        underlineColorAndroid = "transparent"
                        autoCapitalize = "none"
                        onChangeText = {this.handlePassword}
                        maxLength = {15}
                        secureTextEntry = {true}
                        value = {this.state.password}
                    />

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('root')}
                        style={styles.submitButton}>

                        <Text style = {styles.submitButtonText}> Login </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    box: {
        flex: 0.3,
        justifyContent: 'center',
        borderWidth: 5,
        backgroundColor: Colors.box,
        borderRadius: 20,
    },
    submitButton: {
        backgroundColor: Colors.button,
        padding: 10,
        margin: 15,
        height: 40,
    },
    submitButtonText: {
        color: Colors.noticeText,
        textAlign: 'center'
    },
    input: {
        borderColor: Colors.border,
        borderWidth: 1,
        // backgroundColor: Colors.WHITE,
        margin: 15,
        height: 40,
    }
})