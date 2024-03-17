import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image, StyleSheet, PermissionsAndroid } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import getDistance from 'geolib/es/getPreciseDistance';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

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

    useEffect(() => {
        getLocation();
        if (isLoading) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        const response = await firestore().collection('Items').get();
        const val = response.docs.map((doc) => ({
            vendorID: doc.id,
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

    const renderItem = ({ item }: { item: VendorItems }) => {
        let distance = 0;
        if (location) {
            distance = getDistance(
                { latitude: location.coords.latitude, longitude: location.coords.longitude },
                { latitude: item.location.latitude, longitude: item.location.longitude },
            );
        }
        if (distance <=5000 && !isLoading) {
            return (
                <View style={styles.container}>
                    <Text style={styles.header}>Vendor ID: {item.vendorID}</Text>
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
});

export default SearchScreen;
