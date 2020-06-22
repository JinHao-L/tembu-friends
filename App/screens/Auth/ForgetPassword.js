import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';

import { withFirebase } from '../../config/Firebase';
import { Colors, NUSEmailSignature } from '../../constants';
import { AuthButton, FormInput, ErrorMessage, MainText, Popup } from '../../components';

class ForgetPassword extends Component {
    state = {
        // Details
        nusEmail: '',

        // Control - errors
        emailError: '',
        generalError: '',

        // Control - others
        isLoading: false,
        keyboardShown: false,
        keyboardHeight: 0,
        resetSuccessPopup: false,
    };

    clearInputs() {
        this.setState({
            nusEmail: '',
            emailError: '',
            generalError: '',
        });
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow.bind(this)
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide.bind(this)
        );
    }

    _keyboardDidShow(event) {
        console.log('Keyboard Shown');
        this.setState({
            keyboardShown: true,
            keyboardHeight: event.endCoordinates.height,
        });
    }

    _keyboardDidHide() {
        console.log('Keyboard Hidden');
        this.setState({
            keyboardShown: false,
        });
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    onResetSuccess() {
        this.toggleResetSuccessPopup();
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
        this.clearInputs.bind(this)();
        this.props.navigation.navigate('SignIn');
    }

    handleEmail(text) {
        this.setState({ nusEmail: text });
    }

    clearError() {
        this.setState({
            emailError: '',
        });
    }

    async resetPassword() {
        const { nusEmail } = this.state;
        this.setState({ isLoading: true });
        try {
            await this.props.firebase.sendPasswordReset(nusEmail);
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

    renderResetSuccessPopup = () => {
        return (
            <Popup
                imageType={'Success'}
                isVisible={this.state.resetSuccessPopup}
                title={'Email link sent'}
                body={
                    'We sent an email to\n' +
                    this.state.nusEmail +
                    '\nwith a link to get back into your account.'
                }
                buttonText={'OK'}
                callback={() => {
                    this.toggleResetSuccessPopup();
                    this.setState({
                        nusEmail: '',
                    });
                }}
            />
        );
    };

    toggleResetSuccessPopup = () => {
        this.setState({
            resetSuccessPopup: !this.state.resetSuccessPopup,
        });
    };

    render() {
        const { nusEmail, emailError, generalError, isLoading, keyboardShown } = this.state;

        return (
            <View
                style={[
                    styles.container,
                    {
                        paddingBottom:
                            Platform.OS === 'ios' && keyboardShown
                                ? this.state.keyboardHeight
                                : null,
                    },
                ]}
            >
                {this.renderResetSuccessPopup()}
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
                            <FormInput
                                containerStyle={styles.box}
                                isError={emailError}
                                errorMessage={emailError}
                                leftIconName="ios-mail"
                                placeholder="NUS email address"
                                returnKeyType="done"
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                autoCapitalize="none"
                                value={nusEmail}
                                onChangeText={this.handleEmail.bind(this)}
                                onFocus={this.clearError.bind(this)}
                            />
                            <View>
                                <AuthButton
                                    onPress={this.validateInput.bind(this)}
                                    style={styles.button}
                                    loading={isLoading}
                                >
                                    Next
                                </AuthButton>
                                <ErrorMessage
                                    error={generalError}
                                    style={{ textAlign: 'center' }}
                                />
                            </View>
                        </View>

                        {keyboardShown ? null : (
                            <View style={styles.bottom}>
                                <MainText
                                    style={styles.backLoginText}
                                    onPress={this.goToSignIn.bind(this)}
                                >
                                    Back to Login
                                </MainText>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
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
        backgroundColor: Colors.appWhite,
    },
    title: {
        fontSize: 25,
        color: Colors.appGreen,
        textAlign: 'center',
        marginBottom: 10,
    },
    textContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginHorizontal: 5,
    },
    intro: {
        fontSize: 15,
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    form: {
        flex: 2,
        justifyContent: 'flex-start',
        marginTop: 30,
        marginHorizontal: 40,
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36,
        alignItems: 'center',
    },
    box: {
        marginTop: 10,
    },
    button: {
        marginTop: 10,
    },
    backLoginText: {
        position: 'absolute',
        bottom: 0,
        fontWeight: '200',
        fontSize: 15,
        textAlign: 'center',
        color: Colors.appGreen,
        marginBottom: 20,
    },
});

export default withFirebase(ForgetPassword);
