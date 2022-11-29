import React from "react";
import { Text } from '@rneui/base'
import { Button } from '@rneui/themed'

const ButtonComponent = (
    { text,
        buttonStyle, textStyle, onPress = null, loading = false }) => {
    return (
        <Button
            onPress={onPress}
            title={text}
            loading={loading}
            buttonStyle={buttonStyle}
            titleStyle={textStyle}
        />
    );
}
export default ButtonComponent;