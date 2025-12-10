import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const COLORS = {
    label: "#6b4f6b",
    border: "#d3c8d3",
    text: "#333",
    white: "#fff",
    placeholder: "#888",
};

interface DatePickerInputProps {
    label: string;
    value?: string;
    onChange: (date: Date) => void;
}
const DatePickerInput = ({ label, value, onChange }: DatePickerInputProps) => {
    const [showPicker, setShowPicker] = useState(false);
    const [localDateTime, setLocalDateTime] = useState<Date>();

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            onChange(selectedDate);
        }

        if (Platform.OS === "android") {
            setShowPicker(false);
        }
    };

    useEffect(() => {
        if (value) {
            const dataString = value;

            const dataComHorarioLocal = dataString + "T00:00:00";

            const dataLocalCorreta = new Date(dataComHorarioLocal);
            setLocalDateTime(dataLocalCorreta);
        }
    }, [value]);

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={styles.pickerWrapper}
                onPress={() => setShowPicker(true)}
            >
                <Text
                    style={[
                        styles.pickerText,
                        !value && styles.placeholderText,
                    ]}
                >
                    {localDateTime
                        ? format(localDateTime, "dd/MM/yyyy")
                        : "dd/mm/aaaa"}
                </Text>
                <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={COLORS.label}
                />
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={localDateTime ?? new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onDateChange}
                    locale="pt-br"
                    timeZoneName="Brazil/East"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.label,
        marginBottom: 8,
        fontWeight: "500",
    },
    pickerWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 10,
        height: 52,
        paddingHorizontal: 15,
    },
    pickerText: {
        fontSize: 16,
        color: COLORS.text,
    },
    placeholderText: {
        color: COLORS.placeholder,
    },
});

export default DatePickerInput;
