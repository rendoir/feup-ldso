import React from 'react';
import { StyleSheet } from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, Container, Content, List, Text, Button, ListItem } from 'native-base';
import axios from 'axios';
import Category from '../components/Category';
import NewCustomHeader from '../components/NewCustomHeader';

export default class CategoriesScreen extends React.Component {
    state = {
        loading: true,
        categories: []
    };

    static navigationOptions = {
        header: null
    };

    componentWillUnmount() {
        this.isCancelled = true;
    }

    async componentDidMount() {
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });
        this.getCategoriesFromApi();
        !this.isCancelled && this.setState({ loading: false });
    }

    getCategoriesFromApi() {
        console.log("LOL");
        let self = this;
        axios.get('http://' + global.api + ':3030/categories')
            .then(function(response) {
                const categories = response.data;
                if (!this.isCancelled)
                    self.setState({ categories });
            })
            .catch(function(error) {
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
            <Category data={category} key={i} onPress={() => { navigate('Agenda', { selectedCategory: category.name, selectedCategoryId: category.id }); this.props.navigation.state.params.onSelect({ updateCall: true }); } } />
        ));

        return (
            <Container>
                <NewCustomHeader text='Categorias' fave={false} />
                <Content>
                    <List>
                        <ListItem style={styles.listItem} onPress={() => { navigate('Agenda', { selectedCategory: 'Categoria', selectedCategoryId: 'null' }); this.props.navigation.state.params.onSelect({ updateCall: true }); } }>
                            <Button transparent onPress={() => { navigate('Agenda', { selectedCategory: 'Categoria', selectedCategoryId: 'null' }); this.props.navigation.state.params.onSelect({ updateCall: true }); }}><Text style={styles.buttonText}>Todos</Text></Button>
                        </ListItem>
                        {categories}
                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        justifyContent: "center"
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
        alignSelf: 'center'
    },
    buttonText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        paddingLeft: 5
    }
});
