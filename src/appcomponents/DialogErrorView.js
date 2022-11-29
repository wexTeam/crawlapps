import { Card, Divider, Overlay } from "@rneui/themed";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import TextComponent from "../components/TextComponent";
import { colors } from "../css/colors";
import { Style } from "../css/styles";

const DialogErrorView = ({ visible = false, toggleOverlay, errorText, okButtonText }) => {

    return (
        <Modal
            visible={visible}
            transparent={true}>
            <View style={styles.centeredView}>
                <Card containerStyle={styles.containerDeclineDialog}>
                    <TextComponent text={errorText}
                        noOfLine={2}
                        textStyle={[Style.mediumTextStyle, Style.text14Style, styles.errorTitle]}
                    />
                    <Divider />
                    <View style={[
                        styles.ok,
                    ]}
                    >
                        <TextComponent
                            text={okButtonText}
                            textStyle={[Style.mediumTextStyle, Style.text12Style, styles.okText]}
                            noOfLine={2}
                            onPress={() => {
                                toggleOverlay();
                            }}
                        />
                    </View>
                </Card>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    containerDeclineDialog: {
    },
    errorTitle: {
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    ok: {
        alignItems: 'center',
        marginVertical: 8,
        justifyContent: 'center'
    },
    okText: {
    },


});

export default DialogErrorView;