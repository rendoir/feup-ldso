import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { Font, AppLoading } from "expo";
import { Container, Root, View, Card, Button, Left, Header, Right, Title, Body, Icon, Text, CardItem, Badge } from 'native-base';
import axios from 'axios';
import Event from '../components/Event';
import CustomHeader from '../components/CustomHeader';

export default class AgendaScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    loading: true,
    events: [],
    entity: null,
    category: null,
  };

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    await Font.loadAsync({
      'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
      'DJB-Coffee-Shoppe-Espresso': require('../assets/fonts/DJB-Coffee-Shoppe-Espresso.ttf'),
    });
    this.getEventsFromApi();
    // !this.isCancelled && this.setState({ loading: false });
    this.setState({ loading: false });
  }

  getEventsFromApi() {
    let self = this;
    let apiLink = 'http://' + global.api + ':3030/events?';
    if (this.props.navigation.getParam('selectedEntity', 'Orgão') != 'Orgão') {
      apiLink += 'entities=' + this.state.entity + '&';
    }
    if (this.props.navigation.getParam('selectedCategory', 'Categoria') != 'Categoria') {
      apiLink += 'categories=' + this.state.category + '&';
    }
    axios.get(apiLink)
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

    {
      this.state.entity = this.props.navigation.getParam('selectedEntityId', 'null');
      this.state.category = this.props.navigation.getParam('selectedCategoryId', 'null');
      this.getEventsFromApi();
    };

    let noEventsElement;
    if (this.state.events.length == 0) {
      noEventsElement = (
        <Card>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: '5%' }}>
            <Icon type="Feather" name="info" />
            <Text>Não há eventos futuros para mostrar.</Text>
          </View>
        </Card>
      );
    }

    return (
      <View style={{ backgroundColor: 'white' }}>
        <CustomHeader />
        <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: 'white', height: '100%' }}>

          <View style={{ margin: '5%', backgroundColor: 'white' }}>

            <Text style={{ fontSize: 28, color: '#2c8f7f', textAlign: 'center', fontFamily: 'DJB-Coffee-Shoppe-Espresso' }}>Eventos</Text>

            <View style={{ justifyContent: 'center', flexDirection: 'row', paddingBottom: '5%', backgroundColor: 'white' }}>
              <View style={{ flex: 3 }}>
                <Button style={{ width: '100%', height: 30, borderWidth: 1, borderColor: 'black' }} transparent onPress={() => navigate('Categories')}>
                  <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedCategory', 'Categoria')}</Text>
                  <Icon type='FontAwesome' name='angle-down' style={{ color: 'black', position: 'absolute', right: 0 }} />
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18, textAlign: 'center' }}>em</Text>
              </View>

              <View style={{ flex: 3 }}>
                <Button style={{ width: '100%', height: 30, borderWidth: 1, borderColor: 'black' }} transparent onPress={() => navigate('Entities')}>
                  <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedEntity', 'Orgão')}</Text>
                  <Icon type='FontAwesome' name='angle-down' style={{ color: 'black', position: 'absolute', right: 0 }} />
                </Button>
              </View>

            </View>
          </View>

          <View style={{ marginHorizontal: '5%', backgroundColor: 'white' }}>
            {events}
            {noEventsElement}
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
