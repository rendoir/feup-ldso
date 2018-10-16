import React from 'react';
import {
  StyleSheet,
  Image,
} from 'react-native';

import { Container } from 'native-base';

export default class FavoritosScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Image source={{ uri: 'https://thomassbarnard.com/wp-content/uploads/2016/08/work-in-progess.png' }} style={{ height: 220, marginTop: 200 }} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
});