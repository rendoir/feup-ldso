import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { StyleSheet } from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, Container, Header, Title, Content, List, ListItem, H1, H2, H3, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

export default class CategoriesScreen extends React.Component {
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
                        <Text style={styles.headerText}>Categorias</Text>
                    </Left>
                </Header>
                <Content>
                    <List>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Literatura" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Literatura" })}><Text style={styles.buttonText} uppercase={false}>Literatura</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Clubbing" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Clubbing" })}><Text style={styles.buttonText} uppercase={false}>Clubbing</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Exposições" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Exposições" })}><Text style={styles.buttonText} uppercase={false}>Exposições</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Formação" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Formação" })}><Text style={styles.buttonText} uppercase={false}>Formação</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Moda" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Moda" })}><Text style={styles.buttonText} uppercase={false}>Moda</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Passeios e Visitas" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Passeios e Visitas" })}><Text style={styles.buttonText} uppercase={false}>Passeios e Visitas</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Bem estar" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Bem estar" })}><Text style={styles.buttonText} uppercase={false}>Bem estar</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Tradição" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Tradição" })}><Text style={styles.buttonText} uppercase={false}>Tradição</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Música" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Música" })}><Text style={styles.buttonText} uppercase={false}>Música</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Cinema" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Cinema" })}><Text style={styles.buttonText} uppercase={false}>Cinema</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Festival" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Festival" })}><Text style={styles.buttonText} uppercase={false}>Festival</Text></Button>
                        </ListItem>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: "Outras" })} >
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: "Outras" })}><Text style={styles.buttonText} uppercase={false}>Outras</Text></Button>
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
        height: 80
    },
    headerText: {
        paddingTop: 20,
        color: 'white', 
        fontSize: 30
    }
});