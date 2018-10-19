import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, View, Card, Button, Left, Right, Body, Icon, Text, CardItem, Badge } from 'native-base';
import axios from 'axios';
import Event from '../components/Event'


export default class AgendaScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    loading: true,
    events: [],
  };

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    await Font.loadAsync({
      'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    });
    this.getEventsFromApi();
    this.setState({ loading: false });
  }

  getEventsFromApi() {
    let self = this;
    axios.get('http://192.168.99.100:3030/app?page=0&limit=10') //change IP to match wi-fi ip of api machine
      .then(function (response) {
        const events = response.data;
        self.setState({ events });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      );
    }
    const { navigate } = this.props.navigation;

    const events = this.state.events.map((event, i) => (
      <Event data={event} key={i} />
    ));

    return (
      <View style={{ backgroundColor: 'white' }}>
        <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: 'white' }}>

          <View style={{ marginHorizontal: '5%', paddingTop: '10%', backgroundColor: 'white' }}>

            <Text style={{ fontSize: 32, color: '#2c8f7f', textAlign: 'center' }}>Eventos</Text>

            <View style={{ justifyContent: 'center', flexDirection: 'row', paddingVertical: '5%', backgroundColor: 'white' }}>
              <View style={{ flex: 3 }}>
                <Button style={{ width: '100%', height: 30, borderWidth: 1, borderColor: 'black' }} transparent onPress={() => navigate('Categories')}>
                  <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18, textAlign: 'center' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedCategory', 'Categoria')}</Text>
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18, textAlign: 'center' }}>em</Text>
              </View>

              <View style={{ flex: 3 }}>
                <Button style={{ width: '100%', height: 30, borderWidth: 1, borderColor: 'black' }} transparent onPress={() => navigate('Entities')}>
                  <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18, textAlign: 'center' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedEntity', 'Orgão')}</Text>
                </Button>
              </View>

            </View>
          </View>

          <View style={{ marginHorizontal: '5%', backgroundColor: 'white' }}>
            {events}
          </View>
        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  textBlack: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    paddingLeft: 0,
  },
  buttonText: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    paddingLeft: 5,
  },
  simpleText: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
  },
  eventTitle: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
});
