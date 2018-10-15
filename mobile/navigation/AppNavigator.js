import React from 'react';
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import AgendaScreen from '../screens/AgendaScreen';
import EntitiesScreen from '../screens/EntitiesScreen';
import CategoriesScreen from '../screens/CategoriesScreen';

import MainTabNavigator from './MainTabNavigator';


export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  
  //  Agenda: AgendaScreen,
  //  Entities: EntitiesScreen,
  //  Categories: CategoriesScreen,
}//,
//    {
//      initialRouteName: 'Agenda',
//    }
);