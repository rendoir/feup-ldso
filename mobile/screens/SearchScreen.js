import React from 'react';
import {
    ScrollView,
    RefreshControl
} from 'react-native';
import { Font, AppLoading, SecureStore } from "expo";
import { Root, View, Card, Icon, Text, Item, Input } from 'native-base';
import axios from 'axios';
import Event from '../components/Event';
import CustomHeader from '../components/CustomHeader';

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            searchText: "",
            events: [],
            token: null,
            refreshing: false
        };

        this.onFavorite = this.onFavorite.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    static navigationOptions = {
        header: null
    };


    async componentDidMount() {
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });
        await Font.loadAsync({
            'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
            'DJB-Coffee-Shoppe-Espresso': require('../assets/fonts/DJB-Coffee-Shoppe-Espresso.ttf')
        });
        let token = await SecureStore.getItemAsync('access_token');
        this.doSearch();
        this.setState({ loading: false, token: token });
        this.didFocusSubscription();
    }

    doSearch() {
        let self = this;

        if (self.state.searchText == "" || self.state.searchText == null) {
            self.setState({ events: [] });
            return;
        }

        let apiLink = 'http://' + global.api + ':3030/search/events?text=' + self.state.searchText;
        apiLink += "&user_id=" + global.userId + '&';
        apiLink += "token=" + this.state.token + '&';
        apiLink += "lang=" + this.props.screenProps.language;

        axios.get(apiLink)
            .then(function(response) {

                const events = response.data.map((event) => {
                    let isFav = false;
                    if (event.is_favorite !== undefined)
                        isFav = event.is_favorite;
                    else if (event.favorite !== undefined)
                        isFav = (event.favorite.length == 1);

                    return { ...event, is_favorite: isFav };
                });
                self.setState({ events });

            })
            .catch(function(error) {
                console.log(error);
            });
    }

    didFocusSubscription() {
        this.props.navigation.addListener('didFocus', () => {

            this.doSearch();
        });
    }

    async onFavorite(event_id) {
        let token = await SecureStore.getItemAsync('access_token');
        let self = this;

        let apiLink = 'http://' + global.api + ':3030/favorite';
        axios.post(apiLink, {
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

    _onRefresh() {
        this.setState({ refreshing: true, events: [], eventsPage: 0, searchText: "" });
        this.doSearch();
        this.setState({ refreshing: false });
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

        let events = this.state.events.map((event) => (
            <Event language={this.props.screenProps.language} {...event} key={event.id} onPress={() => navigate('Event', { eventData: event })} onFavorite={this.onFavorite} />
        ));


        let noEventsElement;
        if (this.state.events.length == 0 || this.state.searchText == '' || this.state.searchText == null) {
            events.length = 0;
            noEventsElement = (
                <Card>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: '5%' }}>
                        <Icon type="Feather" name="info" />
                        <Text>{global.dictionary["NO_SEARCH_RESULTS"][this.props.screenProps.language]}</Text>
                    </View>
                </Card>
            );
        }

        return (
            <View style={{ backgroundColor: '#7C8589' }}>
                <CustomHeader language={this.props.screenProps.language} toggleLanguage={this.props.screenProps.toggleLanguage}/>
                <ScrollView stickyHeaderIndices={[2]} style={{ backgroundColor: '#7C8589', height: '100%' }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />} >

                    <View style={{ marginHorizontal: '5%', paddingTop: '5%', paddingBottom: '2%', backgroundColor: '#7C8589' }}>
                        <Text style={{ fontSize: 32, color: 'white', textAlign: 'center', fontFamily: 'OpenSans-Regular' }}>{global.dictionary["SEARCH"][this.props.screenProps.language]}</Text>

                        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingBottom: '5%', backgroundColor: '#7C8589' }}>
                            <View style={{ flex: 1 }}>
                                <Text> </Text>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Item style={{ height: 30, borderBottomWidth: 3, borderColor: 'white' }}>
                                    <Input style={{ fontSize: 20, color: 'white', width: '100%', height: 30, borderWidth: 2, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, borderColor: 'white', backgroundColor: '#7C8589' }} className="search-input" onChangeText={(searchText) => { this.setState({ searchText }); this.doSearch(); }} />
                                    <Icon style={{ fontSize: 20, color: 'white' }} type="FontAwesome" name="search" />
                                </Item>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text> </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: '2%', backgroundColor: '#7C8589' }}>
                        {events}
                        {noEventsElement}
                    </View>

                </ScrollView>
            </View >
        );
    }
}
