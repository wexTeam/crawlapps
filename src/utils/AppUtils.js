import moment from "moment";
import React from "react";

const BASE_URL = "https://calendar.wa-fire.com.au/";

function getAlertInString(eventTime, data) {
    var time = "";
    data.map(alert => {
        if (alert.value === eventTime) {
            time = alert.time;
        }
    });
    return time;
}

function getJobDay(item, translations) {
    if (item != null && item.date_time_from) {
        var eventDate = moment(item.date_time_from, 'YYYY-MM-DD HH:mm:ss').toDate();
        var formatted = moment(eventDate).format('ddd, DD MMM YYYY');

        var eventToTime = moment(item.date_time_to, 'HH:mm:ss').toDate();
        var startTime = moment(eventDate).format('hh:mm a');
        var endTime = moment(eventToTime).format('hh:mm a');
        return formatted + " " + translations.at + " " + startTime + " " + translations.to + " " + endTime;
    }
    return "";
}

function getStartTime(item) {
    if (item != null && item.date_time_from) {
        var eventDate = moment(item.date_time_from, 'YYYY-MM-DD HH:mm:ss').toDate();
        var startTime = moment(eventDate).format('hh:mm a');
        return startTime;
    }
    return "";
}

function getEndTime(item) {
    if (item != null && item.date_time_from) {
        var eventToTime = moment(item.date_time_to, 'HH:mm:ss').toDate();
        var endTime = moment(eventToTime).format('hh:mm a');
        return endTime;
    }
    return "";
}

function getBytesInSize(sizeInBytes) {
    var sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    return sizeInMB;
}

export { getAlertInString, getJobDay, getStartTime, getEndTime, BASE_URL, getBytesInSize } 