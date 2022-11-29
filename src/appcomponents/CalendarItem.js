import React, { useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import TextComponent from "../components/TextComponent";
import { colors } from "../css/colors";
import { Style } from "../css/styles";

const CalendarItem = ({ item, numColumns, width, onYearClicked, }) => {
    return (
        <View style={
            item.item.selected ?
                [styles.selectedDay, {
                    flex: 1 / numColumns, //here you can use flex:1 also
                    height: width / numColumns,

                }] : [styles.defaultDay, {
                    flex: 1 / numColumns, //here you can use flex:1 also
                    height: width / numColumns,
                }]}
            onStartShouldSetResponder={() => {
                onYearClicked(item.item);
            }} >
            <TextComponent text={(item.item.year > 999) ? item.item.year : "0" + item.item.year}
                textStyle={[styles.day]}
                onPress={() => {
                    onYearClicked(item.item);
                }} />
            {item.item.jobs > 0 ?
                <TextComponent text={item.item.jobs}
                    textStyle={[styles.totalJobs, Style.text12Style, { top: ((width / numColumns) / 2) + 10 }]}
                    onPress={() => {
                        onYearClicked(item.item);
                    }} />
                : null}
        </View>
    );
}

const styles = StyleSheet.create({
    day: {
        color: colors.black,
    },
    defaultDay: {
        aspectRatio: 1,
        alignItems: 'center',
        backgroundColor: colors.screen_bg_color,
        justifyContent: 'center',
        borderRightWidth: 0.7,
        borderBottomWidth: 0.7,
        borderColor: colors.tabbar_bg_color,
    },
    selectedDay: {
        aspectRatio: 1,
        alignItems: 'center',
        backgroundColor: colors.today_text_color_,
        justifyContent: 'center',
        borderRightWidth: 0.7,
        borderBottomWidth: 0.7,
        borderColor: colors.tabbar_bg_color,
    },
    totalJobs: {
        color: colors.white,
        backgroundColor: colors.today_text_color,
        borderRadius: 12,
        position: 'absolute',
        paddingHorizontal: 4,
    },
});

export default CalendarItem;