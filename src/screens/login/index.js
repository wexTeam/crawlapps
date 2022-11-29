import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import OneSignal from "react-native-onesignal";
import { useDispatch, useSelector } from 'react-redux';
import DialogErrorView from "../../appcomponents/DialogErrorView";
import DialogView from "../../appcomponents/DialogView";
import HeaderView from "../../appcomponents/HeaderView";
import ButtonComponent from "../../components/ButtonComponent";
import TextComponent from "../../components/TextComponent";
import TextInputErrorComponent from "../../components/TextInputErrorComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import * as api from '../../request';
import { isEmailValid, isEmpty } from "../../validators/EmailValidator";
import SplashScreen from "../splash";
import { checkNotifications, requestNotifications, PERMISSIONS } from 'react-native-permissions';

const LoginScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const { translations } = useContext(LocalizationContext);

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const [progress, setProgressBar] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onLoadPage();
    }, []);

    useEffect(() => {
        if (isFocused) {
            if (Platform.OS == 'ios') {
                requestNotifications(['alert', 'sound']).then(({ status, settings }) => {
                });
            }
        }
    }, []);

    async function onLoadPage() {
        var token = await AsyncStorage.getItem('token');
        if (token != null) {
            navigation.dispatch(
                StackActions.replace('Calendar')
            );
            OneSignal.sendTag("user_id", response.data.id.toString());
        } else {
            setLoading(false);
        }
    }

    /**
     * Login click button handler
     */
    async function onLoginButtonClicked() {

        var isValid = true;
        if (isEmpty(email)) {
            isValid = false;
            setEmailError(translations.email_required);
        } else if (isEmailValid(email)) {
            isValid = false;
            setEmailError(translations.email_invalid);
        } else {
            setEmailError(null);
        }

        if (isEmpty(password)) {
            isValid = false;
            setPasswordError(translations.password_required);
        } else {
            setPasswordError(null);
        }
        if (isValid) {
            setProgressBar(true);
            var response = await api.login(email, password);
            setProgressBar(false);
            if (response == null) {
                setErrorText(translations.something_went_wrong);
            } else {
                if (response.success && response.data != null && !isEmpty(response.data.access_token)) {
                    AsyncStorage.setItem('user', response.data.toString());
                    AsyncStorage.setItem('token', response.data.access_token.toString());
                    AsyncStorage.setItem('refresh_token', response.data.access_token.toString());
                    OneSignal.sendTag("user_id", response.data.id.toString());
                    navigation.dispatch(
                        StackActions.replace('Calendar')
                    );
                } else {
                    setErrorText(response.message);
                }
            }
        }
    }

    return (
        loading ? <View style={[styles.backgroundStyle]} /> :
            // loading ? <SplashScreen /> :
            <View style={Style.flex1Style}>
                <HeaderView showLogout={false} />
                <View style={styles.loginContainer}>
                    <TextComponent
                        text={translations.login}
                        textStyle={[Style.boldTextStyle, Style.text32Style, styles.loginContainerStyle]} />

                    <TextComponent
                        text={translations.username}
                        textStyle={[Style.mediumTextStyle, Style.text12Style, styles.labelStyle]} />

                    <TextInputErrorComponent
                        errorText={emailError}
                        textStyle={[Style.mediumTextStyle, Style.text16Style, styles.usernameInputStyle]}
                        onChangeText={(text) => {
                            setEmail(text);
                        }}
                    />

                    <TextComponent
                        text={translations.password}
                        textStyle={[Style.mediumTextStyle, Style.text12Style, styles.labelStyle]} />

                    <TextInputErrorComponent
                        errorText={passwordError}
                        textStyle={[Style.mediumTextStyle, Style.text16Style, styles.usernameInputStyle]}
                        secureText={true}
                        onChangeText={(text) => {
                            setPassword(text);
                        }}
                    />

                    <ButtonComponent text={translations.login_}
                        textStyle={[Style.boldTextStyle, Style.text12Style,]}
                        buttonStyle={styles.loginButtonStyle}
                        onPress={onLoginButtonClicked} />

                </View>
                <DialogView visible={progress} />
                <DialogErrorView
                    visible={errorText != null}
                    okButtonText={translations.ok}
                    toggleOverlay={() => {
                        setErrorText(null);
                    }} errorText={errorText} />
            </View>
    );
}
const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        backgroundColor: colors.white,
    },
    body: {
        backgroundColor: colors.white,
    },
    loginContainer: {
        marginHorizontal: 30,
        marginVertical: 12,
    },
    loginContainerStyle: {
        marginBottom: 16,
        backgroundColor: colors.white,
    },
    labelStyle: {
        marginVertical: 6,
    },
    usernameInputStyle: {
        color: colors.black,
        marginHorizontal: 0,
        borderRadius: 8,
        borderColor: colors.input_border_color,
        borderWidth: 1,
        paddingHorizontal: 8,
    },
    loginButtonStyle: {
        backgroundColor: 'rgba(218, 37, 37, 1)',
        borderRadius: 8,
        marginVertical: 12,
    }, overlay: {
        backgroundColor: colors.black_10,
        alignItems: 'center',
    },
});
export default LoginScreen;