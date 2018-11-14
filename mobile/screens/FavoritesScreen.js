import React from 'react';
import {
    Image,
    ScrollView
} from 'react-native';

import { View } from 'native-base';

export default class FavoritesScreen extends React.Component {
  static navigationOptions = {
      header: null
  };

  render() {
      return (
          <View style={{ backgroundColor: 'white' }}>
              <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: 'white', height: '100%' }}>
                  <Image source={{ uri: 'https://thomassbarnard.com/wp-content/uploads/2016/08/work-in-progess.png' }} style={{ height: 250, marginVertical: '20%' }} />
              </ScrollView>
          </View >
      );
  }
}
