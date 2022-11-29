import React, { useEffect, useState } from "react";
import { FlatList, View, Dimensions, StyleSheet } from "react-native";
import TextComponent from "../components/TextComponent";
import { colors } from "../css/colors";
import { Style } from "../css/styles";
import CalendarPrevNext from "./CalendarPrevNext";
const YearsView = ({ onYearSelected, selectedYear }) => {

    const screen = Dimensions.get("screen");
    const [years, setYears] = useState([]);
    const currentYear = selectedYear;
    var numColumns = 5;

    useEffect(() => {
        updateList();
    }, [selectedYear]);

    function updateList() {
        if (years.length > 0) {
            var year = years[0].year;
            var startYear = year;
            var endYear = startYear + 24;
            var years_ = getYears(startYear, endYear);
            setYears(years_);
        } else {
            var years_ = getYearsSlot();
            setYears(years_);
        }
    }

    const yearItemView = ({ item }) => {
        return (
            <View style={
                item.selected ?
                    [styles.selectedDay, {
                        flex: 1 / numColumns, //here you can use flex:1 also
                        height: screen.width / numColumns,

                    }] : [styles.defaultDay, {
                        flex: 1 / numColumns, //here you can use flex:1 also
                        height: screen.width / numColumns,
                    }]}
                onStartShouldSetResponder={() => {
                    onYearSelected(item);
                }} >
                <TextComponent text={(item.year > 999) ? item.year : "0" + item.year}
                    textStyle={[styles.day]}
                    onPress={() => {
                        onYearSelected(item);
                    }} />
                {item.jobs > 0 ?
                    <TextComponent text={item.jobs}
                        textStyle={[styles.totalJobs, Style.text12Style, { top: ((screen.width / numColumns) / 2) + 10 }]}
                        onPress={() => {
                            onYearSelected(item);
                        }} />
                    : null}
            </View>
        );
    };

    function getYears(startYear, endYear) {
        var yearData = [];
        for (var i = startYear; i <= endYear; i++) {
            // if (currentYear == i) {
            //     yearData.push({ 'year': i, 'jobs': 0, 'selected': true });
            // } else
            if (selectedYear == i) {
                yearData.push({ 'year': i, 'jobs': 0, 'selected': true });
            } else {
                yearData.push({ 'year': i, 'jobs': 0, 'selected': false });
            }
        }
        return yearData;
    }

    function getYearsSlot() {
        var moduleYear = selectedYear % 25;
        var slotYear = 24 - moduleYear;
        var endYear = ((slotYear) + selectedYear);
        var startYear = (((slotYear) + selectedYear) - 24);
        return getYears(startYear, endYear);
    }

    function onPreviousClicked() {
        var year = years[0].year;
        var endYear = year - 1;
        if (endYear >= 0) {
            var startYear = endYear - 24;
            var years_ = getYears(startYear, endYear);
            setYears(years_);
        }
    }

    function onNextClicked() {
        var year = years[24].year;
        var startYear = year + 1;
        var endYear = startYear + 24;
        var years_ = getYears(startYear, endYear);
        setYears(years_);
    }

    return (
        <View style={[Style.flex1Style]}>
            <CalendarPrevNext onPrevious={onPreviousClicked} onNext={onNextClicked} currentSelection={'Years'} />
            <FlatList
                data={years}
                key={(item, index) => item.year.toString()}
                scrollEventThrottle={16}
                extraData={true}
                numColumns={5}
                removeClippedSubviews={true}
                renderItem={yearItemView}
                keyExtractor={(item, index) => item.year}
            />
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
        borderRadius: 6,
        position: 'absolute',
        paddingHorizontal: 4,
        overflow: 'hidden',
    },
});

export default YearsView;