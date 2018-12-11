import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
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
            <Category language={this.props.screenProps.language} data={category} key={i} onPress={() => { navigate('Agenda', { selectedCategory: category, selectedCategoryId: category.id }); this.props.navigation.state.params.onSelect({ updateCall: true }); }} />
        ));

        return (
            <Container style={styles.list}>
                <StatusBar hidden />
                <NewCustomHeader navigation={this.props.navigation} text={global.dictionary["CATEGORIES"][this.props.screenProps.language]} fave={false} language={this.props.screenProps.language} toggleLanguage={this.props.screenProps.toggleLanguage} />
                <Content>
                    <List style={styles.list} >
                        <ListItem style={styles.listItem} className="list-categories" onPress={() => { navigate('Agenda', { selectedCategory: 'all', selectedCategoryId: 'null' }); this.props.navigation.state.params.onSelect({ updateCall: true }); }}>
                            <Button transparent className="all-categories" onPress={() => { navigate('Agenda', { selectedCategory: 'all', selectedCategoryId: 'null' }); this.props.navigation.state.params.onSelect({ updateCall: true }); }} style={styles.button}><Text style={styles.buttonText}>{global.dictionary["ALL"][this.props.screenProps.language]}</Text></Button>
                        </ListItem>
                        {categories}
                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: '#7C8589'
    },
    listItem: {
        justifyContent: "center",
        backgroundColor: '#7C8589',
        width: '91%',
        borderBottomWidth: 1,
        borderBottomColor: 'white'
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
        color: 'white',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: 'center'
    },
    button: {
        alignItems: 'center'
    }
});
