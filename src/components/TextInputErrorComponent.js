import React from "react";

import TextComponent from "./TextComponent";
import { Input, Icon } from '@rneui/themed';
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../css/colors";

const TextInputErrorComponent = ({ text, hasPlaceHolder = false, placeHolderText, textStyle, errorText = null, errorTextStyle = styles.defaultErrorTextStyle, secureText = false, onChangeText }) => {

    const [error, setError] = useState("");
    return (
        <View style={{
            paddingHorizontal: 0,
        }}>
            <TextInput
                placeholder={(hasPlaceHolder) ? placeHolderText : ""}
                style={[textStyle, styles.textInputStyle]}
                value={text}
                onChangeText={(text) => {
                    onChangeText(text);
                }}
                secureTextEntry={secureText}
                underlineColorAndroid="transparent"
            />
            <TextComponent
                text={errorText}
                textStyle={errorTextStyle} />

        </View>
    );
}

const styles = StyleSheet.create({
    defaultErrorTextStyle: {
        color: colors.red,
    },
    textInputStyle: {
        height: 40,
    }
});
export default TextInputErrorComponent;