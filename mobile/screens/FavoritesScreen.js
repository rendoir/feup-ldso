import React from 'react';
import {
    ScrollView
} from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, View, Card, Button, Icon, Text } from 'native-base';
import axios from 'axios';
import { SecureStore } from 'expo';
import Event from '../components/Event';

export default class AgendaScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    state = {
        loading: true,
        events: [],
        entity: null,
        category: null,
        updateCall: false
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
            'DJB-Coffee-Shoppe-Espresso': require('../assets/fonts/DJB-Coffee-Shoppe-Espresso.ttf')
        });
        this.getEventsFromApi();
        this.setState({ loading: false });
    }

    async getFavorites() {
        let token = await SecureStore.getItemAsync('access_token');

        let self = this;
        let apiLink = 'http://' + global.api + ':3030/events/favorites?';
        apiLink += "user_id=" + global.userId + '&';
        apiLink += "token=" + token + '&';
        if (this.props.navigation.getParam('selectedEntity', 'Orgão') != 'Orgão') {
            apiLink += 'entities=' + this.props.navigation.getParam('selectedEntityId', 'null') + '&';
        }
        if (this.props.navigation.getParam('selectedCategory', 'Categoria') != 'Categoria') {
            apiLink += 'categories=' + this.props.navigation.getParam('selectedCategoryId', 'null') + '&';
        }
        axios.get(apiLink)
            .then(function(response) {
                const events = response.data;
                if (!this.isCancelled)
                    self.setState({ events });
            })
            .catch(function(error) {
                console.log(error);
            });
        this.setState({ updateCall: false });
    }

    onSelect = updateCall => {
        this.setState(updateCall);
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
            <Event data={event} key={i} onPress={() => navigate('Event', { eventData: event })} />
        ));

        if (this.state.updateCall)
            this.getFavorites();

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
                <ScrollView stickyHeaderIndices={[1]} style={{ backgroundColor: 'white', height: '100%', marginBottom: '10%' }}>

                    <View style={{ paddingTop: '5%', marginHorizontal: '5%' }}>
                        <Text style={{ fontSize: 32, color: '#2c8f7f', textAlign: 'center', fontFamily: 'OpenSans-Regular' }}>Eventos</Text>
                    </View>

                    <View style={{ marginHorizontal: '5%', paddingTop: '5%', backgroundColor: 'white' }}>
                        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingBottom: '5%', backgroundColor: 'white' }}>

                            <View style={{ flex: 3 }}>
                                <Button style={{ width: '100%', height: 30, borderWidth: 1, borderColor: 'black' }} transparent onPress={() => navigate('Categories', { onSelect: this.onSelect })}>
                                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: '5%' }}>
                                        <View style={{ flex: 5 }}>
                                            <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedCategory', 'Categorias')}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Icon type='FontAwesome' name='angle-down' style={{ color: 'black', position: 'absolute', right: 0, fontSize: 22 }} />
                                        </View>
                                    </View>
                                </Button>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18, textAlign: 'center' }}>em</Text>
                            </View>

                            <View style={{ flex: 3 }}>
                                <Button style={{ width: '100%', height: 30, borderWidth: 1, borderColor: 'black' }} transparent onPress={() => navigate('Entities', { onSelect: this.onSelect })}>
                                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: '5%' }}>
                                        <View style={{ flex: 5 }}>
                                            <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedEntity', 'Orgão')}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Icon type='FontAwesome' name='angle-down' style={{ color: 'black', position: 'absolute', right: 0, fontSize: 22 }} />
                                        </View>
                                    </View>
                                </Button>
                            </View>

                        </View>
                    </View>

                    <View style={{ marginHorizontal: '5%', backgroundColor: 'white' }}>
                        {events}
                        {noEventsElement}
                    </View>
                </ScrollView >
            </View >
        );
    }
}
