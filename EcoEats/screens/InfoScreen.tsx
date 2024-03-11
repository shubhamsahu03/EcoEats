
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UserInfo {
    name: string;
    age: number;
    email: string;
    password:string
}

interface InfoScreenProps {
    username: string;
}

const InfoScreen: React.FC = () => {
        return (
        <View style={styles.container}>
            <Text style={styles.redText} >Loading...</Text>
        </View>
        );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    redText:{
        color: 'red'
    }
});

export default InfoScreen;