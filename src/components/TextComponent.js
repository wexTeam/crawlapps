import React from "react";
import { Text } from '@rneui/base'

const TextComponent = ({ text, textStyle, noOfLine = 1, elipsize = 'tail', onPress = null }) => {
    return (
        <Text style={textStyle}
            onPress={() => {
                if (onPress != null) {
                    onPress();
                }
            }}
            numberOfLines={noOfLine}
            ellipsizeMode={elipsize}>
            {text}
        </Text>
    );
}
export default TextComponent;