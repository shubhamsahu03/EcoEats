import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image, StyleSheet, PermissionsAndroid, Button } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import getDistance from 'geolib/es/getPreciseDistance';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';

type Items = {
    name: string,
    description: string,
    image: string,
};

type VendorItems = {
    vendorID: string,
    items: Items[],
    location: FirebaseFirestoreTypes.GeoPoint,
};

type UserOrderInfo = {
    name:string,
    location:FirebaseFirestoreTypes.GeoPoint,
}

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

const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [data, setData] = useState<VendorItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState<GeoPosition | null>(null);
    const [orders, setOrders] = useState<VendorItems[]|null>([]);
    const [vendorName, setVendorName] = useState<string>('');

    useEffect(() => {
        getLocation();
        navigation.setOptions({
            title: 'Browse', // Set the title of the current page
            headerRight: () => (
                <Button
                    onPress={() => navigation.navigate('Info')}
                    title="Info"
                    color="#000"
                />
            ),
        });
        if (isLoading) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const response = await firestore().collection('Items').get();
        const val = response.docs.map((doc) => ({
            vendorID: doc.data().vendorID,
            items: (doc.data()?.items as Items[]),
            location: (doc.data().location)
        }));
        setData(val);
        setIsLoading(false);
    };

    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        console.log(position);
                        setLocation(position);
                    },
                    error => {
                        console.log(error.code, error.message);
                        setLocation(null);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
        console.log(location);
    };

    const handleOrder = async (vendorID:string) => {
        console.log('Ordering...'+vendorID);
        const snapshot = await firestore().collection('Users').doc(auth().currentUser?.uid).get();
        const data=snapshot.data();
        setOrders(data?.orders);
        const newOrder = await firestore().collection('Items').where('vendorID', '==', vendorID).get()
        .then((querySnapshot) => {
            let newOrderData;
            querySnapshot.forEach((doc) => {
                newOrderData = doc.data();
            });
            return newOrderData;
        });
        const newOrders = newOrder ? (orders ? [...orders, newOrder] : [newOrder]) : [];
        await firestore().collection('Users').doc(auth().currentUser?.uid).update({
            orders: newOrders,
        });

        const userOrderInfo: UserOrderInfo = {
            name: data?.name,
            location: location?.coords ? new firestore.GeoPoint(location.coords.latitude, location.coords.longitude) : new firestore.GeoPoint(0, 0)
        }; 
        await firestore().collection('Users').doc(vendorID).update({
            ordersReceived: userOrderInfo,
        });
        navigation.navigate('Order');
    };

    const renderItem = ({ item }: { item: VendorItems }) => {
        let distance = 0;
        if (location) {
            distance = getDistance(
                { latitude: location.coords.latitude, longitude: location.coords.longitude },
                { latitude: item.location.latitude, longitude: item.location.longitude },
            );
        }

        const updateVendorName = async (vendorID:string) => {
            await firestore().collection('Users').doc(vendorID).get().then((doc) => {
                if (doc.exists) {
                    setVendorName(doc.data()?.name);
                }
            });
        }
        updateVendorName(item.vendorID);
        if (location && distance <=5000 && !isLoading) {

            return (
                <View style={styles.container}>
                    <Text style={styles.header}>Vendor ID: {vendorName}</Text>
                    <FlatList
                        data={item.items}
                        renderItem={({ item }) => (
                            <View style={styles.itemContainer}>
                                <Text style={styles.item}>Name: {item.name}</Text>
                                <Text style={styles.item}>Description: {item.description}</Text>
                                <Image source={{ uri: item.image }} style={styles.image} />
                            </View>
                        )}
                        keyExtractor={(item) => item.name}
                    />
                    <Text style={styles.distance}>Distance: {distance}m</Text>
                    <View style={styles.button}>
                        <Button
                            title="Order"
                            onPress={()=>handleOrder(item.vendorID)}
                        />
                    </View>
                    <View style={styles.line}></View>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.vendorID}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    itemContainer: {
        marginBottom: 20,
    },
    item: {
        color: 'black',
        fontSize: 16,
        marginBottom: 5,
    },
    header: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 5,
    },
    distance: {
        fontSize: 14,
        color: 'green',
    },
    line: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 30,
        marginBottom: 10,
    },
    button: {
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SearchScreen;
