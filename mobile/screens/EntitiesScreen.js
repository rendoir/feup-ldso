import React from 'react';
import { StyleSheet } from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, Container, Header, List, Text, View, Content, ListItem, Button } from 'native-base';
import axios from 'axios';
import Entity from '../components/Entity';

export default class EntitiesScreen extends React.Component {
  state = {
    loading: true,
    entities: []
  };
  static navigationOptions = {
    header: null,
  };

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.getEntitiesFromApi();
    !this.isCancelled && this.setState({ loading: false });
  }


  getEntitiesFromApi() {
    let self = this;
    axios.get('http://' + global.api + ':3030/app/entities')
      .then(function (response) {
        const entities = response.data;
        self.setState({ entities });
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

    const entities = this.state.entities.map((entity, i) => (
      <Entity data={entity} key={i} onPress={() => navigate('Agenda', { selectedEntity: entity.initials, selectedEntityId: entity.id })} />
    ));

    return (
      <Container>
        <Header style={styles.header}>
          <Text style={styles.headerText}>Organizações</Text>
        </Header>
        <Content>
          <List>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: 'Orgão', selectedEntityId: 'null' })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: 'Orgão', selectedEntityId: 'null' })}><Text style={styles.buttonText}>Todos</Text></Button>
            </ListItem>
            {entities}
          </List>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  listItem: {
    justifyContent: "center",
  },
  header: {
    backgroundColor: '#2c8f7f',
    height: 80,
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    paddingLeft: 5,
  },
});