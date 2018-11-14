import React from 'react';
import {
    ScrollView
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
            .then(function (response) {
                const events = response.data;
                self.setState({ events });
            })
            .catch(function (error) {
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
            <View style={{ backgroundColor: '#F0F0F0' }}>
                <CustomHeader />
                <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: '#F0F0F0', height: '100%' }}>

                    <View style={{ marginHorizontal: '5%', paddingTop: '5%', backgroundColor: '#F0F0F0' }}>

                        <View style={{ justifyContent: 'center', flexDirection: 'row', paddingBottom: '5%', backgroundColor: '#F0F0F0' }}>
                            <View style={{ flex: 1 }}>
                                <Text> </Text>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Item style={{ height: 30, borderBottomWidth: 3, borderColor: '#002040' }}>
                                    <Input style={{ fontSize: 20, width: '100%', height: 30, borderWidth: 2, borderTopWidth: 0, borderRightWidth: 0, borderLeftWidth: 0, borderColor: '#002040', backgroundColor: '#f0F0F0' }} onChangeText={(searchText) => { this.setState({ searchText }); this.doSearch(); }} />
                                    <Icon style={{ fontSize: 20 }} type="FontAwesome" name="search" />
                                </Item>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text> </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: '2%', backgroundColor: '#F0F0F0' }}>
                        {events}
                        {noEventsElement}
                    </View>

                </ScrollView>
            </View >
        );
    }
}
