import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, View, Card, Button, Left, Header, Right, Title, Body, Icon, Text, CardItem, Badge, Item, Input } from 'native-base';
import CustomHeader from '../components/CustomHeader';

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    loading: true,
  };

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    await Font.loadAsync({
      'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
      'DJB-Coffee-Shoppe-Espresso': require('../assets/fonts/DJB-Coffee-Shoppe-Espresso.ttf'),
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      );
    }
    return (
      <View style={{ backgroundColor: 'white' }}>
        <CustomHeader />
        <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: 'white', height: '100%' }}>

          <View style={{ margin: '5%', backgroundColor: 'white' }}>

            <Text style={{ fontSize: 30, color: '#2c8f7f', textAlign: 'center', fontFamily: 'DJB-Coffee-Shoppe-Espresso' }}>Pesquisa</Text>

            <View style={{ justifyContent: 'center', flexDirection: 'row', paddingBottom: '5%', backgroundColor: 'white' }}>
              <View style={{ flex: 1 }}>
                <Text> </Text>
              </View>
              <View style={{ flex: 5 }}>
                <Item regular style={{ height: 30 }}>
                  <Input />
                  <Icon type="FontAwesome" name="search" />
                </Item>
              </View>
              <View style={{ flex: 1 }}>
                <Text> </Text>
              </View>
            </View>
          </View>

          <View style={{ marginHorizontal: '5%', backgroundColor: 'white' }}>
            <Card>
              <CardItem bordered>
                <Icon type="FontAwesome" name="map-marker" />
                <Text>Faculdade de Engenharia</Text>
              </CardItem>
              <CardItem bordered>
                <Icon type="FontAwesome" name="map-marker" />
                <Text>Faculdade de Desporto</Text>
              </CardItem>
              <CardItem bordered>
                <Icon type="FontAwesome" name="map-marker" />
                <Text>Faculdade de Letras</Text>
              </CardItem>
              <CardItem bordered>
                <Icon type="FontAwesome" name="map-marker" />
                <Text>Faculdade de Medicina</Text>
              </CardItem>
              <CardItem bordered>
                <Icon type="Feather" name="hash" />
                <Text>Informática</Text>
              </CardItem>
              <CardItem bordered>
                <Icon type="Feather" name="hash" />
                <Text>Desporto</Text>
              </CardItem>
              <CardItem bordered>
                <Icon type="Feather" name="hash" />
                <Text>Cultura</Text>
              </CardItem>
            </Card>
          </View>
        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
});