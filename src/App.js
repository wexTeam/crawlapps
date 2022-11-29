/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef } from 'react';

import { NavigationContainer, StackActions, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    SafeAreaView, StyleSheet,
    Vibration,
    View
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import { Provider } from 'react-redux';
import { AppTheme } from './css/theme';
import { LocalizationProvider } from './locale/LocalizationContext';
import { store } from './redux/store';
import CalendarScreen from './screens/calendar';
import InboxScreen from './screens/inbox';
import JobDetailScreen from './screens/jobdetail';
import LoginScreen from './screens/login';
import AlertSelectScreen from './screens/reminder';
import { navigationRef } from './navigation/RootNavigation';
import AttachmentScreen from './screens/attachment';

const Stack = createNativeStackNavigator();

const App = () => {

    useEffect(() => {
        //OneSignal Init Code
        OneSignal.setLogLevel(6, 0);
        OneSignal.setAppId("d966ac82-6d8c-488c-894b-8b32d9626957");
        //END OneSignal Init Code

        OneSignal.onNo

        //Method for handling notifications received while app in foreground
        OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
            Vibration.vibrate(1500, true);
            // console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
            // let notification = notificationReceivedEvent.getNotification();
            // console.log("notification: ", notification);
            // const data = notification.additionalData
            // console.log("additionalData: ", data);
            // // Complete with null means don't show a notification.
            // notificationReceivedEvent.complete(notification);
        });

        //Method for handling notifications opened
        OneSignal.setNotificationOpenedHandler(notification => {
            OneSignal.clearOneSignalNotifications();

            if (notification) {
                try {
                    var eventId = notification?.notification?.additionalData?.id;
                    if (eventId > 0) {
                        navigationRef.navigate({
                            name: 'JobDetail',
                            params: { event: notification?.notification?.additionalData },
                            key: eventId + "_" + Math.random() * 10000,
                            merge: true,
                        });
                    }
                } catch (err) {
                }
            }
        });

    }, [])
    return (
        <View style={styles.backgroundStyle}>
            <Provider store={store}>
                <LocalizationProvider>
                    <SafeAreaView style={styles.backgroundStyle}>
                        <NavigationContainer theme={AppTheme} ref={navigationRef} >
                            <Stack.Navigator screenOptions={headerStyle}  >
                                <Stack.Screen name="Login" component={LoginScreen} />
                                <Stack.Screen name="Calendar" component={CalendarScreen} />
                                <Stack.Screen name="JobDetail" component={JobDetailScreen} />
                                <Stack.Screen name="Alerts" component={AlertSelectScreen} />
                                <Stack.Screen name="Inbox" component={InboxScreen} />
                                <Stack.Screen name="Attachments" component={AttachmentScreen} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </SafeAreaView>
                </LocalizationProvider>
            </Provider>
        </View>
    );
};

const headerStyle = {
    headerShown: false
};

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
    },
});

export default App;
