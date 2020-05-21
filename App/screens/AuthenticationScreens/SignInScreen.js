import React, { Component } from 'react';
import { TextInput, View, StyleSheet, Image, ActivityIndicator, Text } from 'react-native';
import 'firebase/firestore';
import firebase from 'firebase';

import { Colors } from '../../constants';
import { AuthButton } from '../../components';

class SignInScreen extends Component {
    state = {
        nusEmail: '',
        password: '',
        errorMessage: '',
        loading: false,
    };

    onLoginSuccess = () => {
        this.setState({
            nusEmail: '',
            password: '',
        });
        this.props.navigation.navigate('Root');
    };

    onLoginFailure(errorMessage) {
        this.setState({ error: errorMessage, loading: false });
    }

    onRegister() {
        this.props.navigation.navigate('SignUp');
    }

    renderLoading() {
        if (this.state.loading) {
            return (
                <View>
                    <ActivityIndicator size={'large'} />
                </View>
            );
        }
    }

    handleEmail(text) {
        this.setState({ nusEmail: text });
    }

    handlePassword(text) {
        this.setState({ password: text });
    }

    async signIn() {
        this.setState({ loading: true });
        await firebase
            .auth()
            .signInWithEmailAndPassword(this.state.nusEmail, this.state.password)
            .then(this.onLoginSuccess.bind(this))
            .catch((err) => {
                let errCode = err.code;
                let errMessage = err.message;
                if (errCode === 'auth/weak-password') {
                    this.onLoginFailure.bind(this)('Weak Password!');
                } else {
                    this.onLoginFailure.bind(this)(errMessage);
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../../assets/images/robot-prod.png')} style={styles.logo} />
                <Text style={styles.title}>Tembu Friends</Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="NUS Email"
                        placeholderTextColor="#b1b1b1"
                        underlineColorAndroid="transparent"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        value={this.state.nusEmail}
                        onChangeText={this.handleEmail.bind(this)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#b1b1b1"
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        returnKeyType="done"
                        textContentType="newPassword"
                        onChangeText={this.handlePassword.bind(this)}
                        secureTextEntry={true}
                        value={this.state.password}
                    />
                </View>
                {this.renderLoading()}
                <Text style={styles.error}>{this.state.error}</Text>
                <AuthButton
                    onPress={() => this.signIn()}
                    style={[styles.button, { position: 'relative', top: 10 }]}
                >
                    Sign In
                </AuthButton>
                <View style={{ marginTop: 10 }}>
                    <Text
                        style={{ fontWeight: '200', fontSize: 17, textAlign: 'center' }}
                        onPress={() => this.onRegister()}
                    >
                        Don't have an Account?
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    logo: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: 'green',
    },
    form: {
        width: '86%',
        marginTop: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        borderColor: Colors.border,
        borderWidth: 1,
        backgroundColor: '#fff',
        marginTop: 10,
        height: 30,
        width: 200,
    },
    error: {
        fontSize: 14,
        textAlign: 'center',
        color: 'red',
        width: '80%',
    },
    button: {
        margin: 5,
        width: 67,
    },
});

export default SignInScreen;
