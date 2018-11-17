import React from 'react';
import {
    ScrollView
} from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, View, Card, Button, Icon, Text } from 'native-base';
import axios from 'axios';
import { SecureStore } from 'expo';
import Event from '../components/Event';
import CustomHeader from '../components/CustomHeader';

export default class AgendaScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            events: [],
            entity: null,
            category: null,
            updateCall: false
        };

        this.onFavorite = this.onFavorite.bind(this);
        this.getEventsFromApi = this.getEventsFromApi.bind(this);
    }

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
        await Font.loadAsync({
            'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
            'DJB-Coffee-Shoppe-Espresso': require('../assets/fonts/DJB-Coffee-Shoppe-Espresso.ttf')
        });
        this.getEventsFromApi();
        this.setState({ loading: false });
        this.didFocusSubscription();
    }

    async getEventsFromApi() {
        let token = await SecureStore.getItemAsync('access_token');

        let self = this;
        let apiLink = 'http://' + global.api + ':3030/events?';
        apiLink += "user_id=" + global.userId + '&';
        apiLink += "token=" + token + '&';
        if (this.props.navigation.getParam('selectedEntity', 'Entidade') != 'Entidade') {
            apiLink += 'entities=' + this.props.navigation.getParam('selectedEntityId', 'null') + '&';
        }
        if (this.props.navigation.getParam('selectedCategory', 'Categoria') != 'Categoria') {
            apiLink += 'categories=' + this.props.navigation.getParam('selectedCategoryId', 'null') + '&';
        }

        axios.get(apiLink)
            .then(function(response) {

                if (!this.isCancelled) {
                    const events = response.data.map((event) => {
                        let isFav = false;
                        if (event.is_favorite !== undefined)
                            isFav = event.is_favorite;
                        else if (event.favorite !== undefined)
                            isFav = (event.favorite.length == 1);

                        return { ...event, is_favorite: isFav };
                    });
                    self.setState({ events });
                }

            })
            .catch(function(error) {
                console.log(error);
            });
        this.setState({ updateCall: false });
    }

    onSelect = updateCall => {
        this.setState(updateCall);
    };

    didFocusSubscription() {
        this.props.navigation.addListener('didFocus', () => {
            this.getEventsFromApi();
        });
    }

    async onFavorite(event_id) {
        let token = await SecureStore.getItemAsync('access_token');
        let self = this;

        let apiLink = 'http://' + global.api + ':3030/favorite';
        axios.post(apiLink,
            {
                user_id: global.userId,
                event_id: event_id,
                token: token
            })
            .then(function() {
                const list = self.state.events.map((ev) => (
                    ev.id == event_id ? { ...ev, is_favorite: !ev.is_favorite } : ev
                ));
                self.setState({ events: list });
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

        const events = this.state.events.map((event) => (
            <Event {...event} key={event.id} onPress={() => navigate('Event', { eventData: event })} onFavorite={this.onFavorite} />
        ));

        if (this.state.updateCall)
            this.getEventsFromApi();

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
            <View style={{ backgroundColor: '#F0F0F0' }}>
                <CustomHeader />
                <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: '#F0F0F0', height: '100%', marginBottom: '10%' }}>

                    <View style={{ paddingHorizontal: '5%', paddingVertical: '7%', backgroundColor: '#F0F0F0' }}>
                        <View style={{ paddingHorizontal: '4%', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#F0F0F0' }}>

                            <View style={{ flex: 3 }}>
                                <Button style={{ width: '100%', height: 30, borderWidth: 2, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, borderColor: '#002040', backgroundColor: '#f0F0F0' }} transparent onPress={() => navigate('Categories', { onSelect: this.onSelect })}>
                                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: '1%' }}>
                                        <View style={{ flex: 5 }}>
                                            <Text style={{ color: '#002040', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedCategory', 'Categorias')}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Icon type='FontAwesome' name='angle-down' style={{ color: '#002040', position: 'absolute', right: 0, fontSize: 22 }} />
                                        </View>
                                    </View>
                                </Button>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#002040', fontFamily: 'OpenSans-Regular', fontSize: 18, textAlign: 'center' }}>em</Text>
                            </View>

                            <View style={{ flex: 3 }}>
                                <Button style={{ width: '100%', height: 30, borderWidth: 2, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, borderColor: '#002040', backgroundColor: '#f0F0F0' }} transparent onPress={() => navigate('Entities', { onSelect: this.onSelect })}>
                                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: '1%' }}>
                                        <View style={{ flex: 5 }}>
                                            <Text style={{ color: '#002040', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.props.navigation.getParam('selectedEntity', 'Entidade')}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Icon type='FontAwesome' name='angle-down' style={{ color: '#002040', position: 'absolute', right: 0, fontSize: 22 }} />
                                        </View>
                                    </View>
                                </Button>
                            </View>

                        </View>
                    </View>

                    <View style={{ marginHorizontal: '2%', backgroundColor: '#F0F0F0' }}>
                        {events}
                        {noEventsElement}
                    </View>
                </ScrollView >
            </View >
        );
    }
}
