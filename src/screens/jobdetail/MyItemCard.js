import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";

export default function MyItemCard({ style, item, dayIndex, daysTotal }) {
    const { height, width } = useWindowDimensions();
    return (

        <View style={{
            ...style, // apply calculated styles, be careful not to override these accidentally (unless you know what you are doing)
            backgroundColor: colors.timeline_bg_color,
            borderRadius: 10,
            width: width,
            left: 44,
            padding: 8,
        }}>
            <TextComponent
                text={item.title}
                textStyle={[Style.boldTextStyle, Style.text8Style, styles.jobTitle]} />
            <TextComponent
                text={item.location}
                textStyle={[Style.mediumTextStyle, Style.text8Style, styles.jobTitle]} noOfLine={2} />
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.timeline_bg_color,
        borderRadius: 10,
        elevation: 5,
        padding: 8,
    },
    jobTitle: {
        color: colors.white,
    }
});