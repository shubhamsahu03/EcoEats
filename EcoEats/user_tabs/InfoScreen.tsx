import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';

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
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                setUserEmail(user.email);
            } else {
                // No user is signed in
                setUserEmail(null);
            }
        });

        // Unsubscribe from the listener when component unmounts
        return unsubscribe;
    }, []);
  
    return (
      <View style={styles.container}>
        {userEmail ? (
          <>
            <Text style={{ marginBottom: 20 }}>Welcome, {userEmail}</Text>
          </>
        ) : (
            <Text style={{ marginBottom: 20 }}>Welcome</Text>
        )}
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