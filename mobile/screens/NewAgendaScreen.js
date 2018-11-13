import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, View, Card, Button, Icon, Text } from 'native-base';
import axios from 'axios';
import NewEvent from '../components/NewEvent';

export default class NewAgendaScreen extends React.Component {

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

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    await Font.loadAsync({
      'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
      'DJB-Coffee-Shoppe-Espresso': require('../assets/fonts/DJB-Coffee-Shoppe-Espresso.ttf'),
    });
    this.getEventsFromApi();
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
      <NewEvent data={event} key={i} onPress={() => navigate('Event', { eventData: event })} />
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
      <View style={{ backgroundColor: '#607D8B' }}>
        <ScrollView stickyHeaderIndices={[1]} style={{ backgroundColor: '#607D8B', height: '100%', marginBottom: '10%' }}>

          <View style={{ paddingTop: '5%', marginHorizontal: '5%' }}>
            <Text style={{ fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'OpenSans-Regular' }}>Eventos</Text>
          </View>

          <View style={{ marginHorizontal: '5%', paddingTop: '5%', backgroundColor: '#607D8B' }}>
            <View style={{ justifyContent: 'center', flexDirection: 'row', paddingBottom: '5%', backgroundColor: '#607D8B' }}>

              <View style={{ flex: 3 }}>
                <Button style={{ width: '100%', height: 30, borderWidth: 1, borderColor: 'white' }} transparent onPress={() => navigate('Categories')}>
                  <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: '5%' }}>
                    <View style={{ flex: 5 }}>
                      <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedCategory', 'Categorias')}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Icon type='FontAwesome' name='angle-down' style={{ color: 'white', position: 'absolute', right: 0, fontSize: 22 }} />
                    </View>
                  </View>
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, textAlign: 'center' }}>em</Text>
              </View>

              <View style={{ flex: 3 }}>
                <Button style={{ width: '100%', height: 30, borderWidth: 1, borderColor: 'white' }} transparent onPress={() => navigate('Entities')}>
                  <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: '5%' }}>
                    <View style={{ flex: 5 }}>
                      <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedEntity', 'Orgão')}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Icon type='FontAwesome' name='angle-down' style={{ color: 'white', position: 'absolute', right: 0, fontSize: 22 }} />
                    </View>
                  </View>
                </Button>
              </View>

            </View>
          </View>

          <View style={{ marginHorizontal: '5%', backgroundColor: '#607D8B' }}>
            {events}
            {noEventsElement}
          </View>
        </ScrollView >
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
