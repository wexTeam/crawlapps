import { Divider } from "@rneui/themed";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import { getJobDay, getStartTime, getEndTime } from "../../utils/AppUtils";

const CalendarJobList = ({ navigation, jobList, loader }) => {

    const { translations } = useContext(LocalizationContext);

    function getEventDividerColor(is_accepted_by_coordinator, status) {
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

    function onEventItemClicked(item) {
        navigation.navigate('JobDetail', { event: item })
    }

    const jobRenderItem = ({ item }) => (

        <TouchableWithoutFeedback
            onPress={() => {
                onEventItemClicked(item);
            }}>
            <View style={[Style.rowDirection, styles.itemContainer]}>
                <Divider width={3}
                    color={getEventDividerColor(item.is_accepted_by_coordinator, item.status)}
                    style={styles.jobItemHorizontalDivider}
                    orientation={"vertical"} />
                <View style={Style.flex1Style}>
                    <View style={[Style.flex1Style, styles.jobContainer]}>
                        <TextComponent
                            text={item.company_name + " - " + item.job_title}
                            textStyle={[Style.mediumTextStyle, Style.text12Style, styles.jobTitleText]}
                            onPress={() => {
                                onEventItemClicked(item);
                            }}
                        />

                        <TextComponent
                            text={getStartTime(item)}
                            textStyle={[Style.mediumTextStyle, Style.text12Style, styles.jobTime]}
                            noOfLine={2}
                            onPress={() => {
                                onEventItemClicked(item);
                            }} />

                    </View>
                    <View style={[Style.flex1Style, styles.jobContainer]}>
                        <TextComponent
                            text={item.job_location}
                            textStyle={[Style.mediumTextStyle, Style.text12Style, styles.jobLocationText]}
                            onPress={() => {
                                onEventItemClicked(item);
                            }}
                        />

                        <TextComponent
                            text={getEndTime(item)}
                            textStyle={[Style.mediumTextStyle, Style.text12Style, styles.jobEndTime]}
                            noOfLine={2}
                            onPress={() => {
                                onEventItemClicked(item);
                            }} />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    const PlaceHolderView = () => {
        return (<View style={styles.noJobAvailableContainer}>
            <TextComponent text={translations.no_jobs}
                textStyle={[Style.mediumTextStyle, Style.text14Style, styles.noJobAvailable]} />
        </View>)
    };

    return (
        <View style={[Style.flex1Style,]} >
            <View style={[Style.flex1Style]}>
                {jobList != null && jobList.length > 0 ?
                    <Divider /> : null}

                <FlatList
                    data={jobList ? jobList : []}
                    key={(item, index) => index.toString()}
                    bounces={false}
                    initialNumToRender={20}
                    scrollEventThrottle={16}
                    ListFooterComponent={() => {
                        return (jobList === null) ?
                            (<ActivityIndicator color={colors.today_text_color} size={"large"} />) :
                            (jobList.length === 0 && !loader) ?
                                (<PlaceHolderView />)
                                : (loader) ?
                                    <ActivityIndicator color={colors.today_text_color} size={"large"} /> : null
                    }}
                    onEndReachedThreshold={0.5}
                    ItemSeparatorComponent={(e) => <Divider />}
                    removeClippedSubviews={true}
                    contentContainerStyle={styles.scrollViewContent}
                    renderItem={jobRenderItem}
                    keyExtractor={item => item.id}
                />
                {jobList != null && jobList.length > 0 ?
                    <Divider /> : null}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    scrollViewContent: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    itemContainer: {
        paddingStart: 8,
        paddingVertical: 8,
        backgroundColor: colors.white,
    },
    jobItemHorizontalDivider: {
        borderRadius: 3,
    },
    jobContainer: {
        paddingHorizontal: 8,
    },
    jobTitleText: {
        color: colors.black,
        flex: 1,
    },
    jobByText: {
        color: colors.job_location_text_color,
    },
    jobLocationText: {
        color: colors.time_text_color,
        paddingEnd: 16,
    },
    jobTime: {
        marginVertical: 4,
        flex: 1,
        right: 0,
        position: 'absolute',
        color: colors.black,
        paddingStart: 8,
        paddingEnd: 16,
    },
    jobEndTime: {
        marginVertical: 4,
        flex: 1,
        right: 0,
        position: 'absolute',
        color: colors.time_text_color,
        paddingStart: 8,
        paddingEnd: 16,
    },
    jobAcceptText: {
        marginVertical: 4,
        color: colors.accepted_job_text_color,
        paddingVertical: 4,
        marginStart: 8,
    },
    jobAcceptedText: {
        marginVertical: 4,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: colors.accepted_job_text_color,
        color: colors.white,
        marginStart: 8,
    },
    jobDeclineText: {
        marginVertical: 4,
        color: colors.today_text_color,
        position: 'absolute',
        paddingVertical: 4,
        right: 0,
    },
    jobDeclinedText: {
        marginVertical: 4,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: colors.today_text_color,
        color: colors.white,
        position: 'absolute',
        right: 0,
    },
    noJobAvailableContainer: {
        alignItems: 'center',
        padding: 24,
    },
    noJobAvailable: {
        color: colors.black,
    },

});

export default CalendarJobList;