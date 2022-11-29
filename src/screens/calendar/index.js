import { useIsFocused } from "@react-navigation/native";
import { set } from "immer/dist/internal";
import moment from "moment";
import React, { createRef, useContext, useEffect, useRef, useState } from "react";
import { Alert, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, ToastAndroid, View } from "react-native";


import DialogErrorView from "../../appcomponents/DialogErrorView";
import DialogView from "../../appcomponents/DialogView";
import HeaderView from "../../appcomponents/HeaderView";
import YearsView from "../../appcomponents/YearsView";
import YearView from "../../appcomponents/YearView";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import * as api from '../../request';
import { checkNotifications, requestNotifications } from 'react-native-permissions';
import { Calendar } from 'react-native-big-calendar'
import CalendarPrevNext from "../../appcomponents/CalendarPrevNext";
import { Calendar as RCalendar } from "react-native-calendars";
import CalendarJobList from "./CalendarJobList";
import { Divider } from "@rneui/base";

const CalendarScreen = ({ navigation }) => {

    const { translations } = useContext(LocalizationContext);
    const [jobs, setJobs] = useState([]);
    const [loader, setLoader] = useState(false);
    const [myevents, setMyEvents] = useState([]);

    const isFocused = useIsFocused();
    const [year, setYear] = useState(new Date().getFullYear());


    const [calendarMonthTitle, setCalendarMonthTitle] = useState('');
    const [calendarWeekTitle, setCalendarWeekTitle] = useState('');
    const [calendarDayTitle, setCalendarDayTitle] = useState('');

    const [progress, setProgressBar] = useState(false);
    const [errorText, setErrorText] = useState(null);

    const [markedDates, setMarkedDates] = useState({});
    const [events, setEvents] = useState([]);
    const todaySelected = useRef('');
    const calendarRef = createRef();
    const [loading, setLoading] = useState(true);

    const [yearsTabSelected, setYearsTab] = useState(false);
    const [yearTabSelected, setYearTab] = useState(false);
    const [monthTabSelected, setMonthTab] = useState(true);
    const [weekTabSelected, setWeeksTab] = useState(false);
    const [daysTabSelected, setDaysTab] = useState(false);
    const [todayDate, setTodayDate] = useState(new Date());

    var calendarMonth = useRef(new Date().getMonth());

    useEffect(() => {
        var date = new Date();

        var yearSelected = date.getFullYear();
        var month = date.getMonth();
        var dayInt = date.getDate();
        setCalendarMonthTitle(getCalendarMonthTitle(yearSelected, month));
        setCalendarWeekTitle(getCalendarWeeksTitle(yearSelected, month, dayInt));
        setCalendarDayTitle(getCalendarDaysTitle(yearSelected, month));
        onTodayClicked();
    }, []);

    function getCalendarMonthTitle(yearSelected, month) {
        var today = new Date(yearSelected, month);
        return moment(today).format('MMMM YYYY');
    }

    function getCalendarWeeksTitle(yearSelected, month, dayInt) {
        var currentdate = new Date();
        currentdate.setDate(dayInt);
        currentdate.setMonth(month);
        currentdate.setYear(yearSelected);
        var oneJan = new Date(yearSelected, 0, 1);
        var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
        var result = Math.ceil((currentdate.getDay() + numberOfDays) / 7);
        var monthTitle = getCalendarMonthTitle(yearSelected, month);
        return "Weeks " + result + " (" + monthTitle + ")";
    }

    function getCalendarDaysTitle(year, month) {
        var today = new Date();
        today.setYear(year);
        today.setMonth(month);
        return moment(today).format('MMMM YYYY');
    }

    function getTodayMarkedDay() {
        var today = new Date();
        var formattedToday = moment(today).format('YYYY-MM-DD');
        var a = { [formattedToday]: { selected: true, selectedColor: colors.today_text_color } };
        return a;
    }

    useEffect(() => {
        if (isFocused) {
            if (Platform.OS == 'ios') {
                checkNotifications().then(({ status, settings }) => {
                    if (settings.sound == false) {
                        requestNotifications(['sound']).then(({ status, settings }) => {
                        });
                    }
                });
            }
        }
    }, []);

    useEffect(() => {
        getYearlyEvents(year);
    }, [year]);

    function getEventDividerColor(id, is_accepted_by_coordinator, status) {
        if (is_accepted_by_coordinator != null) {
            if (status == 1 || status == 2) {
                return colors.job_completed_text_color;
            }
            if (is_accepted_by_coordinator == 0) {
                return colors.today_text_color
            }
            if (is_accepted_by_coordinator == 1) {
                return colors.accepted_job_text_color
            }
        }
        return colors.today_text_color;
    }

    async function refreshMonthEvents() {
        var eLength = events.length;
        var markedDates_ = {};
        var today = new Date();
        var formattedToday = moment(today).format('YYYY-MM-DD');
        if (eLength > 0) {

            var currentMonth = calendarMonth.current;
            var myEvents_ = [];
            var selectedDate = [];
            events.map(events => {
                var eventDate = moment(events.date_time_from, 'YYYY-MM-DD HH:mm:ss').toDate();
                if (eventDate.getMonth() == currentMonth && eventDate.getFullYear() == year) {
                    var formatted = moment(eventDate).format('YYYY-MM-DD');
                    var ary = selectedDate[formatted];
                    if (ary == null) {
                        ary = [];
                        ary.push(events);
                    } else {
                        ary.push(events);
                    }
                    selectedDate[formatted] = ary;
                }
            });
            for (const [key, value] of Object.entries(selectedDate)) {
                var color = colors.today_text_color;
                var eventDayStatus = -1;
                value.map(events => {
                    var eventDate = moment(events.date_time_from, 'YYYY-MM-DD HH:mm:ss').toDate();
                    if (events.status == 1 || events.status == 2) {
                        eventDayStatus = 2;
                    } else {
                        if (events.is_accepted_by_coordinator == 1) {
                            eventDayStatus = 1;
                            // return colors.accepted_job_text_color
                        } else if (events.is_accepted_by_coordinator == 0) {
                            eventDayStatus = 0;
                            // return colors.today_text_color
                        }
                    }
                    // }
                    var year = eventDate.getFullYear();
                    var month = eventDate.getMonth();
                    var dateStr = eventDate.getDate();
                    var startHr = moment(eventDate).format('HH');
                    var startMin = moment(eventDate).format('mm');

                    var eventToTime = moment(events.date_time_to, 'HH:mm:ss').toDate();
                    var endHr = moment(eventToTime).format('HH');
                    var endMin = moment(eventToTime).format('mm');
                    myEvents_.push(
                        {
                            "title": events.job_title,
                            "start": new Date(year, month, dateStr, startHr, startMin),
                            "end": new Date(year, month, dateStr, endHr, endMin),
                            "id": events.id,
                            "date_time_from": events.date_time_from,
                            "status": events.status,
                            "is_accepted_by_coordinator": events.is_accepted_by_coordinator,
                            "company_name": events.company_name,
                            "job_title": events.job_title,
                            "job_location": events.job_location,
                            "date_time_to": events.date_time_to,
                            "coordinator_id": events.coordinator_id
                        });
                });
                if (eventDayStatus == 2) {
                    color = colors.job_completed_text_color;
                } else if (eventDayStatus == 1) {
                    color = colors.accepted_job_text_color;
                } else {
                    color = colors.today_text_color;
                }
                markedDates_ = {
                    ...markedDates_, [key]: { selected: true, selectedColor: color }
                }
            }

            setMyEvents(myEvents_);

        }
        if (formattedToday == todaySelected.current) {
            markedDates_ = {
                ...markedDates_, [formattedToday]: { selected: true, selectedColor: colors.black }
            }
        } else {
            markedDates_ = {
                ...markedDates_, [formattedToday]: { selected: true, selectedColor: colors.red }
            }
        }
        if (todaySelected.current != '') {
            markedDates_ = {
                ...markedDates_, [todaySelected.current]: { selected: true, selectedColor: colors.black }
            }
        }

        setMarkedDates(markedDates_);
    }

    function onDateClicked(day) {

        var date = day.year + "-" + day.month + "-" + day.day;
        if (day.month < 10) {
            var month = day.month;
            var date_ = day.year + "-0" + month + "-";
            if (day.day < 10) {
                date_ = date_ + "0" + day.day;
            } else {
                date_ = date_ + "" + day.day;
            }
            todaySelected.current = date_;
        } else {
            var date_ = day.year + "-" + day.month + "-";
            if (day.day < 10) {
                date_ = date_ + "0" + day.day;
            } else {
                date_ = date_ + "" + day.day;
            }
            todaySelected.current = date_;
        }

        setTodayDate(new Date(todaySelected.current));
        var date_ = date;
        getEventsByDate(date_);
        refreshMonthEvents();
    }

    async function getEventsByDate(date_) {
        var year_ = getSelectedDateYear();
        var month_ = getSelectedDateMonth();
        if (year_ == year && (month_ - 1) == calendarMonth.current) {
            setLoader(true);
            var date = date_;
            var response = await api.getEventsByDate(date);
            setLoader(false);
            if (response == null) {
                setJobs([]);
            } else {
                if (response.success && response.data != null && response.data.events != null) {
                    setJobs(response.data.events);
                } else {
                    setErrorText(response.message);
                }
            }
        } else {
            setJobs([]);
        }
    }

    useEffect(() => {
        refreshMonthEvents();
        setLoading(false);
    }, [events]);

    async function getYearlyEvents(year) {
        setProgressBar(true);
        var response = await api.getYearlyEvents(year);
        setProgressBar(false);
        if (response == null) {
            setErrorText(translations.something_went_wrong);
        } else {
            if (response.success && response.data != null && response.data.events != null && response.data.events.length > 0) {
                setEvents(response.data.events)
            } else {
                setErrorText(response.message);
            }
        }
    }

    function showToast(message) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT)
        } else {
            Alert.alert(message);
        }
    }

    /**
     * Today button click handler
     */
    function onTodayClicked() {
        var date = new Date();
        if (year != date.getFullYear()) {
            setYear(date.getFullYear());
        }

        calendarMonth.current = date.getMonth();
        var date_ = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate();
        if (date.getMonth() + 1 < 10) {
            var month = date.getMonth() + 1;
            var date_ = date.getFullYear() + "-0" + month + "-";
            if (date.getDate() < 10) {
                date_ = date_ + "0" + date.getDate();
            } else {
                date_ = date_ + date.getDate();
            }
            todaySelected.current = date_;
        } else {
            todaySelected.current = date_;
        }

        // todaySelected.current
        setTodayDate(date);
        var yearSelected = date.getFullYear();
        var month = date.getMonth();
        setCalendarMonthTitle(getCalendarMonthTitle(yearSelected, month));
        refreshMonthEvents();
        updateMonthEvents(date.getMonth(), yearSelected);
        onMonthClicked();
    }

    /**
     * Inbox button click handler
     */
    function onInboxClicked() {
        navigation.navigate('Inbox');
    }

    function onYearsClicked() {
        setYearTab(false);
        setMonthTab(false);
        setYearsTab(true);
        setWeeksTab(false);
        setDaysTab(false);
    }

    function onYearClicked() {
        setYearTab(true);
        setMonthTab(false);
        setYearsTab(false);
        setWeeksTab(false);
        setDaysTab(false);
    }

    function getSelectedDateMonth() {
        if (todaySelected.current != '') {
            return todaySelected.current.split('-')[1];
        }
        return "";
    }

    function getSelectedDateYear() {
        if (todaySelected.current != '') {
            return todaySelected.current.split('-')[0];
        }
        return "";
    }

    function getSelectedDateDay() {
        if (todaySelected.current != '') {
            return todaySelected.current.split('-')[2];
        }
        return "";
    }

    function onMonthClickedBefore() {
        setJobs([]);
        if (todaySelected.current != '') {
            var month_ = getSelectedDateMonth();
            var year_ = getSelectedDateYear();
            var date_ = getSelectedDateDay();
            if (month_ == calendarMonth.current + 1 && year_ == year) {
                var date = new Date();
                date.setYear(year);
                date.setMonth(calendarMonth.current);
                date.setDate(date_);
                setTodayDate(date);
            }
        }
        refreshMonthEvents();
        onMonthClicked();
    }

    function onMonthClicked() {
        setYearsTab(false);
        setYearTab(false);
        setWeeksTab(false);
        setDaysTab(false);
        setMonthTab(true);
    }

    function onWeeksClicked() {
        setYearsTab(false);
        setYearTab(false);
        setMonthTab(false);
        setDaysTab(false);
        setWeeksTab(true);
    }

    function onDaysClicked() {
        setYearsTab(false);
        setYearTab(false);
        setMonthTab(false);
        setWeeksTab(false);
        setDaysTab(true);
    }

    async function updateMonthEvents(month, yearSelected) {
        if (todaySelected.current != '') {
            var month_ = todaySelected.current.split('-')[1];
            var year_ = todaySelected.current.split('-')[0];
            if (month_ == month + 1 && year_ == yearSelected) {
                var date_ = todaySelected.current
                getEventsByDate(date_);
            } else {
                setJobs([]);
            }
        } else {
            setJobs([]);
        }
    }

    function onMonthPreviousClicked() {
        var month = calendarMonth.current;
        var year_ = year;
        if (month == 0) {
            month = 11;
            year_ = year_ - 1;
        } else {
            month = month - 1;
        }
        calendarMonth.current = month;
        if (year != year_) {
            setYear(year_);
        }
        var date = new Date(year_, month);
        if (todaySelected.current != '') {
            var month_ = todaySelected.current.split('-')[1];
            var year__ = todaySelected.current.split('-')[0];
            var date_ = todaySelected.current.split('-')[2];
            if (month_ == month + 1 && year__ == year) {
                date.setDate(date_);
            } else {
                date.setDate(1);
            }
        } else {
            date.setDate(1);
        }
        setTodayDate(date);
        var yearSelected = year_;
        setCalendarMonthTitle(getCalendarMonthTitle(yearSelected, month));
        refreshMonthEvents();
        onMonthClicked();
        updateMonthEvents(month, yearSelected);
    }

    function onMonthNextClicked() {
        var month = calendarMonth.current;
        var year_ = year;
        if (month == 11) {
            month = 0;
            year_ = year_ + 1;
        } else {
            month = month + 1;
        }
        calendarMonth.current = month;
        var date__ = new Date(year_, month);
        if (year != year_) {
            setYear(year_);
        }
        if (todaySelected.current != '') {
            var month_ = todaySelected.current.split('-')[1];
            var year__ = todaySelected.current.split('-')[0];
            var date_ = todaySelected.current.split('-')[2];
            if (month_ == month + 1 && year__ == year) {
                date__.setDate(date_);
            } else {
                date__.setDate(1);
            }
        } else {
            date__.setDate(1);
        }
        setTodayDate(date__);
        var yearSelected = year_;
        setCalendarMonthTitle(getCalendarMonthTitle(yearSelected, month));
        refreshMonthEvents();
        onMonthClicked();
        updateMonthEvents(month, yearSelected);
    }

    function onWeeksPreviousClicked() {

    }

    function onWeeksNextClicked() {

    }

    function onDaysPreviousClicked() {

    }

    function onDaysNextClicked() {

    }

    return (
        <View style={{ flex: 1, }} >
            <HeaderView containerStyle={Style.greyAppBackgroundStyle} />
            <View style={[Style.rowDirection, styles.calendarTabsContainer]}>
                <TextComponent
                    text={translations.years}
                    textStyle={yearsTabSelected ? [styles.yearsSelectedCalendar] : [styles.yearsCalendar]}
                    onPress={onYearsClicked} />
                <TextComponent
                    text={translations.year}
                    textStyle={yearTabSelected ? [styles.yearsSelectedCalendar] : [styles.yearsCalendar]}
                    onPress={onYearClicked} />
                <TextComponent
                    text={translations.month}
                    textStyle={monthTabSelected ? [styles.yearsSelectedCalendar] : [styles.yearsCalendar]}
                    onPress={onMonthClickedBefore} />
                <TextComponent
                    text={translations.weeks}
                    textStyle={weekTabSelected ? [styles.yearsSelectedCalendar] : [styles.yearsCalendar]}
                    onPress={onWeeksClicked} />
                <TextComponent
                    text={translations.days}
                    textStyle={daysTabSelected ? [styles.yearsSelectedCalendar] : [styles.yearsCalendar]}
                    onPress={onDaysClicked} />

            </View>
            <View style={[Style.flex1Style]}>
                {yearsTabSelected ?
                    <YearsView onYearSelected={(item) => {
                        setYear(item.year);
                        calendarMonth.current = 0;
                        onYearClicked();
                    }} selectedYear={year} /> : null}
                {yearTabSelected ?
                    <YearView
                        onMonthSelected={(item, selectionYear) => {
                            setJobs([]);
                            calendarMonth.current = item.no;
                            var dateday = 0;
                            if (todaySelected.current != '') {
                                var month_ = todaySelected.current.split('-')[1];
                                var year_ = todaySelected.current.split('-')[0];
                                var date_ = todaySelected.current.split('-')[2];
                                if (month_ == calendarMonth.current + 1 && year_ == year) {
                                    dateday = date_;
                                } else {
                                    dateday = 1;
                                }
                            } else {
                                dateday = 1;
                            }

                            var date = new Date(selectionYear, calendarMonth.current, dateday);
                            if (year != selectionYear) {
                                setYear(selectionYear);
                            }
                            setTodayDate(date);
                            refreshMonthEvents();
                            onMonthClicked();
                            var yearSelected = selectionYear;
                            var month = item.no;
                            setCalendarMonthTitle(getCalendarMonthTitle(yearSelected, month));
                            var date_ = todaySelected.current;
                            getEventsByDate(date_);
                        }}
                        onYearSelected={(item, year) => {

                        }}
                        selectedYear={year}
                        selectedMonth={calendarMonth.current} /> : null}
                {monthTabSelected ?
                    <View style={[Style.flex1Style]}>
                        <CalendarPrevNext onPrevious={onMonthPreviousClicked} onNext={onMonthNextClicked} currentSelection={calendarMonthTitle} />
                        <RCalendar
                            // Initially visible month. Default = now
                            ref={calendarRef}
                            initialDate={todayDate}
                            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                            minDate={'0000-01-01'}
                            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                            maxDate={'3000-12-31'}
                            // Handler which gets executed on day press. Default = undefined
                            onDayPress={day => {
                                onDateClicked(day);
                            }}
                            // Handler which gets executed on day long press. Default = undefined
                            onDayLongPress={day => {

                            }}
                            onLayout={() => {
                            }}
                            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                            monthFormat={'yyyy MM'}
                            // Handler which gets executed when visible month changes in calendar. Default = undefined
                            onMonthChange={month => {
                                // monthCurrent.current = month.month;
                                // setCalendarMonth(month.month);
                                if (month.year != year) {
                                    setYear(month.year);
                                } else {
                                    refreshMonthEvents(calendarMonth, year);
                                }
                            }}
                            // Hide month navigation arrows. Default = false                    
                            hideArrows={true}
                            // Replace default arrows with custom ones (direction can be 'left' or 'right')
                            // renderArrow={direction => {
                            //     <Arrow direction={direction} />
                            // }}
                            // Do not show days of other months in month page. Default = false
                            hideExtraDays={true}
                            // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                            // day from another month that is visible in calendar page. Default = false
                            disableMonthChange={false}
                            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                            firstDay={1}
                            // Hide day names. Default = false
                            hideDayNames={false}
                            // Show week numbers to the left. Default = false
                            showWeekNumbers={false}
                            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                            // onPressArrowLeft={subtractMonth => subtractMonth()}
                            // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                            // onPressArrowRight={addMonth => addMonth()}

                            // Disable left arrow. Default = false
                            disableArrowLeft={true}
                            // Disable right arrow. Default = false
                            disableArrowRight={true}
                            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                            disableAllTouchEventsForDisabledDays={true}
                            // Replace default month and year title with custom one. the function receive a date as parameter
                            renderHeader={date => {
                                return null;

                            }}
                            // Enable the option to swipe between months. Default = false
                            enableSwipeMonths={false}
                            markedDates={markedDates}
                        />
                        <Divider />
                        <CalendarJobList
                            navigation={navigation}
                            jobList={jobs}
                            loader={loader}
                        />
                    </View> : null}
                {weekTabSelected ?
                    <View style={{
                        flex: 1,
                    }}>
                        <Calendar events={myevents}
                            mode='week'
                            swipeEnabled={false}
                            date={todayDate}
                            eventCellStyle={{
                                backgroundColor: colors.today_text_color,
                            }}
                            onPressEvent={(events) => {
                                navigation.navigate('JobDetail', { event: events })
                            }}
                            hideNowIndicator={true}
                            dayHeaderHighlightColor={{
                                backgroundColor: colors.today_text_color,
                            }}
                            weekDayHeaderHighlightColor={colors.today_text_color}
                            weekStartsOn={1}
                            headerContainerStyle={{
                                height: 60,
                            }}
                            height={200} />
                    </View> : null}
                {daysTabSelected ?
                    <View style={{
                        flex: 1,
                    }}>
                        <Calendar events={myevents}
                            mode='day'
                            date={todayDate}
                            swipeEnabled={false}
                            hideNowIndicator={true}
                            eventCellStyle={{
                                backgroundColor: colors.today_text_color,
                            }}
                            headerContainerStyle={{
                                height: 60,
                            }}
                            onPressEvent={(events) => {
                                // navigation.navigate('JobDetail', { event: item })
                                navigation.navigate('JobDetail', { event: events })
                            }}
                            height={200} />
                    </View> : null}
            </View>
            <View style={styles.bottomView}>
                <TextComponent
                    text={translations.today}
                    textStyle={[Style.mediumTextStyle, Style.text16Style, Style.todayTextColorStyle, styles.today]}
                    onPress={onTodayClicked} />

                <TextComponent
                    text={translations.inbox}
                    textStyle={[Style.mediumTextStyle, Style.text16Style, Style.todayTextColorStyle, styles.inbox]}
                    onPress={onInboxClicked} />
            </View>
            <DialogView visible={progress} />
            <DialogErrorView
                visible={errorText != null}
                okButtonText={translations.ok}
                toggleOverlay={() => {
                    setErrorText(null);
                }} errorText={errorText} />
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: colors.white,
    },
    bottomView: {
        backgroundColor: colors.header_bg_color,
    },
    today: {
        marginVertical: 24,
        marginStart: 24,
    },
    inbox: {
        marginVertical: 24,
        right: 24,
        position: 'absolute',
    },
    calendarTabsContainer: {
        paddingHorizontal: 24,
        backgroundColor: colors.today_text_color,
        alignItems: 'center',
        justifyContent: 'center',
    },
    yearsCalendar: {
        paddingVertical: 8,
        color: colors.black,
        paddingHorizontal: 8,
    },
    yearsSelectedCalendar: {
        color: colors.black,
        paddingVertical: 8,
        backgroundColor: colors.white_50,
        paddingHorizontal: 8,
    }
});

export default CalendarScreen;