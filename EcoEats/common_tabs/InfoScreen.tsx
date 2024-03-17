import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserInfo {
    name: string;
    email: string;
    userType: string;
    orders: [];
}

interface VendorInfo {
    name: string,
    email: string,
    userType: string,
    items: [],
    ordersReceived: [],
}

const InfoScreen: React.FC = () => {
    const [userType, setUserType] = useState('');
    const [userInfo, setUserInfo] = useState<UserInfo|null>(null);
    const [vendorInfo, setVendorInfo] = useState<VendorInfo|null>(null);

    useEffect(() => {
        // Fetch user information once when the component mounts
        const fetchUserInfo = async () => {
            const user = auth().currentUser;
            if (user) {
                const doc = await firestore().collection('Users').doc(user.uid).get();
                const userData = doc.data();
                console.log(user.uid);
                if (userData) {
                    if (userData.userType === 'user') {
                        setUserType('user');
                        setUserInfo(userData as UserInfo);
                    } else if (userData.userType === 'vendor') {
                        setUserType('vendor');
                        setVendorInfo(userData as VendorInfo);
                    }
                }
            } else {
                setUserType('none');
            }
        };

        fetchUserInfo(); // Call the fetchUserInfo function when the component mounts

        // Listen for authentication state changes
        const vendor_login=async()=>{
           const users=await firestore().collection
        }
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (!user) {
                setUserType('none');
            }
        });

        return () => {
            unsubscribe(); // Unsubscribe from the auth state listener when the component unmounts
        };
    }, []);
    
    if (userType === 'user') {
        return(
                <View style={styles.container}>
                    <Text style={styles.header}>User Information</Text>
                    <Text style ={styles.boxeditem}>Name: {userInfo?.name}</Text>
                    <Text style ={styles.boxeditem}>Email: {userInfo?.email}</Text>
                    <Text style ={styles.boxeditem}>User Type: {userInfo?.userType}</Text>
                    <View style={styles.orders}>
                        <Text style={styles.header}>Orders</Text>
                        <FlatList
                            data={userInfo?.orders}
                            renderItem={({ item }) => (
                                <Text>{item}</Text>
                            )}
                        />
                    </View>
                </View>
            );
        } 
        else if (userType === 'vendor') {
            return(
                <View style={styles.container}>
                    <Text style={styles.header}>Vendor Information</Text>
                    <Text style ={styles.boxeditem}>Name: {vendorInfo?.name}</Text>
                    <Text style ={styles.boxeditem}>Email: {vendorInfo?.email}</Text>
                    <Text style ={styles.boxeditem}>User Type: {vendorInfo?.userType}</Text>
                    <View style={styles.orders}>
                    <Text style={styles.header}>Orders Received</Text>
                        <FlatList
                            data={vendorInfo?.ordersReceived}
                            renderItem={({ item }) => (
                                <Text>{item}</Text>
                            )}
                        />
                    </View>
                    <View style={styles.items}>
                    <Text style={styles.header}>Items</Text>
                        <FlatList
                            data={vendorInfo?.items}
                            renderItem={({ item }) => (
                                <Text>{item}</Text>
                            )}
                        />
                    </View>
                </View>
            );
        } 
        else {
            return(
                <View style={styles.container}>
                    <Text style={styles.redText}>No user signed in</Text>
                </View>
            );
        }
    };

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    boxeditem: {
        alignItems:'stretch',
        textAlign: 'left',
        fontSize: 18,
        fontFamily: 'Arial',
        backgroundColor: 'black',
        color: 'white',
        padding: 15,
        marginBottom: 15,
    },
    redText:{
        backgroundColor: 'black',
        color: 'red'
    },
    orders: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    items: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default InfoScreen;
