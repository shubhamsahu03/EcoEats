import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Image, Alert ,PermissionsAndroid} from 'react-native';
import { Appearance } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
//import { firebaseConfig } from 'firebaseConfig';
//import { initializeApp } from '@firebase/app';

const colorScheme = Appearance.getColorScheme();
const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };
const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    const [name, setname] = useState('');

    const [open, setOpen] = useState(false);
    const [userType, setUserType] = useState('');
    const [items, setItems] = useState([
        {label: 'User', value: 'user'},
        {label: 'Vendor', value: 'vendor'},
    ]);
    const [location, setLocation] = useState<GeoPosition|null>(null);
    // Function to get permission for location
   
    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
        console.log('res is:', res);
        if (res) {
            Geolocation.getCurrentPosition(
            position => {
                console.log(position);
                setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(null);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };
    const handleSignup = ( password: string, email: string , userType :string) => {
        console.log('Signing up...');
        auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            console.log('User account created & signed in!');
            navigation.navigate('Info');
        })
        .then(() => {
            if(userType === 'user'){
                firestore()
                .collection('Users')
                .doc(
                    auth().currentUser?.uid
                )
                .set({
                    name: name,
                    email: email,
                    userType: userType,
                    orders: [],
                })
                .then(() => {
                    console.log('User added!');
                    navigation.navigate('Search');
                })
                .catch(error => {
                    console.error('Error adding user: ', error);
                });
            }else if(userType === 'vendor'){
                firestore()
                .collection('Users')
                .doc(
                    auth().currentUser?.uid
                )
                .set({
                    name: name,
                    email: email,
                    userType: userType,
                    items: [],
                    ordersReceived: [],
                })
                .then(() => {
                    console.log('Vendor added!');
                    navigation.navigate('Info');
                })
                .catch(error => {
                    console.error('Error adding vendor: ', error);
                });
            }
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            if(error.code === 'auth/weak-password'){
                Alert.alert('Weak Password', 'Please choose a stronger password.');
            }
            console.error(error);
        });
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/login.png')}
                style={{ width: 100, height: 100, marginBottom: 24 }}
            />
            <View style={styles.dropdown}>
                <DropDownPicker
                    open={open}
                    value={userType}
                    items={items}
                    setOpen={setOpen}
                    setValue={setUserType}
                    setItems={setItems}
                    placeholder="Select User Type"
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setname}
            />
             <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setemail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <View style={styles.button}>
                <Button title="Signup" onPress={() => handleSignup(password, email, userType)} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        backgroundColor: 'black',
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    dropdown:{
        width: '100%',
        marginBottom: 12,
    },
    button:{
        marginTop: 12,
        width: '50%',
    }
});

export default SignupScreen;