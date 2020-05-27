import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';

import { withFirebase } from '../../config/Firebase';
import { Colors, NUSEmailSignature } from '../../constants';
import { AuthButton, FormInput, ErrorMessage, MainText, textStyles } from '../../components';

class ForgetPassword extends Component {
    state = {
        // Details
        nusEmail: '',

        // Control - errors
        emailError: '',
        generalError: '',

        // Control - others
        isLoading: false,
        isSuccess: false,
    };

    onResetSuccess() {
        this.setState({
            nusEmail: '',
            isSuccess: true,
        });
        //TODO: Pop-up here
        // this.props.navigation.navigate('SignIn');
    }

    onResetFailure(error) {
        let errorCode = error.code;
        let errorMessage = error.message;

        if (errorCode === 'auth/user-not-found') {
            // Indicates the user account was not found.
            this.setState({
                emailError: 'Unregistered email address',
            });
        } else if (errorCode === 'auth/invalid-email') {
            // 17008: Indicates the email is invalid.
            this.setState({
                emailError: 'Invalid email address',
            });
        } else if (errorCode === 'auth/network-request-failed') {
            // Indicates network error
            this.setState({ generalError: 'Network error' });
        } else {
            // Others
            this.setState({ generalError: 'Unknown error' });
            console.warn('Unknown error: ' + errorCode + ' ' + errorMessage);
        }
    }

    goToSignIn() {
        this.props.navigation.navigate('SignIn');
    }

    handleEmail(text) {
        this.setState({ nusEmail: text, emailError: '' });
    }

    async resetPassword() {
        const { nusEmail } = this.state;
        this.setState({ isLoading: true });
        try {
            await this.props.firebase.passwordReset(nusEmail);
            console.log('Password reset email sent successfully');
            this.onResetSuccess.bind(this)();
        } catch (error) {
            this.onResetFailure.bind(this)(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    validateInput() {
        if (!String(this.state.nusEmail).includes(NUSEmailSignature)) {
            this.setState({ emailError: 'Invalid email domain' });
            return null;
        }
        return this.resetPassword.bind(this)();
    }

    render() {
        const { nusEmail, emailError, generalError, isLoading, isSuccess } = this.state;

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : -150}
                contentContainerStyle={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        <View style={styles.textContainer}>
                            <MainText style={styles.title}>Trouble with logging in?</MainText>
                            <MainText style={styles.intro}>
                                Enter your email address and we'll send you a link to reset your
                                password
                            </MainText>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.box}>
                                <FormInput
                                    style={emailError ? styles.errorInput : styles.validInput}
                                    leftIconName="ios-mail"
                                    placeholder="NUS email address"
                                    returnKeyType="done"
                                    keyboardType="email-address"
                                    textContentType="emailAddress"
                                    autoCapitalize="none"
                                    value={nusEmail}
                                    onChangeText={this.handleEmail.bind(this)}
                                />
                                <ErrorMessage error={emailError ? emailError : ' '} />
                            </View>
                            <View>
                                <AuthButton
                                    onPress={this.validateInput.bind(this)}
                                    style={[styles.button, { position: 'relative', top: 10 }]}
                                    loading={isLoading}
                                >
                                    Next
                                </AuthButton>
                                <ErrorMessage error={generalError} />
                                <MainText style={styles.successMessage}>
                                    {isSuccess ? 'Reset mail successfully sent' : null}
                                </MainText>
                            </View>
                        </View>

                        <View style={styles.bottom}>
                            <MainText
                                style={styles.backLoginText}
                                onPress={this.goToSignIn.bind(this)}
                            >
                                Back to Login
                            </MainText>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.authBackground,
    },
    title: {
        fontSize: 30,
        // fontWeight: '700',
        color: Colors.greenText,
        marginBottom: 10,
        textAlign: 'center',
    },
    textContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    intro: {
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    form: {
        flex: 2,
        justifyContent: 'flex-start',
        marginTop: 30,
        marginHorizontal: 30,
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36,
        alignItems: 'center',
    },
    validInput: {
        borderColor: Colors.defaultBorder,
    },
    errorInput: {
        borderColor: Colors.errorBorder,
    },
    box: {
        marginTop: 10,
    },
    button: {
        marginTop: 10,
    },
    successMessage: {
        color: Colors.successText,
        textAlign: 'center',
        fontSize: 16,
    },
    backLoginText: {
        position: 'absolute',
        bottom: 0,
        fontWeight: '200',
        fontSize: 15,
        textAlign: 'center',
        color: Colors.greenText,
        marginBottom: 20,
    },
});

export default withFirebase(ForgetPassword);
