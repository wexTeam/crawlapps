import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from '../../css/colors';
import { Style } from '../../css/styles';
import { LocalizationContext } from "../../locale/LocalizationContext";
import * as api from '../../request';
import JobList from './JobList';
import { refreshInbox, resetInbox } from '../../redux/features/inboxSlices';

const RepliedJobs = ({ navigation, date }) => {

    const { translations } = useContext(LocalizationContext);
    const [jobs, setJobs] = useState(null);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const [email, setEmail] = useState('');
    const currentPage = useRef(0);
    const total = useRef(0);
    const nextPage = useRef(null);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (isFocused) {
            currentPage.current = 0;
            total.current = 0;
            nextPage.current = null;
            getJobList();
        }
    }, [isFocused]);

    function loadMoreEvents() {
        if (jobs != null && jobs.length < total.current) {
            setLoader(true);
            getJobList();
        }
    }

    async function getJobList() {
        var response = await api.getEventList(0, date, nextPage.current);
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

    return (
        <View style={[Style.flex1Style, styles.body]}>
            <JobList
                navigation={navigation}
                email={email}
                jobList={jobs}
                loader={loader}
                loadMore={() => {
                    loadMoreEvents();
                }}
                jobType={'replied'} />
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

export default RepliedJobs;