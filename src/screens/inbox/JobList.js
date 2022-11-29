import { Divider } from "@rneui/themed";
import React, { useContext, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import { getJobDay } from "../../utils/AppUtils";

const JobList = ({ navigation, jobList, jobType, email, loadMore, loader }) => {

    const { translations } = useContext(LocalizationContext);

    function getAcceptedLabel(status_by_coordinator) {
        if (jobType === 'replied' &&
            status_by_coordinator != null &&
            status_by_coordinator === 1) {
            return translations.accepted;
        }
        return translations.accept;
    }

    function getAcceptedStyle(status_by_coordinator) {
        if (jobType === 'replied' &&
            status_by_coordinator != null &&
            status_by_coordinator === 1) {
            return [Style.mediumTextStyle, Style.text12Style, styles.jobAcceptedText];
        }
        return [Style.mediumTextStyle, Style.text12Style, styles.jobAcceptText];
    }

    function getDeclinedLabel(status_by_coordinator) {
        if (jobType === 'replied' &&
            status_by_coordinator != null &&
            status_by_coordinator === 0) {
            return translations.declined;
        }
        return translations.decline;
    }

    function getDeclinedStyle(status_by_coordinator) {
        if (jobType === 'replied' &&
            status_by_coordinator != null &&
            status_by_coordinator === 0) {
            return [Style.mediumTextStyle, Style.text12Style, styles.jobDeclinedText];
        }
        return [Style.mediumTextStyle, Style.text12Style, styles.jobDeclineText];
    }

    function onEventItemClicked(item) {
        navigation.navigate('JobDetail', { event: item })
    }

    function onEventAcceptClicked(item) {
        // if (jobType === 'replied') {
        //     return;
        // }
        // onAccept(item);
        navigation.navigate('JobDetail', { event: item })
    }

    function onEventDeclineClicked(item) {
        // if (jobType === 'replied') {
        //     return;
        // }
        // onDecline(item);
        navigation.navigate('JobDetail', { event: item })
    }

    const jobRenderItem = ({ item }) => (

        <TouchableWithoutFeedback
            onPress={() => {
                onEventItemClicked(item);
            }}>
            <View style={[Style.rowDirection, styles.itemContainer]}>
                <Divider width={3}
                    color={colors.dividerStrip}
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
                            text={translations.invitedby + " " + email}
                            textStyle={[Style.mediumTextStyle, Style.text10Style, styles.jobByText]}
                            onPress={() => {
                                onEventItemClicked(item);
                            }}
                        />
                    </View>
                    <TextComponent
                        text={item.job_location}
                        textStyle={[Style.mediumTextStyle, Style.text12Style, styles.jobLocationText]}
                        noOfLine={2}
                        onPress={() => {
                            onEventItemClicked(item);
                        }}
                    />
                    <TextComponent
                        text={getJobDay(item, translations)}
                        textStyle={[Style.mediumTextStyle, Style.text12Style, styles.jobTime]}
                        noOfLine={2}
                        onPress={() => {
                            onEventItemClicked(item);
                        }} />
                    <View style={Style.rowDirection}>
                        <TextComponent
                            text={getAcceptedLabel(item.is_accepted_by_coordinator)}
                            textStyle={getAcceptedStyle(item.is_accepted_by_coordinator)}
                            noOfLine={2}
                            onPress={() => {
                                onEventAcceptClicked(item);
                            }}
                        />
                        <TextComponent
                            text={getDeclinedLabel(item.is_accepted_by_coordinator)}
                            textStyle={getDeclinedStyle(item.is_accepted_by_coordinator)}
                            noOfLine={2}
                            onPress={() => {
                                onEventDeclineClicked(item);
                            }}
                        />
                    </View>
                </View>
                <Icon name="right" size={16} color={colors.time_text_color} />
            </View>
        </TouchableWithoutFeedback>
    );

    const PlaceHolderView = () => {
        return (<View style={styles.noJobAvailableContainer}>
            <TextComponent text={translations.no_jobs_available}
                textStyle={[Style.mediumTextStyle, Style.text14Style, styles.noJobAvailable]} />
        </View>)
    };

    const onLoadMore = () => {
        loadMore()
    }

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
                            jobList.length === 0 ?
                                (<PlaceHolderView />)
                                : (loader) ?
                                    <ActivityIndicator color={colors.today_text_color} size={"large"} /> : null
                    }}
                    onEndReached={onLoadMore}
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


{/* <FlatList
        key={"customer_"}
        style={[s.listStyle]}
        removeClippedSubviews={true}
        numColumns={1}
        data={customersList ? customersList : null}
        refreshing={isRefreshing}
        renderItem={renderItem}
        keyExtractor={item => "customer_" + item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={60}
        initialNumToRender={30}
        windowSize={1000}
        ListFooterComponent={
          customersList.length > 0 && isSearchLoading ? (
            <View style={[s.footerLoading]}>
              <ActivityIndicator size="large" color={colors.primaryFemale} />
            </View>
          ) : null
        }
      /> */}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    itemContainer: {
        paddingHorizontal: 16,
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
    },
    jobByText: {
        color: colors.job_location_text_color,
    },
    jobLocationText: {
        paddingVertical: 4,
        color: colors.today_text_color,
        paddingStart: 8,
        paddingEnd: 16,
    },
    jobTime: {
        marginVertical: 4,
        flex: 1,
        color: colors.black,
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

export default JobList;