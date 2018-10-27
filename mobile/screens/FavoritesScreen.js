import React from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

import { View } from 'native-base';
import CustomHeader from '../components/CustomHeader';

export default class FavoritosScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <CustomHeader />
        <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: 'white', height: '100%' }}>
          <Image source={{ uri: 'https://thomassbarnard.com/wp-content/uploads/2016/08/work-in-progess.png' }} style={{ height: 250, marginVertical: '20%' }} />
        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
});