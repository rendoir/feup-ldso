import React from 'react';
import { StyleSheet } from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, Container, List, Text, Content, ListItem, Button } from 'native-base';
import axios from 'axios';
import Entity from '../components/Entity';
import NewCustomHeader from '../components/NewCustomHeader';

export default class EntitiesScreen extends React.Component {
    state = {
        loading: true,
        entities: []
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
        this.getEntitiesFromApi();
        !this.isCancelled && this.setState({ loading: false });
    }


    getEntitiesFromApi() {
        let self = this;
        axios.get('http://' + global.api + ':3030/app/entities')
            .then(function(response) {
                const entities = response.data;
                self.setState({ entities });
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

        const entities = this.state.entities.map((entity, i) => (
            <Entity data={entity} key={i} onPress={() => { navigate('Agenda', { selectedEntity: entity.initials, selectedEntityId: entity.id }); this.props.navigation.state.params.onSelect({ updateCall: true }); }} />
        ));

        return (
            <Container>
                <NewCustomHeader navigation={this.props.navigation} text={global.dictionary["ENTITIES"][this.props.screenProps.language]} fave={false} language={this.props.screenProps.language} toggleLanguage={this.props.screenProps.toggleLanguage}/>
                <Content>
                    <List style={{ backgroundColor: '#7C8589' }} >
                        <ListItem style={styles.listItem} className="list-entities" onPress={() => { navigate('Agenda', { selectedEntity: 'all', selectedEntityId: 'null' }); this.props.navigation.state.params.onSelect({ updateCall: true }); }}>
                            <Button transparent className="all-entities" onPress={() => { navigate('Agenda', { selectedEntity: 'all', selectedEntityId: 'null' }); this.props.navigation.state.params.onSelect({ updateCall: true }); }}><Text style={styles.buttonText}>{global.dictionary["ALL"][this.props.screenProps.language]}</Text></Button>
                        </ListItem>
                        {entities}
                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
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
    }
});
