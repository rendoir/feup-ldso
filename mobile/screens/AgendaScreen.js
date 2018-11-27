import React from 'react';
import {
    ScrollView,
    RefreshControl
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
            updateCall: false,
            eventsPage: 0,
            refreshing: false
        };

        this.handleScroll = this.handleScroll.bind(this);
        this.onFavorite = this.onFavorite.bind(this);
        this.getEventsFromApi = this.getEventsFromApi.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.didFocusSubscription = this.didFocusSubscription.bind(this);
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
        this.setState({ loading: false, events: [], eventsPage: 0 });
        this.getEventsFromApi();
        this.didFocusSubscription();
    }

    async getEventsFromApi() {
        let token = await SecureStore.getItemAsync('access_token');

        let self = this;
        let apiLink = 'http://' + global.api + ':3030/events?limit=' + 10 + '&offset=' + (this.state.eventsPage * 10) + '&';
        apiLink += "user_id=" + global.userId + '&';
        apiLink += "token=" + token + '&';
        if (this.props.navigation.getParam('selectedEntity', 'all') != 'all') {
            apiLink += 'entities=' + this.props.navigation.getParam('selectedEntityId', 'null') + '&';
        }
        if (this.props.navigation.getParam('selectedCategory', 'all') != 'all') {
            apiLink += 'categories=' + this.props.navigation.getParam('selectedCategoryId', 'null') + '&';
        }

        console.log(this.state.events);
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
                    console.log('EVS');
                    console.log(evs);
                    self.setState((prevState) => ({ events: [...prevState.events, ...evs] }));
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

    handleScroll(event) {
        let scrollOffsetY = event.nativeEvent.contentOffset.y;
        if (scrollOffsetY > (5 * (this.state.eventsPage + 1) * 130)) {
            let page = this.state.eventsPage + 1;
            this.setState({ eventsPage: page });
            this.getEventsFromApi();
        }
    }

    _onRefresh() {
        this.setState({ refreshing: true, events: [], eventsPage: 0 });
        this.getEventsFromApi();
        this.setState({ refreshing: false });
    }

    getCategoryName() {
        let defaultName = global.dictionary["CATEGORIES"][this.props.screenProps.language];
        let allName = 'all';
        let category = this.props.navigation.getParam('selectedCategory', defaultName);
        if (category !== defaultName && category !== allName) {
            if (this.props.screenProps.language === "PT") return category.name;
            else if (this.props.screenProps.language === "EN") return category.name_english;
        } else return defaultName;
    }

    getEntityName() {
        let defaultName = global.dictionary["ENTITIES"][this.props.screenProps.language];
        let allName = 'all';
        let entity = this.props.navigation.getParam('selectedEntity', defaultName);
        if (entity !== defaultName && entity !== allName)
            return entity;
        else return defaultName;
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
            <Event language={this.props.screenProps.language} {...event} key={event.id} onPress={() => navigate('Event', { eventData: event })} onFavorite={this.onFavorite} />
        ));

        if (this.state.updateCall)
            this.getEventsFromApi();

        let noEventsElement;
        if (this.state.events.length == 0) {
            noEventsElement = (
                <Card>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: '5%' }}>
                        <Icon type="Feather" name="info" className="no-events" />
                        <Text>{global.dictionary["NO_EVENTS"][this.props.screenProps.language]}</Text>
                    </View>
                </Card>
            );
        }

        return (
            <View style={{ backgroundColor: '#F0F0F0' }}>
                <CustomHeader language={this.props.screenProps.language} toggleLanguage={this.props.screenProps.toggleLanguage} />

                <ScrollView className="scroll_view" refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />} stickyHeaderIndices={[1]} onScroll={this.handleScroll}
                    style={{ backgroundColor: '#F0F0F0', height: '100%', marginBottom: '10%' }}>

                    <View style={{ paddingTop: '5%', marginHorizontal: '5%' }}>
                        <Text style={{ fontSize: 32, color: '#2c8f7f', textAlign: 'center', fontFamily: 'OpenSans-Regular' }}>{global.dictionary["EVENTS"][this.props.screenProps.language]}</Text>
                    </View>

                    <View style={{ paddingHorizontal: '5%', paddingVertical: '7%', backgroundColor: '#F0F0F0' }}>
                        <View style={{ paddingHorizontal: '4%', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#F0F0F0' }}>

                            <View style={{ flex: 3 }}>
                                <Button style={{ width: '100%', height: 30, borderWidth: 2, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, borderColor: '#002040', backgroundColor: '#f0F0F0' }} className="categories-button" transparent onPress={() => navigate('Categories', { onSelect: this.onSelect, toggleLanguage: this.props.screenProps.toggleLanguage, language: this.props.screenProps.language })}>
                                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: '1%' }}>
                                        <View style={{ flex: 5 }}>
                                            <Text style={{ color: '#002040', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.getCategoryName()}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Icon type='FontAwesome' name='angle-down' style={{ color: '#002040', position: 'absolute', right: 0, fontSize: 22 }} />
                                        </View>
                                    </View>
                                </Button>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#002040', fontFamily: 'OpenSans-Regular', fontSize: 18, textAlign: 'center' }}>{global.dictionary["AT"][this.props.screenProps.language]}</Text>
                            </View>

                            <View style={{ flex: 3 }}>
                                <Button style={{ width: '100%', height: 30, borderWidth: 2, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, borderColor: '#002040', backgroundColor: '#f0F0F0' }} className="entities-button" transparent onPress={() => navigate('Entities', { onSelect: this.onSelect, toggleLanguage: this.props.screenProps.toggleLanguage, language: this.props.screenProps.language })}>
                                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: '1%' }}>
                                        <View style={{ flex: 5 }}>
                                            <Text style={{ color: '#002040', fontFamily: 'OpenSans-Regular', fontSize: 16, textAlign: 'left' }} numberOfLines={1} uppercase={false}>{this.getEntityName()}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Icon type='FontAwesome' name='angle-down' style={{ color: '#002040', position: 'absolute', right: 0, fontSize: 22 }} />
                                        </View>
                                    </View>
                                </Button>
                            </View>
                        </View>
                    </View>


                    <View style={{ marginHorizontal: '2%', backgroundColor: '#F0F0F0', marginBottom: '10%' }}>
                        {events}
                        {noEventsElement}
                    </View>
                </ScrollView >
            </View >
        );
    }
}
