import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import OrdersTab from '../tabs/OrdersTab';
import NotificationsTab from '../tabs/NotificationsTab';
import AddItemsTab from '../tabs/AddItemsTab';
import ItemsTab from '../tabs/ItemsTab';

const Tab = createBottomTabNavigator();

const Dashboard = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#ff6f00',
        inactiveTintColor: '#616161',
        labelStyle: styles.tabLabel,
        style: styles.tabBar,
      }}
    >
      <Tab.Screen name="Orders" component={OrdersTab} />
      <Tab.Screen name="Notifications" component={NotificationsTab} />
      <Tab.Screen name="Add Items" component={AddItemsTab} />
      <Tab.Screen name="Items List" component={ItemsTab} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 60,
    paddingTop: 5,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Dashboard;
