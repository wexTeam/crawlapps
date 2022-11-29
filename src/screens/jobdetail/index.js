import { CommonActions, useIsFocused } from "@react-navigation/native";
import { Button, color } from "@rneui/base";
import { Card, Divider, Overlay } from "@rneui/themed";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Alert, BackHandler, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, ToastAndroid, useWindowDimensions, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderView from "../../appcomponents/HeaderView";
import ButtonComponent from "../../components/ButtonComponent";
import TextComponent from "../../components/TextComponent";
import TextInputMultilineComponent from "../../components/TextInputMultilineComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import * as api from '../../request';
import DialogView from "../../appcomponents/DialogView";
import DialogErrorView from "../../appcomponents/DialogErrorView";
import { getAlertInString } from "../../utils/AppUtils";
import DatePicker from "react-native-date-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JobDetailScreen = ({ navigation, route }) => {



    const [progress, setProgressBar] = useState(false);
    const [errorText, setErrorText] = useState(null);

    const [datePicker, showDatePicker] = useState(false);
    const [startTimePicker, showStartTimePicker] = useState(false);
    const [endTimePicker, showEndTimePicker] = useState(false);

    const [dateProposed, setPropsedDate] = useState(new Date());
    const [startDateProposed, setStartDateProposed] = useState(new Date());
    const [endDateProposed, setEndDateProposed] = useState(new Date());

    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState(moment(new Date()).format("hh:mm a"));
    const [endTime, setEndTime] = useState(moment(new Date()).format("hh:mm a"))

    const { height, width } = useWindowDimensions();
    const { translations } = useContext(LocalizationContext);
    const [declineModalVisible, setDeclineModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const [date] = React.useState(new Date());
    const [from] = React.useState(moment().toDate());
    const [till] = React.useState(moment().toISOString());
    const range = { from, till };

    const [eventTime, setEventTime] = useState(60);

    const [event, setEvent] = useState(route.params.event);
    const [note, setNote] = useState('');
    const [monthName, setMonthName] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [attachmentLabel, setAttachmentLabel] = useState(translations.add);
    const [timeLine1Text, setTimelineText1] = useState('');
    const [timeLine2Text, setTimelineText2] = useState('');
    const [timeLine3Text, setTimelineText3] = useState('');
    const [timeLine4Text, setTimelineText4] = useState('');

    const isFocused = useIsFocused();

    // const [items] = React.useState([
    //     {
    //         title: event.job_title,
    //         location: event.job_location,
    //         startDate: getJobStartTime(),
    //         endDate: getJobEndTime(),
    //     },
    // ]);

    function convertFrom24To12Format(time) {
        const [sHours, minutes] = time.match(/([0-9]{1,2}):([0-9]{2})/).slice(1);
        const period = +sHours < 12 ? 'AM' : 'PM';
        const hours = +sHours % 12 || 12;

        return `${hours}:${minutes} ${period}`;
    }

    function getJobStartTime() {
        var dateArray = event.date_time_from.split(" ");
        var date = dateArray[0];
        var time = dateArray[1];
        var startTime = date + "T" + time + ".000Z";
        var eventDate = new Date(startTime);
        return eventDate;
    }

    function getJobEndTime() {
        var dateArray = event.date_time_from.split(" ");
        var date = dateArray[0];
        var endTime = date + "T" + event.date_time_to + ".000Z";
        var eventDate = new Date(endTime);
        return eventDate;
    }

    useEffect(() => {
        if (isFocused) {
            refreshData();
        }
    }, [isFocused])

    async function refreshData() {
        var refresh = await AsyncStorage.getItem('refresh');
        if (refresh == "true") {
            getJobDetail();
        }
        await AsyncStorage.setItem('refresh', "false");
    }

    useEffect(() => {
        if (event != null && event != undefined) {
            var eventDate = moment(event.date_time_from, 'YYYY-MM-DD HH:mm:ss').toDate();
            var eventToTime = moment(event.date_time_to, 'HH:mm:ss').toDate();
            var startTime = moment(eventDate).format('hh:mm a');
            var endTime = moment(eventToTime).format('hh:mm a');
            setTimelineText1('12:00 am');
            setTimelineText2(startTime);
            setTimelineText3(endTime);
            setTimelineText4('11:00 pm');

            setStartTime(startTime);
            setEndTime(endTime);
            setStartDate(moment(eventDate).format('DD MMM YYYY'));
            setStartDateProposed(eventDate);

            var sDate = event.date_time_from.split(" ")[0] + " " + event.date_time_to;
            var endDateProposed = moment(sDate, 'YYYY-MM-DD HH:mm:ss').toDate();
            setEndDateProposed(endDateProposed);
            setEventTime(getSelectedAlertTimeValue())
            setNote(event.notes);
        }
    }, [event])

    useEffect(() => {
        if (route.params?.eventTime != undefined || route.params?.eventTime != null) {
            event.coordinator_reminder_minuts = route.params?.eventTime;
            setEventTime(route.params?.eventTime);
            confirmEvent(note, route?.params?.eventTime)
        }
    }, [route.params?.eventTime])

    useEffect(() => {
        if (route.params?.attachments) {
            var attachmentsPicked = [];
            attachments.map(img => {
                attachmentsPicked.push(img);
            })
            route.params?.attachments.map(img => {
                attachmentsPicked.push(img);
            })
            setAttachments(attachmentsPicked);
        }

        if (route.params?.attachments && route.params?.deleted) {
            uploadPhotos(note, eventTime, route.params?.attachments, route.params?.deleted)
        }
    }, [route.params?.attachments, route.params?.deleted])

    useEffect(() => {
        var eventDate = moment(event.date_time_from, 'YYYY-MM-DD HH:mm:ss').toDate();
        var month = moment(eventDate).format('MMM');
        setMonthName(month)
        getJobDetail();
    }, [])

    useEffect(() => {
        setAttachmentLabel(getAttachedFile());
    }, [attachments])

    async function getJobDetail() {
        setProgressBar(true);
        var response = await api.getJobDetail(event.id);
        setProgressBar(false);
        if (response == null) {
            setErrorText(translations.something_went_wrong);
        } else {
            if (response.success && response.data != null && response.data.event != null) {
                setEvent(response.data.event)
                var attachment = [];
                response?.data?.event?.attached.map(img => {
                    attachment.push({
                        url: img,
                        uri: null,
                        filename: null,
                        type: null,
                    })
                })
                setAttachments(attachment);
            } else {
                setErrorText(response.message);
            }
        }
    }

    /**
     * Mark Job As Completed button click handler
     */
    function onJobCompletedClicked() {
        toggleConfirmOverlay();
    }

    /**
    * Accept Job button click handler
    */
    function onAcceptEventClicked() {
        if (!isEventAccepted()) {
            acceptEvent();
        }
    }

    async function acceptEvent() {
        setProgressBar(true);
        var response = await api.acceptJobStatus(event.id);
        setProgressBar(false);
        if (response != null) {
            if (response.success === true) {
                showToast(response.message)
                getJobDetail();
            } else {
                setErrorText(response.message)
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
   * Decline Job button click handler
   */
    function onDeclineJobClicked() {
        if (event != null && event.actions && event.actions.is_accepted_by_coordinator === null) {
            toggleOverlay();
        }
    }

    const toggleOverlay = () => {
        setDeclineModalVisible(!declineModalVisible);
    };

    /**
  * Add Attachments  button click handler
  */
    function onAddAttachmentClicked() {
        if (!isEventCompletedAttachment()) {
            navigation.navigate('Attachments', { attachments: attachments, eventId: event.id, note: note, eventTime: eventTime });
        }
    }

    /**
  * Alert time change  button click handler
  */
    function onAlertTimerChangedClicked() {
        if (!isEventCompletedAttachment()) {
            if (isEventGoing()) {
                navigation.navigate('Alerts', { eventTime: getSelectedAlertTimeValue() });
            }
        }
    }

    function onBackPressed() {
        navigation.dispatch(CommonActions.goBack());
    }

    const toggleConfirmOverlay = () => {
        setConfirmModalVisible(!confirmModalVisible);
    };

    function getAcceptedEventLabel() {
        if (event === null || event.actions === null || event.actions === undefined || event.actions.is_accepted_by_coordinator === null) {
            return translations.accept_job;
        }
        if (event.actions.is_accepted_by_coordinator === 1) {
            return translations.accepted;
        }
        return "";
    }

    function isEventAccepted() {
        if (event === null || event.actions === null || event.actions === undefined || event.actions.is_accepted_by_coordinator === null) {
            return false;
        }
        if (event.actions.is_accepted_by_coordinator === 1) {
            return true;
        }

        return false;
    }

    function isEventDeclined() {
        if (event === null || event.actions === null || event.actions === undefined || event.actions.is_accepted_by_coordinator === null) {
            return false;
        }
        if (event.actions.is_accepted_by_coordinator === 0) {
            return true;
        }
        return false;
    }

    function getEventStatus() {
        if (event === null || event.actions === null || event.actions === undefined || event.actions.is_accepted_by_coordinator === null) {
            // if(event.status === 0) {
            //     return translations.pending;
            // }
            return translations.pending;
        }
        if (isEventDeclined()) {
            return "-";
        }

        if (event.status === 1) {
            return translations.completed;
        }

        if (event.status === 2) {
            return translations.invoiced;
        }

        if (event.status === 0) {
            return translations.accepted;
        }

        return "-";
    }

    function isEventGoing() {
        if (event === null || event.actions === null || event.actions === undefined || event.actions.is_accepted_by_coordinator === null) {
            // if(event.status === 0) {
            //     return translations.pending;
            // }
            return true;
        }

        if (event.status === 1) {
            return false;
        }

        if (event.status === 2) {
            return false;
        }

        if (event.status === 0) {
            return true;
        }

        return true;
    }

    function isAlertSectionShow() {

        if (isEventDeclined()) {
            return false;
        }
        if (event != null && event.date_time_from) {
            var eventDate = moment(event.date_time_from, 'YYYY-MM-DD HH:mm:ss').toDate();
            if (new Date().getTime() > eventDate.getTime()) {
                return true;
            }
        }
        return false;
    }

    function isEventCompleted() {
        if (event != null && (event.status === 2 || event.status === 1)) {
            return false;
        }
        if (isEventAccepted()) {
            return true;
        }
        return false;
    }

    function isEventCompletedAttachment() {
        if (event != null && (event.status === 2 || event.status === 1)) {
            return true;
        }
        if (isEventDeclined()) {
            return true;
        }
        if (!isEventAccepted()) {
            return true;
        }
        return false;
    }

    function getDeclinedJobLabel() {
        if (event === null || event.actions === null || event.actions === undefined || event.actions.is_accepted_by_coordinator === null) {
            return translations.decline_job;
        }

        if (event.actions.is_accepted_by_coordinator === 0) {
            return translations.declined;
        }
        return "";
    }

    function getJobDay() {
        if (event != null && event.date_time_from) {
            var eventDate = moment(event.date_time_from, 'YYYY-MM-DD HH:mm:ss').toDate();
            var formatted = moment(eventDate).format('ddd, DD MMM YYYY');
            var eventToTime = moment(event.date_time_to, 'HH:mm:ss').toDate();
            var startTime = moment(eventDate).format('hh:mm a');
            var endTime = moment(eventToTime).format('hh:mm a');
            return formatted + "\n" + translations.from + " " + startTime + " " + translations.to + " " + endTime;
        }
        return "";
    }

    function getSelectedAlertTime(eventTime) {
        // var eventTime = 0;
        // if (event != null && event.coordinator_reminder_minuts != null) {
        //     eventTime = event.coordinator_reminder_minuts;
        // }

        var eventTime = 0;
        if (event != null && event.coordinator_reminder_minuts != null) {
            eventTime = event.coordinator_reminder_minuts;
        }

        var time = translations.at_time_of_event;
        translations.data.map(alert => {
            if (alert.value === eventTime) {
                time = alert.time;
            }
        });
        return time;
    }

    function getSelectedAlertTimeValue() {
        var eventTime = 60;
        if (event != null && event.coordinator_reminder_minuts != null) {
            eventTime = event.coordinator_reminder_minuts;
        }
        return eventTime;
    }

    function getSelectedAlertTimeValue(event) {
        var eventTime = 60;
        if (event != null && event.coordinator_reminder_minuts != null) {
            eventTime = event.coordinator_reminder_minuts;
        }
        return eventTime;
    }

    function getEventAttached() {
        var attached = [];
        if (event != null && event.attached != null) {
            attached = event.attached;
        }
        return attached;
    }

    function getAttachedFile() {
        // if (isEventCompletedAttachment()) {
        var no_attachment = translations.add;
        if (attachments.length > 0) {
            no_attachment = attachments.length + " " + translations.attached;
        }
        return no_attachment;
        // } else {
        //     return translations.add;
        // }
    }

    function getStartDeclineDate() {
        if (event != null && event.date_time_from) {
            var eventDate = moment(event.date_time_from, 'YYYY-MM-DD HH:mm:ss').toDate();
            var formatted = moment(eventDate).format('DD MMM YYYY');
            return formatted;
        }
        return moment(dateProposed).format('DD MMM YYYY');
    }

    function onProposeNewTimeClicked() {
        var dateTime = new Date();
        dateTime.setHours(0);
        var endDateProp = endDateProposed.getTime();
        var startDateProp = startDateProposed.getTime();

        if (dateProposed.getTime() < dateTime.getTime()) {
            showToast(translations.propose_date);
        } else if (startDateProposed.getTime() < new Date().getTime()) {
            showToast(translations.propose_time);
        } else if (endDateProposed.getTime() < startDateProposed.getTime()) {
            showToast(translations.propose_time);
        } else if (endDateProposed.getTime() <= startDateProposed.getTime()) {
            showToast(translations.propose_time_invalid);
        } else {
            var strDate = moment(dateProposed).format('YYYY-MM-DD');
            var strStartTime = moment(startDateProposed).format("HH:mm:ss");
            var preffered_To = moment(endDateProposed).format("HH:mm:ss");
            var preffered_from = strDate + " " + strStartTime;
            declineEvent(preffered_from, preffered_To);
        }
    }

    async function declineEvent(preffered_from, preffered_To) {
        setProgressBar(true);
        var response = await api.declineJobStatus(event.id, preffered_from, preffered_To);
        setProgressBar(false);
        toggleOverlay();
        if (response != null) {
            if (response.success === true) {
                showToast(response.message)
                getJobDetail();
            } else {
                setErrorText(response.message)
            }
        }
    }

    function onConfirmClicked() {
        completeEvent();
    }

    async function confirmEvent(note = '', eventTime, attachment = [], deleted = []) {
        if (note == null) {
            note = '';
        }
        setProgressBar(true);
        var response = await api.confirmEvent(event.id, note, eventTime, attachment, deleted);
        setProgressBar(false);
        if (response != null) {
            if (response.success === true) {
                showToast(response.message)
                getJobDetail();
            } else {
                setErrorText(response.message)
            }
        }
    }

    async function uploadPhotos(note, eventTime, attachment, deleted) {
        setProgressBar(true);
        var response = await api.confirmEvent(event.id, note, eventTime, attachment, deleted);
        setProgressBar(false);
        if (response != null) {
            if (response.success === true) {
                showToast(response.message)
                getJobDetail();
            } else {
                setErrorText(response.message)
            }
        }
    }

    async function completeEvent() {
        setProgressBar(true);
        var response = await api.completeEvent(event.id);
        setProgressBar(false);
        if (response != null) {
            if (response.success === true) {
                showToast(response.message)
                toggleConfirmOverlay();
                getJobDetail();
            } else {
                setErrorText(response.message)
            }
        }
    }

    return (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            nestedScrollEnabled={true}
            style={[Style.flex1Style, Style.screenBgColor]} >
            <View style={[Style.flex1Style]}>
                <HeaderView />
                {/* <ScrollView nestedScrollEnabled={true} contentContainerStyle={[{ flexGrow: 1, }]}
                scrollEnabled={true}> */}
                <View style={[Style.flex1Style]}>
                    <View style={styles.headerView}>
                        <TextComponent
                            text={translations.job_details}
                            textStyle={[Style.boldTextStyle, Style.text14Style, styles.jobDetail]}
                        />
                        <Button type="clear"
                            titleStyle={styles.monthName}
                            onPress={onBackPressed}>
                            <Icon name="left" size={16} color={colors.today_text_color} />
                            {translations.back}
                        </Button>

                        <TextComponent
                            text={getAcceptedEventLabel()}
                            textStyle={[Style.mediumTextStyle, Style.text14Style, styles.acceptedJob]}
                            onPress={onAcceptEventClicked} />
                    </View>
                    <View style={styles.details}>
                        <TextComponent
                            text={event.company_name + " - " + event.job_title}
                            textStyle={[Style.boldTextStyle, Style.text18Style, styles.jobname]}
                            noOfLine={2}
                        />
                        <TextComponent
                            text={event.job_location}
                            textStyle={[Style.mediumTextStyle, Style.text12Style, styles.location]}
                            noOfLine={2}
                        />

                        <View style={[styles.timeJobContainer]}>
                            <TextComponent
                                text={getJobDay()}
                                textStyle={[Style.mediumTextStyle, Style.text12Style, styles.time]}
                                noOfLine={2} />
                            <TextComponent
                                text={getDeclinedJobLabel()}
                                textStyle={[Style.mediumTextStyle, Style.text14Style, styles.declineJob]}
                                onPress={onDeclineJobClicked} />
                        </View>

                        <View style={{
                            marginStart: 16,
                            marginEnd: 16,
                            backgroundColor: colors.screen_bg_color,
                            borderRadius: 14,
                            paddingVertical: 8,
                            marginBottom: 8,
                        }}>
                            <View style={[Style.rowDirection, { flex: 1, height: 50, }]}>
                                <View style={{ alignItems: 'center', }}>
                                    <Text style={[styles.timeLineText1, Style.boldTextStyle, Style.text10Style]}>{timeLine1Text}</Text>
                                    <View style={{ flex: 1, width: 0.4, backgroundColor: colors.timeline_color }}></View>
                                </View>
                                <View style={{ flex: 1, height: 0.4, marginTop: 12, backgroundColor: colors.timeline_color }}></View>
                            </View>
                            <View style={[Style.rowDirection, { flex: 1, height: 50, }]}>
                                <View style={{ alignItems: 'center', }}>
                                    <Text style={[styles.timeLineText1, Style.boldTextStyle, Style.text10Style]}>{timeLine2Text}</Text>
                                    <View style={{ flex: 1, width: 0.4, backgroundColor: colors.timeline_color }}></View>
                                </View>
                                <View style={{ flex: 1, height: 0.4, marginTop: 12, backgroundColor: colors.timeline_color }}></View>
                                <View style={{
                                    backgroundColor: colors.timeline_bg_color,
                                    borderRadius: 8,
                                    flex: 1,
                                    right: 0,
                                    height: 50,
                                    marginHorizontal: 8,
                                    marginTop: 12,
                                    left: 52,
                                    position: 'absolute',
                                    padding: 6,
                                }}>
                                    <TextComponent
                                        text={event.company_name + " - " + event.job_title}
                                        textStyle={[Style.boldTextStyle, Style.text8Style, styles.jobTitle]} />
                                    <TextComponent
                                        text={event.job_location}
                                        textStyle={[Style.mediumTextStyle, Style.text8Style, styles.jobTitle]} noOfLine={2} />
                                </View>
                            </View>
                            <View style={[Style.rowDirection, { flex: 1, height: 50, }]}>
                                <View style={{ alignItems: 'center', }}>
                                    <Text style={[styles.timeLineText1, Style.boldTextStyle, Style.text10Style]}>{timeLine3Text}</Text>
                                    <View style={{ flex: 1, width: 0.4, backgroundColor: colors.timeline_color }}></View>
                                </View>
                                <View style={{ flex: 1, height: 0.4, marginTop: 12, backgroundColor: colors.timeline_color }}></View>

                            </View>
                            <View style={[Style.rowDirection, { flex: 1, height: 50, }]}>
                                <View style={{ alignItems: 'center', }}>
                                    <Text style={[styles.timeLineText1, Style.boldTextStyle, Style.text10Style]}>{timeLine4Text}</Text>
                                    <View style={{ flex: 1, width: 0.4, backgroundColor: colors.timeline_color }}></View>
                                </View>
                                <View style={{ flex: 1, height: 0.4, marginTop: 12, backgroundColor: colors.timeline_color }}></View>
                            </View>

                        </View>

                        <Divider marginStart={16} />
                        <View style={[Style.rowDirection, styles.statusContainer]}>
                            <TextComponent
                                text={translations.status}
                                textStyle={[Style.mediumTextStyle, Style.text12Style, styles.status]}
                            />
                            <Button type="clear"
                                titleStyle={[Style.mediumTextStyle, Style.text12Style, styles.acceptedStatus]}>
                                {getEventStatus()}
                            </Button>
                        </View>
                        {!isAlertSectionShow() ?
                            <Divider marginStart={16} /> : null}
                        {!isAlertSectionShow() ?
                            <View style={[Style.rowDirection, styles.statusContainer]}>
                                <TextComponent
                                    text={translations.alert}
                                    textStyle={[Style.mediumTextStyle, Style.text12Style, styles.status]}
                                />
                                <Button type="clear"
                                    titleStyle={[Style.mediumTextStyle, Style.text12Style, styles.alertStatus]}
                                    onPress={onAlertTimerChangedClicked}>
                                    {getSelectedAlertTime(eventTime)}
                                    <Icon name="right" size={16} color={colors.time_text_color} />
                                </Button>
                            </View> : null}
                        <Divider marginStart={16} />
                        <View style={[Style.rowDirection, styles.statusContainer]}>
                            <TextComponent
                                text={translations.attachments}
                                textStyle={[Style.mediumTextStyle, Style.text12Style, styles.status]}
                            />
                            {attachments &&
                                <Button type="clear"
                                    titleStyle={[Style.mediumTextStyle, Style.text12Style, styles.alertStatus]}
                                    onPress={onAddAttachmentClicked}>
                                    {attachmentLabel}
                                    <Icon name="right" size={16} color={colors.time_text_color} />
                                </Button>
                            }
                        </View>
                    </View>

                    <View style={[styles.notesContainer]}>
                        <TextComponent
                            text={translations.notes}
                            textStyle={[Style.mediumTextStyle, Style.text12Style, styles.notes]}
                        />
                        <Divider />
                        <TextInputMultilineComponent
                            text={note === null ? '' : note}
                            textStyle={[Style.mediumTextStyle, Style.text14Style, styles.notesInput]}
                            onChangeText={(text) => {
                                setNote(text);
                            }}
                            endEditing={() => {
                                if (isEventAccepted()) {
                                    confirmEvent(note, eventTime)
                                }
                            }}
                        />
                    </View>
                </View>
                {/* </ScrollView> */}
                {
                    isEventCompleted() ?
                        <View style={styles.bottomView}>
                            <TextComponent
                                text={translations.mark_job_completed}
                                textStyle={[Style.mediumTextStyle, Style.text16Style, styles.markJobAsCompleted]}
                                onPress={onJobCompletedClicked} />
                        </View> : null
                }
                <Overlay
                    isVisible={declineModalVisible}
                    fullScreen={true}
                    overlayStyle={styles.overlay}
                    onBackdropPress={toggleOverlay}

                >
                    <View style={styles.overlayBody}>

                        <View style={[styles.closeIcon]}>
                            <Icon name="close" size={20} color={colors.black} onPress={toggleOverlay} />
                        </View>
                        <Card containerStyle={styles.containerDeclineDialog}>
                            <TextComponent text={event.company_name + " - " + event.job_title}
                                textStyle={[Style.mediumTextStyle, Style.text14Style, styles.jobNameDecline]}
                            />
                            <Divider />
                            <TextComponent
                                text={event.job_location}
                                textStyle={[Style.mediumTextStyle, Style.text12Style, styles.locationLine1Decline]}
                                noOfLine={2}
                            />
                            {/* <TextComponent
                            text={'Perth, WA, Australia'}
                            textStyle={[Style.mediumTextStyle, Style.text12Style, styles.locationLine2Decline]}
                            noOfLine={2}
                        /> */}
                        </Card>

                        <Card containerStyle={styles.containerDecline2Dialog}>
                            <View style={[styles.proposeNewTimeContainer]}>
                                <TextComponent text={translations.declineJobProposeNewTime}
                                    textStyle={[Style.boldTextStyle, Style.text16Style, styles.proposeNewTimeTitle]}
                                />
                            </View>
                            <Divider />

                            <View style={[Style.rowDirection, styles.startsTimeContainer]}>
                                <TextComponent text={translations.starts}
                                    textStyle={[Style.mediumTextStyle, Style.text14Style, styles.startsTimeLabel]} />
                                <TextComponent text={startDate}
                                    textStyle={[Style.mediumTextStyle, Style.text14Style, styles.startsTimeDateLabel]}
                                    onPress={() => {
                                        showDatePicker(true);
                                    }} />
                                <TextComponent text={startTime}
                                    textStyle={[Style.mediumTextStyle, Style.text14Style, styles.startsTimeDateLabel]}
                                    onPress={() => {
                                        showStartTimePicker(true);
                                    }} />
                            </View>
                            <Divider />
                            <View style={[Style.rowDirection, styles.startsTimeContainer]}>
                                <TextComponent text={translations.ends}
                                    textStyle={[Style.mediumTextStyle, Style.text14Style, styles.startsTimeLabel]} />
                                <TextComponent text={startDate}
                                    textStyle={[Style.mediumTextStyle, Style.text14Style, styles.startsTimeDateLabel]} />
                                <TextComponent text={endTime}
                                    textStyle={[Style.mediumTextStyle, Style.text14Style, styles.startsTimeDateLabel]}
                                    onPress={() => {
                                        showEndTimePicker(true);
                                    }} />
                            </View>
                            <View style={[styles.proposeNewTimeContainer]}>
                                <ButtonComponent text={translations.proposeNewTime}
                                    textStyle={[Style.mediumTextStyle, Style.text12Style, styles.proposeNewTimeLabel]}
                                    buttonStyle={styles.proposeNewTime}
                                    onPress={onProposeNewTimeClicked}
                                />
                            </View>
                        </Card>
                    </View>
                </Overlay>
                <Overlay
                    isVisible={confirmModalVisible}
                    fullScreen={true}
                    overlayStyle={styles.overlay}
                    onBackdropPress={toggleConfirmOverlay}>
                    <View style={styles.overlayBody}
                    >
                        <View style={[styles.closeIcon]}>
                            <Icon name="close" size={20} color={colors.black} onPress={toggleConfirmOverlay} />
                        </View>
                        <Card containerStyle={styles.containerDeclineDialog}>
                            <TextComponent text={event.company_name + " - " + event.job_title}
                                textStyle={[Style.mediumTextStyle, Style.text14Style, styles.jobNameDecline]}
                            />
                            <Divider />
                            <TextComponent
                                text={event.job_location}
                                textStyle={[Style.mediumTextStyle, Style.text12Style, styles.locationLine1Decline]}
                                noOfLine={2}
                            />
                            {/* <TextComponent
                            text={'Perth, WA, Australia'}
                            textStyle={[Style.mediumTextStyle, Style.text12Style, styles.locationLine2Decline]}
                            noOfLine={2}
                        /> */}
                        </Card>

                        <Card containerStyle={styles.containerDecline2Dialog}>
                            <View style={[styles.proposeNewTimeContainer]}>
                                <TextComponent text={translations.mark_job_completed}
                                    textStyle={[Style.boldTextStyle, Style.text16Style, styles.markJobAsCompletedTitle]}
                                />
                            </View>
                            <Divider />
                            <View style={[styles.proposeNewTimeContainer]}>
                                <ButtonComponent text={translations.confirm}
                                    textStyle={[Style.mediumTextStyle, Style.text16Style, styles.proposeNewTimeLabel]}
                                    buttonStyle={styles.confirmButton}
                                    onPress={onConfirmClicked}
                                />
                            </View>
                        </Card>
                    </View>
                </Overlay>
                <DialogView visible={progress} />
                <DialogErrorView
                    visible={errorText != null}
                    okButtonText={translations.ok}
                    toggleOverlay={() => {
                        setErrorText(null);

                    }} errorText={errorText} />
                <DatePicker
                    modal
                    open={datePicker}
                    date={startDateProposed}
                    mode={"date"}
                    onConfirm={(date) => {
                        showDatePicker(false);
                        var dateTime = new Date();
                        dateTime.setHours(0);
                        if (date.getTime() < dateTime.getTime()) {
                            showToast(translations.propose_date)
                            return false;
                        } else {
                            setPropsedDate(date);
                            setStartDateProposed(date);
                            var dateTimeEnd = new Date();
                            dateTimeEnd.setFullYear(date.getFullYear());
                            dateTimeEnd.setMonth(date.getMonth());
                            dateTimeEnd.setDate(date.getDate());
                            dateTimeEnd.setHours(endDateProposed.getHours());
                            dateTimeEnd.setMinutes(endDateProposed.getMinutes());
                            setEndDateProposed(dateTimeEnd);
                            setStartDate(moment(date).format('DD MMM YYYY'));
                        }
                    }}
                    onCancel={() => {
                        showDatePicker(false)
                    }}
                />
                <DatePicker
                    modal
                    open={startTimePicker}
                    date={startDateProposed}
                    mode={"time"}
                    onConfirm={(date) => {
                        showStartTimePicker(false);
                        if (date.getTime() < new Date().getTime()) {
                            showToast(translations.propose_time)
                            return false;
                        } else {
                            setStartDateProposed(date);
                            var startTime = moment(date).format("hh:mm a");
                            setStartTime(startTime);
                        }
                    }}
                    onCancel={() => {
                        showStartTimePicker(false)
                    }}
                />
                <DatePicker
                    modal
                    open={endTimePicker}
                    date={endDateProposed}
                    mode={"time"}
                    onConfirm={(date) => {
                        showEndTimePicker(false);
                        if (date.getTime() <= startDateProposed.getTime()) {
                            showToast(translations.propose_time)
                            return false;
                        } else {
                            setEndDateProposed(date);
                            var endTime = moment(date).format("hh:mm a");
                            setEndTime(endTime);
                        }
                    }}
                    onCancel={() => {
                        showEndTimePicker(false);
                    }}
                />
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: colors.white,
        paddingHorizontal: 16,
    },
    headerView: {
        backgroundColor: colors.white,
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    bottomView: {
        backgroundColor: colors.white,
        paddingVertical: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markJobAsCompleted: {
        marginVertical: 16,
        color: colors.job_completed_text_color,
    },
    monthName: {
        color: colors.today_text_color,
        fontSize: 14,
    },
    jobDetail: {
        marginVertical: 10,
        width: '100%',
        textAlign: 'center',
        color: colors.black,
        position: 'absolute',
    },
    acceptedJob: {
        marginVertical: 10,
        marginEnd: 16,
        position: 'absolute',
        right: 0,
        color: colors.accepted_job_text_color,
    },
    details: {
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: colors.white,
        flexDirection: 'column',
    },
    jobname: {
        paddingEnd: 16,
        paddingStart: 16,
    },
    location: {
        paddingVertical: 2,
        color: colors.today_text_color,
        paddingEnd: 16,
        paddingStart: 16,
    },
    timeJobContainer: {
        flexDirection: 'row',
        paddingStart: 16,
    },
    timeContainer: {
        flexDirection: 'row',
    },
    time: {
        marginVertical: 10,
        flex: 1,
        color: colors.time_text_color,
    },
    declineJob: {
        marginVertical: 10,
        paddingEnd: 16,
        color: colors.today_text_color,
    },
    statusContainer: {
        alignItems: 'center',
        paddingStart: 16,
        paddingEnd: 8,
    },
    status: {
        color: colors.black,
        flex: 1,
    },
    acceptedStatus: {
        color: colors.time_text_color,
        paddingEnd: 24,
    },
    alertStatus: {
        color: colors.time_text_color,
        paddingEnd: 8,
    },
    notesContainer: {
        marginHorizontal: 16,
        marginVertical: 8,
        paddingVertical: 8,
        paddingStart: 16,
        height: 230,
        backgroundColor: colors.white,
        borderRadius: 16,
    },
    notes: {
        color: colors.black,
        paddingBottom: 8,
    },
    notesInput: {
        marginHorizontal: 0,
        borderColor: colors.input_border_color,
        minHeight: 200,
        color: colors.black,
        paddingHorizontal: 8,
    },
    overlay: {
        backgroundColor: colors.white_10,
    },
    overlayBody: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 16,
        flex: 1,
        flexDirection: 'column',
    },

    containerDeclineDialog: {
        marginVertical: 16,
        borderRadius: 12,
        paddingEnd: 0,
        paddingVertical: 8,
        paddingStart: 24,
    },
    jobNameDecline: {
        paddingEnd: 16,
        paddingBottom: 8,
    },
    locationLine1Decline: {
        paddingEnd: 16,
        paddingTop: 4,
    },
    locationLine2Decline: {
        paddingEnd: 16,
        color: colors.time_text_color,
    },

    containerDecline2Dialog: {
        marginVertical: 16,
        borderRadius: 12,
        paddingVertical: 8,
    },
    proposeNewTimeTitle: {
        color: colors.propose_new_time_text_color,
        paddingBottom: 8,
        justifyContent: 'center',
    },
    startsTimeContainer: {
        paddingVertical: 8,
    },
    startsTimeLabel: {
        flex: 1,
        color: colors.black,
    },
    startsTimeDateLabel: {
        backgroundColor: colors.time_date_bg_color,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginHorizontal: 8,
        color: colors.black,
    },
    proposeNewTimeContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    proposeNewTime: {
        backgroundColor: colors.propose_new_time_bg_color,
        borderRadius: 8,
        paddingHorizontal: 16,
        alignSelf: 'baseline',
        justifyContent: 'center',
    },
    proposeNewTimeLabel: {
        color: colors.white,
    },
    confirmButton: {
        backgroundColor: colors.confirm_bg_color,
        borderRadius: 8,
        paddingHorizontal: 16,
        alignSelf: 'baseline',
        justifyContent: 'center',
    },
    markJobAsCompletedTitle: {
        color: colors.confirm_bg_color,
        paddingBottom: 8,
        justifyContent: 'center',
    },
    timeLineText1: {
        paddingHorizontal: 6,
        color: colors.black,
        width: 100,
    },
    timeLineText2: {
        marginVertical: 10,
        marginEnd: 16,
        position: 'absolute',
        right: 0,
        color: colors.accepted_job_text_color,
    },
    jobTitle: {
        color: colors.white,
    },
    closeIcon: {
        position: 'absolute',
        right: 20,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 2,
    }
});

export default JobDetailScreen;