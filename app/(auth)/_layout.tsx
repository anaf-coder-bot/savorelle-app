import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native'
import React from 'react'
import {Slot} from "expo-router";

export default function _Layout() {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView className={'bg-white h-screen'} keyboardShouldPersistTaps={'handled'}>
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
