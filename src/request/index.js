
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, StackActions } from '@react-navigation/native';
import { Platform } from 'react-native';
import OneSignal from 'react-native-onesignal';
import { navigationRef } from '../navigation/RootNavigation';
import { BASE_URL } from '../utils/AppUtils';


const productionURL = BASE_URL;

const urlPrefix = productionURL;

/*-------------------------------*/
/* C L E A R   U S E R   D A T A */
/*-------------------------------*/
export async function clearUserData() {
    try {
        const asyncStorageKeys = await AsyncStorage.getAllKeys();
        if (asyncStorageKeys.length > 0) {
            await AsyncStorage.clear()
        }
        // OneSignal.disablePush(true);
        OneSignal.deleteTag("user_id");
    } catch (e) {

    } finally {
        // if (navigationRef.current) {
        //   navigationRef.current.dispatch(StackActions.replace('Login'));
        // }
    }
}

/*-----------------------------*/
/* G E T   U R L   P R E F I X */
/*-----------------------------*/
export function getUrlPrefix(isAPICall = true) {
    return isAPICall ? `${urlPrefix}api/` : urlPrefix;
}

/*-----------*/
/* L O G I N */
/*-----------*/
export async function login(email1, password) {
    const user = { email: email1, password: password };
    var loginUrl = getUrlPrefix() + 'v1/login';
    const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    try {
        if (response != null) {
            var json = await response.json();
            return json;
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

export async function getYearlyEvents(year) {
    var token = await AsyncStorage.getItem('token');
    const response = await fetch(getUrlPrefix() + 'v1/events/' + year, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });
    try {
        if (response != null) {
            if (response.status === 401) {
                var refreshResponse = await refreshToken();
                if (refreshResponse === null) {
                    logout();
                    return {};
                } else {
                    return await getYearlyEvents(year);
                }
            } else {
                var json = await response.json();
                return json;
            }
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

export async function getJobDetail(eventId) {
    var token = await AsyncStorage.getItem('token');
    const response = await fetch(getUrlPrefix() + 'v1/job-details/' + eventId, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });
    try {
        if (response != null) {
            if (response.status === 401) {
                var refreshResponse = await refreshToken();
                if (refreshResponse === null) {
                    logout();
                    return {};
                } else {
                    return await getJobDetail(eventId);
                }
            } else {
                var json = await response.json();

                return json;
            }
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

async function logout() {
    await clearUserData();
    navigationRef.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }]
        }));
}

export async function getEventList(jobType, date, nextPage) {
    var token = await AsyncStorage.getItem('token');
    var url = "";
    if (nextPage == null) {
        if (date === null || date === undefined || date == '') {
            url = getUrlPrefix() + 'v1/inbox/' + jobType;
        } else {
            url = getUrlPrefix() + 'v1/inbox/' + jobType + '?date=' + date;
        }
    } else {
        url = nextPage;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });
    try {
        if (response != null) {
            if (response.status === 401) {
                var refreshResponse = await refreshToken();
                if (refreshResponse === null) {
                    logout();
                    return {};
                } else {
                    return await getEventList();
                }
            } else {
                var json = await response.json();
                return json;
            }
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

export async function acceptJobStatus(id_) {
    var token = await AsyncStorage.getItem('token');
    const eventDetail = { id: id_ };
    const response = await fetch(getUrlPrefix() + 'v1/job-accept', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(eventDetail)
    });
    try {
        if (response != null) {
            if (response.status === 401) {
                var refreshResponse = await refreshToken();
                if (refreshResponse === null) {
                    logout();
                    return {};
                } else {
                    return await acceptJobStatus(id_);
                }
            } else {
                var json = await response.json();
                return json;
            }
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

export async function declineJobStatus(id_, preffered_from_, preffered_to_) {
    var token = await AsyncStorage.getItem('token');
    const eventDetail = { id: id_, preffered_from: preffered_from_, preffered_to: preffered_to_ };
    const response = await fetch(getUrlPrefix() + 'v1/job-decline', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(eventDetail)
    });
    try {
        if (response != null) {
            if (response.status === 401) {
                var refreshResponse = await refreshToken();
                if (refreshResponse === null) {
                    logout();
                    return {};
                } else {
                    return await declineJobStatus(id_, preffered_from_, preffered_to_);
                }
            } else {
                var json = await response.json();
                return json;
            }
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

export async function refreshToken() {
    var refresh_token_ = await AsyncStorage.getItem('refresh_token');
    if (refresh_token_ != null) {
        const refreshToken = { refresh_token: refresh_token_ };
        const response = await fetch(getUrlPrefix() + 'v1/refresh-tokens', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(refreshToken)
        });
        if (response != null) {
            var json = await response.json();
            if (response.status === 422) {
                return null;
            }
            await saveUserDetail(json);
            return json;
        }
    }
    return null;
}

export async function confirmEvent(eventId, note, eventTime, attachment = [], deleted = []) {
    var token = await AsyncStorage.getItem('token');
    let formdata = new FormData();
    formdata.append("id", eventId);
    formdata.append("notes", note);
    formdata.append("coordinator_reminder_minuts", eventTime);
    attachment.map(atc => {
        if (atc.uri != null) {
            const file = {
                uri: (Platform.OS === 'iOS' ? atc.uri.replace("file://", "") : atc.uri),
                type: atc.type,
                name: atc.filename
            };
            formdata.append('attachments[]', file);
        }
    });
    if (deleted.length > 0) {
        deleted.map(atc => {
            formdata.append('deleted_attachments[]', atc);
        });
    } else {
        formdata.append('deleted_attachments[]', []);
    }
    const response = await fetch(getUrlPrefix() + 'v1/job-update', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data;',
            'Authorization': 'Bearer ' + token
        },
        body: formdata,
    })
    try {
        if (response != null) {
            if (response.status === 401) {
                var refreshResponse = await refreshToken();
                if (refreshResponse === null) {
                    logout();
                    return {};
                } else {
                    return await confirmEvent(eventId, note, reminder);
                }
            } else {
                var json = await response.json();
                return json;
            }
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

export async function completeEvent(eventId) {
    var token = await AsyncStorage.getItem('token');

    const eventDetail = { id: eventId };

    const response = await fetch(getUrlPrefix() + 'v1/job-complete', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(eventDetail)
    });
    try {
        if (response != null) {
            if (response.status === 401) {
                var refreshResponse = await refreshToken();
                if (refreshResponse === null) {
                    logout();
                    return {};
                } else {
                    return await completeEvent(eventId);
                }
            } else {
                var json = await response.json();
                return json;
            }
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

export async function addAttachment(eventId, note, eventTime, atc, deleted = []) {
    var token = await AsyncStorage.getItem('token');

    const xhr = new XMLHttpRequest();

    let formdata = new FormData();
    formdata.append("id", eventId);
    formdata.append("notes", note);
    formdata.append("coordinator_reminder_minuts", eventTime);
    const file = {
        uri: (Platform.OS === 'iOS' ? atc.uri.replace("file://", "") : atc.uri),
        type: atc.type,
        name: atc.filename
    };
    formdata.append('attachments[]', file);
    if (deleted.length > 0) {
        deleted.map(atc => {
            formdata.append('deleted_attachments[]', atc);
        });
    } else {
        formdata.append('deleted_attachments[]', []);
    }
    xhr.open('POST', getUrlPrefix() + 'v1/job-update');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.send(formdata);
    return xhr;
}

export async function getEventsByDate(date) {
    var token = await AsyncStorage.getItem('token');
    const response = await fetch(getUrlPrefix() + 'v1/event/date/' + date, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    });
    try {

        if (response != null) {
            if (response.status === 401) {
                var refreshResponse = await refreshToken();
                if (refreshResponse === null) {
                    logout();
                    return {};
                } else {
                    return await getEventsByDate(date);
                }
            } else {
                var json = await response.json();
                return json;
            }
        }
    } catch (err) {
        console.error(err);
    }
    return null;
}

async function saveUserDetail(json) {
    AsyncStorage.setItem('user', json.data.toString());
    AsyncStorage.setItem('token', json.data.access_token.toString());
    AsyncStorage.setItem('refresh_token', json.data.access_token.toString());
}



