import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { withFirebase } from '../../helper/Firebase';
import { Colors } from '../../constants';
import { AuthButton, FormInput, MainText, ErrorMessage } from '../../components';

const mapStateToProps = (state) => {
    return { friendSubscriber: state.friendSubscriber };
};

class SignUpScreen extends Component {
    state = {
        // Details
        nusEmail: '',
        password: '',
        confirmation: '',

        // Control - errors
        emailError: '',
        passwordError: '',
        confirmationError: '',
        generalError: '',

        // Control - others
        isLoading: false,
        passwordIcon: 'ios-eye',
        passwordHidden: true,
        keyboardShown: false,
    };

    clearEmailError() {
        this.setState({
            emailError: '',
        });
    }
    clearPasswordError() {
        this.setState({
            passwordError: '',
        });
    }
    clearConfirmationError() {
        this.setState({
            confirmationError: '',
        });
    }

    clearInputs() {
        this.setState({
            nusEmail: '',
            password: '',
            confirmation: '',
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
        this.setState({
            keyboardShown: true,
            keyboardHeight: event.endCoordinates.height,
        });
    }

    _keyboardDidHide() {
        this.setState({
            keyboardShown: false,
        });
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    onDeleteSuccess() {
        this.clearInputs.bind(this)();
    }

    onDeleteFailure(error) {
        let errorCode = error.code;
        let errorMessage = error.message;

        switch (errorCode) {
            case 'auth/user-mismatch': // Indicates the email is invalid.
                this.setState({ generalError: 'Wrong User' });
                break;
            case 'auth/invalid-email': // Indicates the email is invalid.
                this.setState({ emailError: 'Invalid email address' });
                break;
            case 'auth/user-not-found': // Indicates the email is invalid.
                this.setState({ emailError: 'Invalid email address' });
                break;
            case 'auth/wrong-password': // Indicates the email is invalid.
                this.setState({ passwordError: 'Invalid password' });
                break;
            default:
                // Others
                this.setState({ generalError: 'Unknown error' });
                console.warn('Unknown error: ' + errorCode + ' ' + errorMessage);
                break;
        }
    }

    handlePasswordVisibility() {
        this.setState((prevState) => ({
            passwordIcon: prevState.passwordIcon === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
            passwordHidden: !prevState.passwordHidden,
        }));
    }
    handleEmail(text) {
        this.setState({ nusEmail: text });
    }
    handlePassword(text) {
        this.setState({
            password: text,
        });
    }
    handleConfirmation(text) {
        this.setState({
            confirmation: text,
        });
    }

    async delete() {
        const { nusEmail, password } = this.state;
        this.setState({ isLoading: true });

        try {
            const user = await this.props.firebase.getCurrentUser();

            console.log('Get credential');
            const credential = await this.props.firebase.createCredential(nusEmail, password);

            console.log('Re-authenticating');
            await user.reauthenticateWithCredential(credential);

            console.log('Deleting');
            // await this.props.firebase.deleteUser(user.uid);
            await user.delete();

            console.log('Cleaning Up');
            this.props.friendSubscriber();
            this.onDeleteSuccess.bind(this)();

            console.log('Signing out');
            await this.props.firebase.signOut;
        } catch (error) {
            this.onDeleteFailure.bind(this)(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    validateInputAndDelete() {
        Keyboard.dismiss();
        const {
            password,
            nusEmail,
            confirmation,
            emailError,
            passwordError,
            confirmationError,
            isLoading,
        } = this.state;

        if (isLoading) return null;
        if (!(password && nusEmail && confirmation)) {
            this.setState({
                generalError: 'Empty field detected',
            });
            return null;
        }
        if (confirmation !== 'DELETE') {
            this.setState({
                confirmation: '',
                confirmationError: "Type 'DELETE' to confirm deletion",
            });
        }
        console.log('Valid Input');
        if (!(emailError || passwordError || confirmationError)) {
            return this.delete.bind(this)();
        }
    }

    render() {
        const {
            nusEmail,
            password,
            confirmation,
            emailError,
            passwordError,
            confirmationError,
            generalError,
            passwordHidden,
            passwordIcon,
            isLoading,
            keyboardShown,
        } = this.state;

        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                        <MainText style={styles.title} adjustsFontSizeToFit={true}>
                            Delete Account
                        </MainText>
                        <MainText style={{ fontSize: 15 }}>We are sorry to see you go</MainText>
                    </View>
                    <View style={styles.form}>
                        <FormInput
                            containerStyle={styles.box}
                            isError={emailError}
                            errorMessage={emailError}
                            placeholder="NUS email address"
                            keyboardType="email-address"
                            returnKeyType="next"
                            textContentType="emailAddress"
                            autoCapitalize="none"
                            value={nusEmail}
                            onChangeText={this.handleEmail.bind(this)}
                            onFocus={this.clearEmailError.bind(this)}
                        />

                        <FormInput
                            containerStyle={styles.box}
                            isError={passwordError}
                            errorMessage={passwordError}
                            placeholder="Password"
                            autoCapitalize="none"
                            returnKeyType="next"
                            textContentType="password"
                            onChangeText={this.handlePassword.bind(this)}
                            onFocus={this.clearPasswordError.bind(this)}
                            secureTextEntry={passwordHidden}
                            value={password}
                            rightIcon={
                                <Icon
                                    type={'ionicon'}
                                    name={passwordIcon}
                                    size={28}
                                    color={Colors.appGray2}
                                    containerStyle={{ marginRight: 5 }}
                                    onPress={this.handlePasswordVisibility.bind(this)}
                                />
                            }
                        />
                        <FormInput
                            containerStyle={styles.box}
                            isError={confirmationError}
                            errorMessage={confirmationError}
                            placeholder="To confirm type 'DELETE'"
                            autoCapitalize="none"
                            returnKeyType="done"
                            textContentType="none"
                            onChangeText={this.handleConfirmation.bind(this)}
                            onFocus={this.clearConfirmationError.bind(this)}
                            value={confirmation}
                        />
                        <View style={styles.box}>
                            <AuthButton
                                onPress={this.validateInputAndDelete.bind(this)}
                                style={styles.button}
                                loading={isLoading}
                            >
                                Delete My Account
                            </AuthButton>
                            <ErrorMessage
                                style={{ textAlign: 'center' }}
                                error={generalError ? generalError : ' '}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 35,
        color: Colors.appGreen,
        marginBottom: 10,
        textAlign: 'left',
    },
    titleContainer: {
        paddingHorizontal: 40,
    },
    form: {
        justifyContent: 'center',
        marginTop: 10,
        marginHorizontal: 40,
    },
    box: {
        marginTop: 5,
    },
    button: {
        color: Colors.appRed,
        marginTop: 10,
    },
});

export default connect(mapStateToProps)(withFirebase(SignUpScreen));