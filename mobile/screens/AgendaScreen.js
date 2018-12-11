import React from 'react';
import {
    ScrollView,
    RefreshControl,
    StyleSheet,
    ActivityIndicator
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
            refreshing: false,
            loadingEvents: false
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
                    self.setState((prevState) => ({ events: [...prevState.events, ...evs], loadingEvents: false }));
                }

            })
            .catch(function(error) {
                console.log(error);
            });
        this.setState({ updateCall: false });
    }

    onSelect = updateCall => {
        this.setState(updateCall);
        this.setState({ events: [], eventsPage: 0 });
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
            this.setState({ eventsPage: page, loadingEvents: true });
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

        let loadingSpinner;
        if (this.state.loadingEvents) {
            loadingSpinner = (<ActivityIndicator size="large" color="#455A64" />);
        }

        return (
            <View style={styles.backgroundStyle}>
                <CustomHeader language={this.props.screenProps.language} toggleLanguage={this.props.screenProps.toggleLanguage} />

                <ScrollView className="scroll_view" refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />} stickyHeaderIndices={[1]} onScroll={this.handleScroll}
                    style={[styles.backgroundStyle, styles.scrollView]}>

                    <View style={styles.eventsLabelView}>
                        <Text style={styles.events}>{global.dictionary["EVENTS"][this.props.screenProps.language]}</Text>
                    </View>

                    <View style={[styles.mainHeaderView, styles.backgroundStyle]}>
                        <View style={[styles.headerView, styles.backgroundStyle]}>

                            <View style={styles.flex3}>
                                <Button style={[styles.button, styles.backgroundStyle]} className="categories-button" transparent onPress={() => navigate('Categories', { onSelect: this.onSelect, toggleLanguage: this.props.screenProps.toggleLanguage, language: this.props.screenProps.language })}>
                                    <View style={styles.entityView}>
                                        <View style={styles.flex5}>
                                            <Text style={styles.entityNameText} numberOfLines={1} uppercase={false}>{this.getCategoryName()}</Text>
                                        </View>
                                        <View style={styles.flex1}>
                                            <Icon type='FontAwesome' name='angle-down' style={styles.dropIcon} />
                                        </View>
                                    </View>
                                </Button>
                            </View>

                            <View style={styles.flex1}>
                                <Text style={styles.atText}>{global.dictionary["AT"][this.props.screenProps.language]}</Text>
                            </View>

                            <View style={styles.flex3}>
                                <Button style={[styles.button, styles.backgroundStyle]} className="entities-button" transparent onPress={() => navigate('Entities', { onSelect: this.onSelect, toggleLanguage: this.props.screenProps.toggleLanguage, language: this.props.screenProps.language })}>
                                    <View style={styles.entityView}>
                                        <View style={styles.flex5}>
                                            <Text style={styles.entityNameText} numberOfLines={1} uppercase={false}>{this.getEntityName()}</Text>
                                        </View>
                                        <View style={styles.flex1}>
                                            <Icon type='FontAwesome' name='angle-down' style={styles.dropIcon} />
                                        </View>
                                    </View>
                                </Button>
                            </View>
                        </View>
                    </View>

                    <View style={styles.eventView}>
                        {events}
                        {noEventsElement}
                        {loadingSpinner}
                    </View>
                </ScrollView >
            </View >
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: '#7C8589'
    },
    eventView: {
        marginHorizontal: '2%',
        backgroundColor: '#7C8589',
        marginBottom: '10%'
    },
    dropIcon: {
        color: 'white',
        position: 'absolute',
        right: 0,
        fontSize: 22
    },
    flex1: {
        flex: 1
    },
    flex3: {
        flex: 3
    },
    flex5: {
        flex: 5
    },
    entityNameText: {
        color: 'white',
        fontFamily: 'OpenSans-Regular',
        fontSize: 16,
        textAlign: 'left'
    },
    entityView: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: '1%'
    },
    button: {
        width: '100%',
        height: 30,
        borderWidth: 2,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: 'white'
    },
    atText: {
        color: 'white',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: 'center'
    },
    events: {
        fontSize: 32,
        color: 'white',
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular'
    },
    eventsLabelView: {
        paddingTop: '5%',
        marginHorizontal: '5%'
    },
    scrollView: {
        height: '100%',
        marginBottom: '10%'
    },
    mainHeaderView: {
        paddingHorizontal: '5%',
        paddingVertical: '7%'
    },
    headerView: {
        paddingHorizontal: '4%',
        justifyContent: 'center',
        flexDirection: 'row'
    }
});
