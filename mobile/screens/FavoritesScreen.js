import React from 'react';
import {
    ScrollView,
    RefreshControl
} from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, View, Card, Icon, Text } from 'native-base';
import axios from 'axios';
import { SecureStore } from 'expo';
import FavoriteEvent from '../components/FavoriteEvent';
import CustomHeader from '../components/CustomHeader';

export default class FavoritesScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            events: [],
            entity: null,
            category: null,
            updateCall: false,
            eventsPage: 0,
            refreshing: false
        };

        this.handleScroll = this.handleScroll.bind(this);
        this.onFavorite = this.onFavorite.bind(this);
        this.getFavoriteEvents = this.getFavoriteEvents.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
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
        this.getFavoriteEvents();
        this.setState({ loading: false, events: [], eventsPage: 0 });
        this.didFocusSubscription();
    }

    async getFavoriteEvents() {
        let token = await SecureStore.getItemAsync('access_token');

        let self = this;
        let apiLink = 'http://' + global.api + ':3030/events?limit=' + 10 + '&offset=' + (this.state.eventsPage * 10) + '&';
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
                    const evs = response.data.map((event) => {
                        let isFav = false;
                        if (event.is_favorite !== undefined)
                            isFav = event.is_favorite;
                        else if (event.favorite !== undefined)
                            isFav = (event.favorite.length == 1);

                        return { ...event, is_favorite: isFav };
                    });
                    self.setState({ events: [...self.state.events, ...evs] });
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
            this.setState({ events: [], eventsPage: 0 });
            this.getFavoriteEvents();
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

    handleScroll(event) {
        let scrollOffsetY = event.nativeEvent.contentOffset.y;
        if (scrollOffsetY > (5 * (this.state.eventsPage + 1) * 130)) {
            let page = this.state.eventsPage + 1;
            this.setState({ eventsPage: page });
            this.getFavoriteEvents();
        }
    }

    _onRefresh() {
        this.setState({ refreshing: true, events: [], eventsPage: 0 });
        this.getFavoriteEvents();
        this.setState({refreshing: false});
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
            <FavoriteEvent {...event} key={event.id} onPress={() => navigate('Event', { eventData: event })} onFavorite={this.onFavorite} />
        ));

        if (this.state.updateCall)
            this.getFavoriteEvents();

        let noEventsElement;
        if (this.state.events.length == 0) {
            noEventsElement = (
                <Card>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: '5%' }}>
                        <Icon type="Feather" name="info" />
                        <Text>Não há eventos favoritos para mostrar.</Text>
                    </View>
                </Card>
            );
        }

        return (
            <View style={{ backgroundColor: '#7C8589' }}>
                <CustomHeader />
                <ScrollView className="scroll_view" refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} /> } stickyHeaderIndices={[0]} style={{ backgroundColor: '#7C8589', height: '100%', marginBottom: '10%' }} onScroll={this.handleScroll}>

                    <View style={{ marginVertical: '3%', paddingHorizontal: '5%', backgroundColor: '#7C8589', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, color: 'white' }}>Favoritos</Text>
                    </View>

                    <View style={{ marginHorizontal: '2%', backgroundColor: '#7C8589', marginBottom: '10%' }}>
                        {events}
                        {noEventsElement}
                    </View>
                </ScrollView >
            </View >
        );
    }
}
