import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import FavoritesScreen from '../screens/FavoritesScreen';
import SearchScreen from '../screens/SearchScreen';
import AgendaScreen from '../screens/AgendaScreen';
import EntitiesScreen from '../screens/EntitiesScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import EventScreen from '../screens/EventScreen';

const AgendaStack = createStackNavigator({
  Agenda: AgendaScreen,
  Entities: EntitiesScreen,
  Categories: CategoriesScreen,
  Event: EventScreen
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
  )
};

const FavoritesStack = createStackNavigator({
  Favorites: FavoritesScreen
});

FavoritesStack.navigationOptions = {
  tabBarLabel: 'Favoritos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-star${focused ? '' : '-outline'}`
          : 'md-heart-outline'
      }
    />
  ),
};

const SearchStack = createStackNavigator({
  Search: SearchScreen
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Pesquisa',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-search${focused ? '' : '-outline'}` : 'md-search'}
    />
  )
};

export default createBottomTabNavigator({
  FavoritesStack,
  AgendaStack,
  SearchStack
},
  {
    initialRouteName: 'AgendaStack',
    tabBarOptions: {
      showLabel: true,
      activeTintColor: '#F8F8F8',
      inactiveTintColor: '#ffffff',
      style: {
        backgroundColor: '#002040'
      }
    }
  }
);
