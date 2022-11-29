import { CommonActions } from "@react-navigation/native";
import { Button } from "@rneui/base";
import { Divider } from "@rneui/themed";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Modal, PermissionsAndroid, Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import HeaderView from "../../appcomponents/HeaderView";
import ButtonComponent from "../../components/ButtonComponent";
import TextComponent from "../../components/TextComponent";
import { colors } from "../../css/colors";
import { Style } from "../../css/styles";
import { LocalizationContext } from "../../locale/LocalizationContext";
import ImagePicker from 'react-native-image-crop-picker';
import DialogErrorView from "../../appcomponents/DialogErrorView";
import * as api from '../../request';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL, getBytesInSize } from "../../utils/AppUtils";

const AttachmentScreen = ({ navigation, route }) => {

    const { translations } = useContext(LocalizationContext);

    const [attachments, setAttachments] = useState(route.params.attachments);
    const [errorText, setErrorText] = useState(null);
    const [progress, setProgressBar] = useState(false);

    const [deleted, setDeleted] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        refreshData(false);
    }, [])

    async function refreshData(refresh) {
        if (refresh == true) {
            await AsyncStorage.setItem('refresh', "true");
        } else {
            await AsyncStorage.setItem('refresh', "false");
        }
    }

    function onBackPressed() {
        navigation.dispatch(CommonActions.goBack());
    }

    function onDeleted(item) {
        var newAttachment = [];
        attachments.map(imgs => {
            if (imgs.uri != null && imgs.uri.toString() == item.uri?.toString()) {
            } else if (imgs.url != null && imgs.url == item.url) {
                deleted.push(item.url);
            } else {
                newAttachment.push(imgs);
            }
        });
        confirmEvent(newAttachment);
    }

    async function confirmEvent(newAttachment) {
        var note = route?.params?.note;
        if (note == null) {
            note = '';
        }
        setProgressBar(true);
        var response = await api.confirmEvent(route?.params?.eventId, note, route?.params?.eventTime, [], deleted);
        setProgressBar(false);
        if (response != null) {
            if (response.success === true) {
                // refreshed_.current = true;
                showToast(response.message)
                setAttachments(newAttachment);
                refreshData(true);
            } else {
                setErrorText(response.message)
            }
        }
    }
    const attachmentRenderItem = ({ item }) => (
        <TouchableOpacity
            style={{
                flex: 1 / 3, //here you can use flex:1 also
                aspectRatio: 1,
                margin: 4,
                backgroundColor: colors.time_date_bg_color,
            }}>

            {/* <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text>{translations.loading}</Text>
            </View> */}

            {item.uri != null ?
                <Image style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, }} resizeMode='contain' source={{ uri: item.uri }}></Image>
                : <Image style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, }} resizeMode='contain' source={{ uri: item.url }}></Image>}

            <IconMaterial name={'delete'} size={20} color={colors.red} style={{
                position: 'absolute',
                right: 4,
                top: 4,
            }}
                onPress={() => {
                    onDeleted(item);
                }} />
        </TouchableOpacity>
    );

    async function onSaveClicked(attachmentsPicked) {
        if (attachmentsPicked.length > 0) {
            var attachment = [];
            attachmentsPicked.map(imgs => {
                attachment.push(imgs);
            })
            if (attachment.length > 0) {
                setModalVisible(true);
                await addAttachment(route?.params?.eventId, route?.params?.note, route?.params?.eventTime, attachment, deleted);
            }
        } else {
            showToast(translations.error_add_one_photo);
        }
    }

    async function addAttachment(eventId, note, eventTime, attachment, deleted = []) {
        if (note == null) {
            note = '';
        }
        var token = await AsyncStorage.getItem('token');
        const xhr = new XMLHttpRequest();
        let formdata = new FormData();
        formdata.append("id", eventId);
        formdata.append("notes", note);
        formdata.append("coordinator_reminder_minuts", eventTime);
        if (attachment.length > 0) {
            attachment.map(atc => {
                if (atc.uri != null) {
                    var uri_ = (Platform.OS === 'android' ? atc.uri : atc.uri.replace("file://", ""));
                    const file = {
                        uri: uri_,
                        type: atc.type,
                        name: atc.filename
                    };
                    console.log(file);
                    formdata.append('attachments[]', file);
                }
            });
        } else {
            formdata.append('attachments[]', []);
        }
        if (deleted.length > 0) {
            deleted.map(atc => {
                formdata.append('deleted_attachments[]', atc);
            });
        } else {
            formdata.append('deleted_attachments[]', []);
        }
        xhr.upload.addEventListener('progress', events => {
            if (events.lengthComputable) {
                var percentComplete = Math.ceil((events.loaded / events.total) * 100);
                setUploadProgress(percentComplete);
            }

        });
        xhr.addEventListener('load', () => {
            setModalVisible(false);
            setUploadProgress(100);
            var response = JSON.parse(xhr.response);
            if (response != null) {
                if (response.success === true) {
                    showToast(response.message);
                    refreshData(true);
                    getJobDetail();
                } else {
                    setErrorText(response.message)
                }
            }
        });
        xhr.open('POST', BASE_URL + 'api/v1/job-update');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send(formdata);
        return null;
    }

    async function getJobDetail() {
        setProgressBar(true);
        var response = await api.getJobDetail(route?.params?.eventId);
        setProgressBar(false);
        if (response == null) {
            setErrorText(translations.something_went_wrong);
        } else {
            if (response.success && response.data != null && response.data.event != null) {
                var attachment = [];
                response?.data?.event?.attached.map(img => {
                    attachment.push({
                        url: img,
                        uri: null,
                        filename: null,
                        type: null,
                    })
                })
                setAttachments(attachment);
            } else {
                setErrorText(response.message);
            }
        }
    }

    async function openGallery() {
        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
            forceJpg: false
        }).then(images => {
            if (images != null && images.length > 0) {
                if (images.length <= 5) {
                    var attachmentsPicked = [];
                    attachments.map(img => {
                        attachmentsPicked.push(img);
                    })
                    var hasAllValidSize = true;
                    images?.map(image => {
                        var sizeInMb = getBytesInSize(image.size);

                        if (sizeInMb > 10) {
                            if (hasAllValidSize) {
                                hasAllValidSize = false;
                            }
                        }
                        if (Platform.OS == 'ios') {
                            attachmentsPicked.push({
                                uri: image.sourceURL.replace('file://', ''),
                                url: null,
                                filename: image.filename,
                                type: image.mime
                            })
                        } else {
                            var splitUrl = image.path.split("/");
                            var lengSplit = splitUrl.length;
                            var filename = splitUrl[lengSplit - 1];
                            attachmentsPicked.push({
                                uri: image.path,
                                url: null,
                                filename: filename,
                                type: image.mime
                            })
                        }

                    });
                    if (!hasAllValidSize) {
                        showToast(translations.upload_file_size_limits);
                    } else {
                        onSaveClicked(attachmentsPicked);
                    }
                } else {
                    showToast(translations.upload_file_limits);
                }
            }
        });
    }

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: translations.wa_fire_app_permission,
                message: translations.wa_fire_app_permission_gallery,
                buttonNeutral: translations.ask_me_later,
                buttonNegative: translations.cancel,
                buttonPositive: "OK"
            }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                openGallery();
            } else {
                showToast("Permission denied");
            }
        } catch (err) {
        }
    };

    async function onAddAttachmentClicked() {
        if (Platform.OS === 'android') {
            requestCameraPermission();
        } else {
            openGallery();
        }
    }

    function showToast(message) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT)
        } else {
            Alert.alert(message);
        }
    }

    return (
        <View style={[Style.flex1Style, Style.screenBgColor]} >
            <HeaderView />

            <View style={styles.headerView}>
                <TextComponent
                    text={translations.attachments}
                    textStyle={[Style.boldTextStyle, Style.text14Style, styles.jobDetail]}
                />
                <Button type="clear"
                    titleStyle={styles.monthName}
                    onPress={onBackPressed}>
                    <Icon name="left" size={16} color={colors.today_text_color}
                    />
                    {translations.job_details}
                </Button>

                {/* <TextComponent
                    text={translations.save}
                    textStyle={[Style.boldTextStyle, Style.text14Style, styles.saveText]}
                    onPress={onSaveClicked}
                /> */}
            </View>
            <View style={[styles.notesContainer]}>

                <ButtonComponent text={translations.add_attachment}
                    textStyle={[Style.boldTextStyle, Style.text12Style,]}
                    buttonStyle={styles.addAttachmentButton}
                    onPress={onAddAttachmentClicked}
                />

                <FlatList
                    data={attachments}
                    key={(item, index) => index.toString()}
                    scrollEventThrottle={16}
                    extraData={true}
                    numColumns={3}
                    removeClippedSubviews={true}
                    renderItem={attachmentRenderItem}
                    keyExtractor={(item, index) => index}
                />
            </View>
            {modalVisible ?
                <View style={[styles.progressContainer]}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ActivityIndicator
                                color={colors.today_text_color}
                                size={"large"} />

                            <Text style={styles.modalText}>File uploading {uploadProgress}%</Text>
                        </View>
                    </View>
                </View> : null}

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
        paddingHorizontal: 12,
        borderRadius: 16,
        flex: 1,
    },

    alertTimeContainer: {
        paddingVertical: 12,
        paddingEnd: 16
    },
    alertTime: {
        color: colors.black,
        flex: 1,
    },
    addAttachmentButton: {
        backgroundColor: 'rgba(218, 37, 37, 1)',
        borderRadius: 8,
        marginVertical: 12,
    },
    saveText: {
        marginVertical: 10,
        right: 20,
        color: colors.today_text_color,
        position: 'absolute',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    progressContainer: {
        backgroundColor: colors.black_10,
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalText: {
        color: colors.black,
    }
});

export default AttachmentScreen;