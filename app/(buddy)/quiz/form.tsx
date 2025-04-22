import {View, Text, TouchableOpacity, Alert} from 'react-native'
import React, {useState} from 'react'
import {router} from "expo-router";
import {Entypo} from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import DropDownPicker from 'react-native-dropdown-picker';
import {accountabilityOptions, matchOptions, timeOptions, yearOptions} from "@/types/DropDownOptions";
import {useAuth} from "@/providers/AuthProviders";
import {supabase} from "@/lib/supabase";

const Form = () => {
    const {profile} = useAuth()
    const [loading, setLoading] = useState(false);

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

    const handleSubmitPreferences = async () => {
        if (!yearValue || !timeValue || !accountValue || !matchValue) {
            Alert.alert('Please fill in all fields');
            return;
        }

        const preferences = {
            yearLevel: yearValue,
            studyTime: timeValue,
            accountability: accountValue,
            matchPreference: matchValue,
        };

        setLoading(true);
        const { error } = await supabase
            .from('profiles') // your table name
            .update({ preferences: preferences })
            .eq('id', profile.id); // adjust if using another key like email

        if (error) {
            console.error(error);
            Alert.alert('Error saving preferences');
        } else {
            // router.push('/nextPage'); // redirect as needed
            Alert.alert('Successfully updated preferences');
        }
        setLoading(false);
    };

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
                        placeholderStyle={{
                            color: 'gray',
                        }}
                        style={{ borderColor: '#D3D3D3' }} // Light gray border for the main picker
                        dropDownContainerStyle={{ borderColor: '#D3D3D3' }}
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
                        placeholderStyle={{
                            color: 'gray',
                        }}
                        style={{ borderColor: '#D3D3D3' }} // Light gray border for the main picker
                        dropDownContainerStyle={{ borderColor: '#D3D3D3' }}
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
                        placeholderStyle={{
                            color: 'gray',
                        }}
                        style={{ borderColor: '#9E9C9D' }} // Light gray border for the main picker
                        dropDownContainerStyle={{ borderColor: '#D3D3D3' }}
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
                        placeholderStyle={{
                            color: 'gray',
                        }}
                        style={{ borderColor: '#9E9C9D' }} // Light gray border for the main picker
                        dropDownContainerStyle={{ borderColor: '#D3D3D3' }}
                        zIndex={1000}
                    />
                </View>

                <TouchableOpacity
                    className="bg-englishViolet rounded-full py-4 mx-6 mt-10"
                    disabled={loading}
                    onPress={handleSubmitPreferences}
                >
                    <Text className="text-white text-center font-semibold">Find a Study Buddy</Text>
                </TouchableOpacity>

            </View>
        </>
    )
}
export default Form
