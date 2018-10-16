import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import FavoritosScreen from '../screens/FavoritosScreen';
import SearchScreen from '../screens/SearchScreen';
import AgendaScreen from '../screens/AgendaScreen';
import EntitiesScreen from '../screens/EntitiesScreen';
import CategoriesScreen from '../screens/CategoriesScreen';

const AgendaStack = createStackNavigator({
  Agenda: AgendaScreen,
  Entities: EntitiesScreen,
  Categories: CategoriesScreen,
});

AgendaStack.navigationOptions = {
  tabBarLabel: 'Agenda',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-calendar${focused ? '' : '-outline'}`
          : 'md-calendar'
      }
    />
  ),
};

const FavoritosStack = createStackNavigator({
  Favoritos: FavoritosScreen,
});

FavoritosStack.navigationOptions = {
  tabBarLabel: 'Favoritos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-heart${focused ? '' : '-outline'}`
          : 'md-heart-outline'
      }
      
    />
  ),
};

const SearchStack = createStackNavigator({
  Search: SearchScreen,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Pesquisa',
  tabBarIcon: ({ focused, activeTintColor }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-search${focused ? '' : '-outline'}` : 'md-search'}
    />
  ),
};

export default createBottomTabNavigator({
  FavoritosStack,
  AgendaStack,
  SearchStack
},
  {
    initialRouteName: 'AgendaStack',
    tabBarOptions: {
      showLabel: false, // hide labels
      activeTintColor: '#F8F8F8', // active icon color
      inactiveTintColor: '#ffffff',  // inactive icon color
      style: {
        backgroundColor: '#2c8f7f'// : '#32a794'// TabBar background
      },
    }
  }
);
