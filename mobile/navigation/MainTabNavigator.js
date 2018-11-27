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

const FavoritesStack = createStackNavigator({
    Favorites: FavoritesScreen
});

const SearchStack = createStackNavigator({
    Search: SearchScreen,
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

FavoritesStack.navigationOptions = {
    tabBarLabel: 'Favoritos',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'heart-o'}
        />
    )
};

SearchStack.navigationOptions = {
    tabBarLabel: 'Pesquisa',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'search'}
        />
    )
};

const MyBottomTabNavigator = createBottomTabNavigator({
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

export default class MainTabNavigator extends React.Component {
    static router = MyBottomTabNavigator.router;

    constructor(props) {
        super(props);
    }

    render() {
        this.setLabels();
        return <MyBottomTabNavigator {...this.props} />;
    }

    setLabels() {
        MainTabNavigator.router.getComponentForRouteName('AgendaStack').navigationOptions.tabBarLabel = global.dictionary["AGENDA"][this.props.screenProps.language];
        MainTabNavigator.router.getComponentForRouteName('FavoritesStack').navigationOptions.tabBarLabel = global.dictionary["FAVORITES"][this.props.screenProps.language];
        MainTabNavigator.router.getComponentForRouteName('SearchStack').navigationOptions.tabBarLabel = global.dictionary["SEARCH"][this.props.screenProps.language];
    }
}
