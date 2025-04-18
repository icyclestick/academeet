import {View, Text, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import {router} from "expo-router";
import {Entypo} from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import DropDownPicker from 'react-native-dropdown-picker';
import {accountabilityOptions, matchOptions, timeOptions, yearOptions} from "@/types/DropDownOptions";

const Form = () => {
    const [yearOpen, setYearOpen] = useState(false);
    const [yearValue, setYearValue] = useState(null);
    const [yearItems, setYearItems] = useState(yearOptions);

    const [timeOpen, setTimeOpen] = useState(false);
    const [timeValue, setTimeValue] = useState(null);
    const [timeItems, setTimeItems] = useState(timeOptions);

    const [accountOpen, setAccountOpen] = useState(false);
    const [accountValue, setAccountValue] = useState(null);
    const [accountItems, setAccountItems] = useState(accountabilityOptions);

    const [matchOpen, setMatchOpen] = useState(false);
    const [matchValue, setMatchValue] = useState(null);
    const [matchItems, setMatchItems] = useState(matchOptions);

    return (
        <>
            <View className="flex-1 bg-white px-6 py-12 gap-10">
                <View>
                    <BackButton />

                    <Text className="text-englishViolet text-2xl font-bold">
                        Studying is better together. Let’s find your perfect match!
                    </Text>
                </View>
                <View className="gap-2">
                    <Text className="font-bold">Year Level</Text>
                    <DropDownPicker
                        placeholder="Select Year Level"
                        open={yearOpen}
                        value={yearValue}
                        items={yearItems}
                        setOpen={setYearOpen}
                        setValue={setYearValue}
                        setItems={setYearItems}
                        zIndex={4000}
                    />
                </View>
                <View className="gap-2">
                    <Text className="font-bold">Study Time Preference</Text>
                    <DropDownPicker
                        placeholder="Preferred Study Time"
                        open={timeOpen}
                        value={timeValue}
                        items={timeItems}
                        setOpen={setTimeOpen}
                        setValue={setTimeValue}
                        setItems={setTimeItems}
                        zIndex={3000}
                    />
                </View>
                <View className="gap-2">
                    <Text className="font-bold">Accountability Level</Text>
                    <DropDownPicker
                        placeholder="Accountability Level"
                        open={accountOpen}
                        value={accountValue}
                        items={accountItems}
                        setOpen={setAccountOpen}
                        setValue={setAccountValue}
                        setItems={setAccountItems}
                        zIndex={2000}
                    />
                </View>
                <View className="gap-2">
                    <Text className="font-bold">Match Preference</Text>
                    <DropDownPicker
                        placeholder="Match Preference"
                        open={matchOpen}
                        value={matchValue}
                        items={matchItems}
                        setOpen={setMatchOpen}
                        setValue={setMatchValue}
                        setItems={setMatchItems}
                        zIndex={1000}
                    />
                </View>
            </View>
        </>
    )
}
export default Form
