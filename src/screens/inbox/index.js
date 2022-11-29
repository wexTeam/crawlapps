import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CommonActions } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import HeaderView from "../../appcomponents/HeaderView";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import NewJobs from "./NewJobs";
import RepliedJobs from "./RepliedJobs";
import Icon from 'react-native-vector-icons/AntDesign';
import { Button } from '@rneui/themed';

const InboxScreen = ({ navigation, route }) => {

    const { translations } = useContext(LocalizationContext);
    const [refresh, setRefresh] = useState(true);
    const Tab = createMaterialTopTabNavigator();
    const [date, setDate] = useState(getInboxDate());

    function getInboxDate() {
        if (route?.params?.day) {
            return route?.params?.year + "-" + route?.params?.month + "-" + route?.params?.day;
        }
        return '';
    }

    const NewTabScreen = () => {
        return <NewJobs date={date} navigation={navigation} />
    }

    const RepliedTabScreen = () => {
        return <RepliedJobs date={date} navigation={navigation} />
    }

    function onBackPressed() {
        navigation.dispatch(CommonActions.goBack());
    }

    return (
        <View style={[Style.flex1Style, Style.screenBgColor]} >
            <HeaderView />
            <View style={[Style.flex1Style, styles.body]}>
                <Tab.Navigator
                    initialRouteName="NewJobs"
                    tabBarPosition="top"
                    tabBarOptions={{
                        activeTintColor: colors.black,
                        labelStyle: {
                            textTransform: "capitalize",
                        },
                        inactiveTintColor: colors.black,
                        indicatorStyle: {
                            height: null,
                            top: '15%',
                            bottom: '15%',
                            width: '45%',
                            left: '2.5%',
                            borderRadius: 10,
                            backgroundColor: colors.white,
                        },
                        style: {
                            alignSelf: "center",
                            width: '40%',
                            marginTop: 8,
                            marginBottom: 8,
                            borderRadius: 10,
                            height: 48,
                            backgroundColor: colors.tabbar_bg_color,
                        },
                    }}
                    swipeEnabled={true}
                >
                    <Tab.Screen name="New" component={NewTabScreen} />
                    <Tab.Screen name="Replied" component={RepliedTabScreen} />
                </Tab.Navigator>
                <View style={{
                    position: 'absolute',
                    left: 0,
                    top: 8,
                }}>
                    <Button type="clear"
                        titleStyle={styles.monthName}
                        onPress={onBackPressed}>
                        <Icon name="left" size={16} color={colors.today_text_color} />
                        {translations.back}
                    </Button>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: colors.screen_bg_color,
    }
    , monthName: {
        color: colors.today_text_color,
        fontSize: 14,
    },

});

export default InboxScreen;