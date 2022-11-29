import React, { useContext, useEffect, useState } from "react";
import { FlatList, View, Dimensions, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import TextComponent from "../components/TextComponent";
import { colors } from "../css/colors";
import { Style } from "../css/styles";
import CalendarPrevNext from "./CalendarPrevNext";
import { LocalizationContext } from "../locale/LocalizationContext";

const YearView = ({ onMonthSelected, onYearSelected, selectedYear, selectedMonth }) => {

    const { translations } = useContext(LocalizationContext);
    const screen = Dimensions.get("screen");
    const [months, setMonth] = useState([]);
    const [selectionYear, setSelectionYear] = useState(selectedYear);
    const [selectionMonth, setSelectionMonth] = useState(selectedMonth);

    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth();
    var numColumns = 3;

    useEffect(() => {
        updateList();
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        updateList();

    }, [selectionYear, selectionMonth]);

    function updateList() {
        var months_ = getMonths();
        setMonth(months_);
    }

    function getMonthObject(no, month, jobs, selected) {
        return { "no": no, "month": month, "jobs": jobs, "selected": selected };
    }

    function getMonths() {
        var months_ = [];
        translations.months.map(mon => {
            if ((selectedYear == selectionYear && selectedMonth == mon.no)) {
                // if ((currentYear == selectionYear && mon.no == currentMonth) || (selectedYear == selectionYear && selectedMonth == mon.no)) {
                months_.push(getMonthObject(mon.no, mon.month, 0, true));
            } else {
                months_.push(getMonthObject(mon.no, mon.month, 0, false));
            }
        })
        return months_;
    }

    const monthItemView = ({ item }) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    onMonthSelected(item, selectionYear);
                }} >
                <View style={
                    item.selected ?
                        [styles.selectedDay, {
                            flex: 1 / numColumns, //here you can use flex:1 also
                            height: 20,

                        }] : [styles.defaultDay, {
                            flex: 1 / numColumns, //here you can use flex:1 also
                            height: 20,
                        }]}
                >
                    <TextComponent text={item.month}
                        textStyle={[styles.day]}
                        onPress={() => {
                            onMonthSelected(item, selectionYear);
                        }} />
                    {item.jobs > 0 ?
                        <TextComponent text={item.jobs}
                            textStyle={[styles.totalJobs, Style.text12Style, { top: ((screen.width / numColumns) / 2) + 10 }]}
                            onPress={() => {
                                onMonthSelected(item, selectionYear);
                            }} />
                        : null}
                </View>
            </TouchableWithoutFeedback>
        );
    };

    function onPreviousClicked() {
        var selectionYear_ = selectionYear - 1;
        if (selectionYear_ === selectedYear) {
            setSelectionMonth(selectedMonth);
        } else {

            setSelectionMonth(0);
        }
        setSelectionYear(selectionYear_);
    }

    function onNextClicked() {
        var selectionYear_ = selectionYear + 1;
        if (selectionYear_ === selectedYear) {
            setSelectionMonth(selectedMonth);
        } else {
            setSelectionMonth(0);
        }
        setSelectionYear(selectionYear_);
    }

    return (
        <View style={[Style.flex1Style]}>
            <CalendarPrevNext onPrevious={onPreviousClicked} onNext={onNextClicked} currentSelection={selectionYear} />
            <FlatList
                data={months}
                key={(item, index) => item.no.toString()}
                scrollEventThrottle={16}
                extraData={true}
                numColumns={numColumns}
                removeClippedSubviews={true}
                renderItem={monthItemView}
                keyExtractor={(item, index) => item.no}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    day: {
        color: colors.black,
    },
    defaultDay: {
        aspectRatio: 2.0,
        alignItems: 'center',
        backgroundColor: colors.screen_bg_color,
        justifyContent: 'center',
        borderRightWidth: 0.7,
        borderBottomWidth: 0.7,
        borderColor: colors.tabbar_bg_color,
    },
    selectedDay: {
        aspectRatio: 2.0,
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

export default YearView;