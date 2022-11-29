import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Style } from "../../css/styles";


const SplashScreen = () => {
    return (
        <View style={[Style.flex1Style, Style.whiteAppBackgroundStyle, styles.appLogoContainer]}>
            <Image resizeMode='contain' style={[styles.appLogo]} source={require('../../../images/app_header_logo.png')}></Image>
        </View>
    )
};


const styles = StyleSheet.create({
    appLogoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    appLogo: {
        height: 80,
        width: 200,

    },

});

export default SplashScreen;