import LocalizedStrings from 'react-native-localization';
export const DEFAULT_LANGUAGE = 'en';

const translations = {
    en: {
        app_name: 'WA FIRE',
        login: 'Login',
        username: 'Username',
        password: 'Password',
        login_: 'LOG IN',
        today: 'Today',
        inbox: 'Inbox',
        mark_job_completed: 'Mark Job As Completed',
        job_details: 'Job Details',
        accept_job: 'Accept Job',
        decline_job: 'Decline Job',
        status: 'Status',
        alert: 'Alert',
        attachments: 'Attachments',
        notes: 'Notes',
        accepted: 'Accepted',
        declined: 'Declined',
        add: 'Add',
        declineJobProposeNewTime: 'Decline Job & Propose New Time',
        starts: 'Starts',
        ends: 'Ends',
        proposeNewTime: 'Propose New Time',
        confirm: 'Confirm',
        replied: 'Replied',
        new_: 'New',
        invitations: 'INVITATIONS',
        invitedby: 'Invited by:',
        completed: 'Completed',
        accept: 'Accept',
        decline: 'Decline',
        email_required: 'Username required',
        password_required: 'Password required',
        email_invalid: 'Invalid Email',
        something_went_wrong: 'Something went wrong! try again',
        ok: 'Ok',
        from: 'from',
        to: 'to',
        pending: 'Pending',
        invoiced: 'Invoiced',
        no_attachment: 'No attachments',
        attached: 'Files attached',
        ongoing: 'Ongoing',
        at: 'at',
        no_jobs_available: 'No Jobs Available',
        logout: 'Logout',
        propose_date: 'The date must be bigger or equal to today date',
        propose_time: 'Invalid time',
        propose_time_invalid: 'Your proposed start and end date/time should be different to the original start date/time',
        at_time_of_event: 'At the time of event',
        add_attachment: 'Add Attachment',
        save: 'Save',
        back: 'Back',
        move_to_current_month: 'Move to current month of year',
        years: 'Years',
        year: 'Year',
        month: 'Month',
        weeks: 'Weeks',
        days: 'Days',
        enable_sound: 'Enable notification sounds and vibration from app settings.',
        settings: 'Settings.',
        error_add_one_photo: 'Add at least one photo',
        loading: 'Loading...',
        filed_to_upload: 'Failed to upload files',
        no_jobs: 'No jobs for this date',
        upload_file_limits: 'You can upload up to 5 images at the moment',
        upload_file_size_limits: 'Sorry, please upload a file of 10MB or less',
        wa_fire_app_permission: 'WA Fire App Permission',
        wa_fire_app_permission_gallery: 'WA Fire App needs access to your gallery',
        ask_me_later: 'Ask Me Later',
        cancel: 'Cancel',
        data: [
            {
                "time": "At the time of event",
                "value": 0
            },
            {
                "time": "5 Minutes before",
                "value": 5
            },
            {
                "time": "10 Minutes before",
                "value": 10
            },
            {
                "time": "15 Minutes before",
                "value": 15
            },
            {
                "time": "30 Minutes before",
                "value": 30
            },
            {
                "time": "1 Hour before",
                "value": 60
            },
            {
                "time": "2 Hour before",
                "value": 120
            },
            {
                "time": "1 Day before",
                "value": 1440
            },
            {
                "time": "2 Day before",
                "value": 2880
            },
            {
                "time": "1 Week before",
                "value": 10080
            }
        ],
        jobData: [
            {
                "id": 14,
                "company_name": "demo",
                "job_title": "Job 2",
                "job_location": "sgsfgg",
                "date_time_from": "2022-07-19 17:40:00",
                "date_time_to": "17:45:00",
                "is_accepted_by_coordinator": null
            },
            {
                "id": 15,
                "company_name": "demo",
                "job_title": "Job 2",
                "job_location": "sgsfgg",
                "date_time_from": "2022-07-19 17:40:00",
                "date_time_to": "17:45:00",
                "is_accepted_by_coordinator": null
            },
            {
                "id": 16,
                "company_name": "demo",
                "job_title": "Job 2",
                "job_location": "sgsfgg",
                "date_time_from": "2022-07-19 17:40:00",
                "date_time_to": "17:45:00",
                "is_accepted_by_coordinator": null
            }
        ],
        jobRepliedData: [
            {
                "id": 1,
                "company_name": "Unknown",
                "job_title": "Job 1",
                "job_location": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce commodo purus quis lacus placerat, at dapibus nisl faucibus. Pellentesque et nulla pulvinar, porttitor",
                "date_time_from": "2022-07-23 17:02:00",
                "date_time_to": "17:05:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 2,
                "company_name": "CrawlApps",
                "job_title": "Laravel",
                "job_location": "Surat",
                "date_time_from": "2022-07-14 15:13:00",
                "date_time_to": "15:13:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 3,
                "company_name": "Test Company",
                "job_title": "Test JOb",
                "job_location": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce commodo purus quis lacus placerat, at dapibus nisl faucibus. Pellentesque et nulla pulvinar, porttitor",
                "date_time_from": "2022-07-28 20:23:00",
                "date_time_to": "21:23:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 4,
                "company_name": "Demo",
                "job_title": "job 1",
                "job_location": "abcd",
                "date_time_from": "2022-07-18 14:15:00",
                "date_time_to": "13:00:00",
                "is_accepted_by_coordinator": 0
            },
            {
                "id": 5,
                "company_name": "demo",
                "job_title": "job 2",
                "job_location": "bfcb",
                "date_time_from": "2022-07-18 15:25:00",
                "date_time_to": "15:40:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 6,
                "company_name": "demo",
                "job_title": "job3",
                "job_location": "sdgdsfg",
                "date_time_from": "2022-07-18 16:00:00",
                "date_time_to": "16:10:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 7,
                "company_name": "demo",
                "job_title": "Job 4",
                "job_location": "regerg",
                "date_time_from": "2022-07-18 17:00:00",
                "date_time_to": "18:00:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 8,
                "company_name": "demo",
                "job_title": "Job 5",
                "job_location": "asdgfg",
                "date_time_from": "2022-07-18 15:55:00",
                "date_time_to": "16:15:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 9,
                "company_name": "demo",
                "job_title": "Job 6",
                "job_location": "fassdf",
                "date_time_from": "2022-07-18 16:07:00",
                "date_time_to": "16:20:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 10,
                "company_name": "demo",
                "job_title": "Job 7",
                "job_location": "asfasdfs",
                "date_time_from": "2022-07-18 16:25:00",
                "date_time_to": "16:30:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 11,
                "company_name": "demo",
                "job_title": "Job 8",
                "job_location": "asfef",
                "date_time_from": "2022-07-18 17:00:00",
                "date_time_to": "17:15:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 12,
                "company_name": "demo",
                "job_title": "Job 9",
                "job_location": "asfsdgs",
                "date_time_from": "2022-07-18 18:16:00",
                "date_time_to": "18:15:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 13,
                "company_name": "demo",
                "job_title": "Job 1",
                "job_location": "hsf",
                "date_time_from": "2022-07-19 16:00:00",
                "date_time_to": "16:30:00",
                "is_accepted_by_coordinator": 1
            },
            {
                "id": 15,
                "company_name": "demo",
                "job_title": "Job 3",
                "job_location": "ghgd",
                "date_time_from": "2022-07-21 16:00:00",
                "date_time_to": "16:30:00",
                "is_accepted_by_coordinator": 0
            },
            {
                "id": 16,
                "company_name": "Demo",
                "job_title": "Job 4",
                "job_location": "dgdgd",
                "date_time_from": "2022-07-22 17:19:00",
                "date_time_to": "19:20:00",
                "is_accepted_by_coordinator": 0
            },
            {
                "id": 17,
                "company_name": "Demo",
                "job_title": "Job 6",
                "job_location": "afasdf",
                "date_time_from": "2022-07-22 18:20:00",
                "date_time_to": "19:20:00",
                "is_accepted_by_coordinator": 0
            },
            {
                "id": 18,
                "company_name": "demo",
                "job_title": "Job 7",
                "job_location": "sdvdgv",
                "date_time_from": "2022-07-22 18:25:00",
                "date_time_to": "18:30:00",
                "is_accepted_by_coordinator": 0
            }
        ],
        months: [
            {
                "no": 0,
                "month": "January",
            },
            {
                "no": 1,
                "month": "February",
            },
            {
                "no": 2,
                "month": "March",
            },
            {
                "no": 3,
                "month": "April",
            },
            {
                "no": 4,
                "month": "May",
            },
            {
                "no": 5,
                "month": "June",
            },
            {
                "no": 6,
                "month": "July",
            },
            {
                "no": 7,
                "month": "August",
            },
            {
                "no": 8,
                "month": "September",
            },
            {
                "no": 9,
                "month": "October",
            },
            {
                "no": 10,
                "month": "November",
            },
            {
                "no": 11,
                "month": "December",
            }
        ]
    },
};

export default new LocalizedStrings(translations);