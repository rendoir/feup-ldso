import React from 'react';
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
            name={'calendar'}
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
            name={'heart-o'}
        />
    )
};

const SearchStack = createStackNavigator({
    Search: SearchScreen,
    Event: EventScreen
});

SearchStack.navigationOptions = {
    tabBarLabel: 'Pesquisa',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'search'}
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
        activeBackgroundColor: '#6090c0',
        style: {
            backgroundColor: '#002040'
        }
    }
}
);
