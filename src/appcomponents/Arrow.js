import React from "react";
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from "../css/colors";

const Arrow = ({ direction }) => {
    return (
        <Icon name={direction} size={16} color={colors.today_text_color} />
    );
}
export default Arrow;