import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { StyleSheet } from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, Container, Header, Title, Content, List, ListItem, H1, H2, H3, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

export default class EntitiesScreen extends React.Component {
  state = {
    loading: true,
  };
  static navigationOptions = {
    header: null,
  };

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
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
    const { navigate } = this.props.navigation;
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Text style={styles.headerText}>Organizações</Text>
          </Left>
        </Header>
        <Content>
          <List>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FMUP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FMUP" })}><Text style={styles.buttonText}>FMUP</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FEUP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FEUP" })}><Text style={styles.buttonText}>FEUP</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FCUP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FCUP" })}><Text style={styles.buttonText}>FCUP</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "ICBAS" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "ICBAS" })}><Text style={styles.buttonText}>ICBAS</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FPCEUP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FPCEUP" })}><Text style={styles.buttonText}>FPCEUP</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FFUP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FFUP" })}><Text style={styles.buttonText}>FFUP</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FAUP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FAUP" })}><Text style={styles.buttonText}>FAUP</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FBAUP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FBAUP" })}><Text style={styles.buttonText}>FBAUP</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FEP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FEP" })}><Text style={styles.buttonText}>FEP</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FCNAUP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FCNAUP" })}><Text style={styles.buttonText}>FCNAUP</Text></Button>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedEntity: "FLUP" })}>
              <Button transparent onPress={() => navigate('Agenda', { selectedEntity: "FLUP" })}><Text style={styles.buttonText}>FLUP</Text></Button>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    color: 'black',
  },
  listItem: {
    justifyContent: "center",
  },
  header: {
    backgroundColor: '#2c8f7f',
    height: 80,
    justifyContent: "center",
  },
  headerText: {
    paddingTop: 20,
    color: 'white',
    fontSize: 30,
    width: 400,
    justifyContent: "center",
  }
});