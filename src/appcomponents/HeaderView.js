import { CommonActions, useNavigation } from "@react-navigation/native";
import { Image } from '@rneui/themed';
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import TextComponent from "../components/TextComponent";
import { colors } from "../css/colors";
import { Style } from "../css/styles";
import { LocalizationContext } from "../locale/LocalizationContext";
import * as api from '../request';
const HeaderView = ({ containerStyle = styles.headerViewBackground, showLogout = true, }) => {
    const { translations } = useContext(LocalizationContext);
    const navigation = useNavigation();

    async function logout() {
        await api.clearUserData();
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Login" }]
            }));
    }

    return (
        <View style={[containerStyle, styles.containerPadding]}>
            <Image
                source={require('.././../images/app_header_logo.png')}
                style={styles.appBrandLogoStyle}
            />
            {showLogout === true ? <View style={styles.logoutContainer}>
                <TextComponent text={translations.logout}
                    textStyle={[Style.mediumTextStyle, Style.text14Style, styles.logout]}
                    onPress={() => {
                        logout();
                    }} />
            </View >
                : null
            }
        </View >
    );
}

const styles = StyleSheet.create({
    headerViewBackground: {
        backgroundColor: colors.white,
    },
    containerPadding: {
        paddingHorizontal: 24,
        flexDirection: 'row',
    },
    appBrandLogoStyle: {
        width: 40 * 5,
        height: 40,
        marginVertical: 8,
        resizeMode: 'contain',
    },
    logoutContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        right: 24,
    },
    logout: {
        color: colors.today_text_color,
    }
});

export default HeaderView;