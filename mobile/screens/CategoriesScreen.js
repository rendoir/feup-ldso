import React from 'react';
import { StyleSheet } from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, Container, Header, Content, List, Text, Button, ListItem } from 'native-base';
import axios from 'axios';
import Category from '../components/Category';

export default class CategoriesScreen extends React.Component {
    state = {
        loading: true,
        categories: [],
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
        this.getCategoriesFromApi();
        !this.isCancelled && this.setState({ loading: false });
    }

    getCategoriesFromApi() {
        let self = this;
        axios.get('http://' + global.api + ':3030/categories')
            .then(function (response) {
                const categories = response.data;
                if(!this.isCancelled)
                    self.setState({ categories });
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

        const categories = this.state.categories.map((category, i) => (
            <Category data={category} key={i} onPress={() => navigate('Agenda', { selectedCategory: category.name, selectedCategoryId: category.id })} />
        ));

        return (
            <Container>
                <Header style={styles.header}>
                    <Text style={styles.headerText}>Categorias</Text>
                </Header>
                <Content>
                    <List>
                        <ListItem style={styles.listItem} onPress={() => navigate('Agenda', { selectedCategory: 'Categoria', selectedCategoryId: 'null' })}>
                            <Button transparent onPress={() => navigate('Agenda', { selectedCategory: 'Categoria', selectedCategoryId: 'null' })}><Text style={styles.buttonText}>Todos</Text></Button>
                        </ListItem>
                        {categories}
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
        height: 80
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