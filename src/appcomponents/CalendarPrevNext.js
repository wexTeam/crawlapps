import React from "react";
import { Style } from "../css/styles";
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from "../css/colors";
import { StyleSheet, View } from "react-native";
import TextComponent from "../components/TextComponent";

const CalendarPrevNext = ({
    onPrevious,
    onNext,
    currentSelection
}) => {
    return (
        <View style={[styles.background, Style.rowDirection]}>
            <Icon name="left" size={24} color={colors.black}
                onPress={() => {
                    onPrevious();
                }} />
            <View style={[Style.flex1Style, styles.currentSelectionContainer]}>
                <TextComponent
                    text={currentSelection}
                    textStyle={[Style.boldTextStyle, Style.text14Style, styles.currentSelection]}
                />
            </View>
            <Icon name="right" size={24} color={colors.black}
                onPress={() => {
                    onNext();
                }} />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: colors.today_text_color_,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    currentSelectionContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CalendarPrevNext;