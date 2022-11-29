import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, Platform, StyleSheet, ToastAndroid, View } from "react-native";
import { useDispatch } from 'react-redux';
import DialogErrorView from '../../appcomponents/DialogErrorView';
import DialogView from '../../appcomponents/DialogView';
import TextComponent from '../../components/TextComponent';
import { colors } from '../../css/colors';
import { Style } from '../../css/styles';
import { LocalizationContext } from "../../locale/LocalizationContext";
import { refreshInbox, resetInbox } from '../../redux/features/inboxSlices';
import * as api from '../../request';
import JobList from './JobList';


const NewJobs = ({ navigation, date }) => {

    const isFocused = useIsFocused();
    const { translations } = useContext(LocalizationContext);
    const [jobs, setJobs] = useState(null);
    const [errorText, setErrorText] = useState(null);
    const [progress, setProgressBar] = useState(false);
    const [email, setEmail] = useState('');
    const [loader, setLoader] = useState(true);
    const nextPage = useRef(null);

    const dispatch = useDispatch();
    const currentPage = useRef(0);
    const total = useRef(0);

    useEffect(() => {
        if (isFocused) {
            currentPage.current = 0;
            total.current = 0;
            nextPage.current = null;
            getJobList();
        }
    }, [isFocused]);

    async function getJobList() {
        var response = await api.getEventList(1, date, nextPage.current);
        // setProgressBar(false);
        setLoader(false);
        if (response === null) {
            if (currentPage.current === 0) {
                dispatch(resetInbox());
                setJobs([]);
            }
        } else {
            if (response.success && response.data != null && response.data.events != null && response.data.events.length > 0) {
                nextPage.current = response?.data?.pagination?.next_page_url;
                if (currentPage.current === 0) {
                    currentPage.current = currentPage.current + 1;
                    dispatch(resetInbox());
                    total.current = response?.data?.pagination?.total;
                    setEmail(response?.data?.manager?.email)
                    setJobs(response.data.events)
                } else {
                    currentPage.current = currentPage.current + 1;
                    setJobs([...jobs, ...response.data.events]);
                }
            } else {
                if (currentPage.current === 0) {
                    dispatch(resetInbox());
                    setJobs([]);
                }
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

    // async function acceptEvent(item) {
    //     setProgressBar(true);
    //     var response = await api.acceptJobStatus(item.id);
    //     setProgressBar(false);
    //     if (response != null) {
    //         if (response.success === true) {
    //             dispatch(refreshInbox());
    //             showToast(response.message)
    //             setNextPage(null);
    //             setCurrentPage(0);
    //             getJobList();

    //         } else {
    //             setErrorText(response.message)
    //         }
    //     }
    // }

    function loadMoreEvents() {
        if (jobs != null && jobs.length != total.current) {
            setLoader(true);
            getJobList();
        }
    }

    // async function declineEvent(item) {
    //     setProgressBar(true);
    //     var response = await api.declineJobStatus(item.id, "2022-07-21 16:00:00", "17:00:00");
    //     setProgressBar(false);
    //     if (response != null) {
    //         if (response.success === true) {
    //             showToast(response.message)
    //             setNextPage(null);
    //             setCurrentPage(0);
    //             getJobList();
    //         } else {
    //             setErrorText(response.message)
    //         }
    //     }
    // }

    return (
        <View style={[Style.flex1Style, styles.body]}>
            <View style={[styles.inboxContainer]}>
                <TextComponent text={translations.inbox}
                    textStyle={[Style.boldTextStyle, Style.text18Style, styles.inboxText]} />
            </View>
            <TextComponent text={translations.invitations}
                textStyle={[Style.regularTextStyle, Style.text12Style, styles.invitationText]} />

            <JobList
                navigation={navigation}
                jobList={jobs}
                email={email}
                loader={loader}
                // onAccept={((item) => {
                //     acceptEvent(item);
                // })}
                // onDecline={((item) => {
                //     declineEvent(item);
                // })}
                loadMore={() => {
                    loadMoreEvents();
                }}
                jobType={'new'} />
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
        backgroundColor: colors.screen_bg_color,
    },
    inboxText: {
        paddingVertical: 8,
        color: colors.black,
    },
    invitationText: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: colors.time_text_color,
    },
    inboxContainer: {
        alignItems: 'center',
    }

});

export default NewJobs;