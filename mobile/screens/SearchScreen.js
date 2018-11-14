import React from 'react';
import {
    ScrollView
} from 'react-native';
import { Font, AppLoading, SecureStore} from "expo";
import { Root, View, Card, Icon, Text, Item, Input } from 'native-base';
import axios from 'axios';
import Event from '../components/Event';

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            searchText: "",
            events: [],
            token: null
        };

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
    }

    doSearch() {
        let self = this;
        if (self.state.searchText == "" || self.state.searchText == null) {
            self.setState({ events: [] });
            return;
        }


        let apiLink = 'http://' + global.api + ':3030/search/events?text=' + self.state.searchText;
        apiLink += "&user_id=" + global.userId + '&';
        apiLink += "token=" + this.state.token;

        axios.get(apiLink)
            .then(function(response) {
                const events = response.data;
                self.setState({ events });
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

        const events = this.state.events.map((event, i) => (
            <Event data={event} key={i} />
        ));

        let noEventsElement;
        if (this.state.events.length == 0 || this.state.searchText == '' || this.state.searchText == null) {
            events.length = 0;
            noEventsElement = (
                <Card>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: '5%' }}>
                        <Icon type="Feather" name="info" />
                        <Text>Não há eventos para a pesquisa feita.</Text>
                    </View>
                </Card>
            );
        }

        return (
            <View style={{ backgroundColor: 'white' }}>
                <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: 'white', height: '100%' }}>

                    <View style={{ marginHorizontal: '5%', paddingTop: '5%', backgroundColor: 'white' }}>

                        <Text style={{ fontSize: 32, color: '#2c8f7f', textAlign: 'center', fontFamily: 'OpenSans-Regular' }}>Pesquisa</Text>

                        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingBottom: '5%', backgroundColor: 'white' }}>
                            <View style={{ flex: 1 }}>
                                <Text> </Text>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Item regular style={{ height: 30 }}>
                                    <Input onChangeText={(searchText) =>{ this.setState({ searchText }); this.doSearch(); }} />
                                    <Icon type="FontAwesome" name="search" />
                                </Item>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text> </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: '5%', backgroundColor: 'white' }}>
                        {events}
                        {noEventsElement}
                    </View>

                </ScrollView>
            </View >
        );
    }
}
