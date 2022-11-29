import { CommonActions } from "@react-navigation/native";
import { Button } from "@rneui/base";
import { Divider } from "@rneui/themed";
import React, { useContext, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import HeaderView from "../../appcomponents/HeaderView";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";

const AlertSelectScreen = ({ navigation, route }) => {

    const { translations } = useContext(LocalizationContext);
    const [reminder, setReminder] = useState(route.params.eventTime);
    const [refresh, setRefresh] = useState(false);

    function onBackPressed() {
        navigation.dispatch(CommonActions.goBack());
    }

    function onItemClicked(item) {
        setReminder(item.value);
        setRefresh(!refresh);
        navigation.navigate({
            name: 'JobDetail',
            params: { eventTime: item.value },
            merge: true,
        });
    }

    const alertRenderItem = ({ item }) => (
        <View style={[Style.rowDirection, styles.alertTimeContainer]} >
            <TextComponent
                text={item.time}
                textStyle={[Style.mediumTextStyle, Style.text12Style, styles.alertTime]}
                onPress={() => {
                    onItemClicked(item);
                }}
            />
            {reminder === item.value ?
                <IconEntypo name="check" size={16} color={colors.today_text_color}
                    onPress={() => {
                        onItemClicked(item);
                    }} /> : null}
        </View>
    );

    return (
        <View style={[Style.flex1Style, Style.greyAppBackgroundStyle]} >
            <HeaderView />

            <View style={[Style.flex1Style]}>
                <View style={styles.headerView}>
                    <TextComponent
                        text={translations.alert}
                        textStyle={[Style.boldTextStyle, Style.text14Style, styles.jobDetail]}
                    />
                    <Button type="clear"
                        titleStyle={styles.monthName}
                        onPress={onBackPressed}>
                        <Icon name="left" size={16} color={colors.today_text_color} />
                        {translations.job_details}
                    </Button>
                </View>
                <View style={[styles.notesContainer]}>
                    <FlatList
                        data={translations.data}
                        key={(item, index) => index.toString()}
                        scrollEventThrottle={16}
                        extraData={true}
                        ItemSeparatorComponent={(e) => <Divider />}
                        removeClippedSubviews={true}
                        contentContainerStyle={styles.scrollViewContent}
                        renderItem={alertRenderItem}
                        keyExtractor={item => item.value}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerView: {
        alignItems: 'flex-start',
        flexDirection: 'row',
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
    notesContainer: {
        marginHorizontal: 16,
        marginVertical: 12,
        paddingVertical: 8,
        paddingStart: 12,
        backgroundColor: colors.white,
        borderRadius: 16,
    },
    scrollViewContent: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingLeft: 20,
    },
    alertTimeContainer: {
        paddingVertical: 12,
        paddingEnd: 16
    },
    alertTime: {
        color: colors.black,
        flex: 1,
    },

});

export default AlertSelectScreen;