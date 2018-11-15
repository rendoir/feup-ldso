import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Image
} from 'react-native';
import { Font, AppLoading } from "expo";
import { Root, View, Button, Icon, Text } from 'native-base';
import NewCustomHeader from '../components/NewCustomHeader.js';

export default class AgendaScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            imageLoaded: true,
            loading: true
        };
    }

    ImageLoadingError() {
        this.setState({ imageLoaded: false });
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
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
            'DJB-Coffee-Shoppe-Espresso': require('../assets/fonts/DJB-Coffee-Shoppe-Espresso.ttf')
        });
        this.event = this.props.navigation.getParam('eventData', 'null');
        this.setState({ loading: false });
    }

    getEventDate(event) {
        let startDate = event.start_date;
        let endDate = event.end_date;
        let startDay = startDate.split('T')[0].split('-')[2];
        let startMonth = startDate.split('T')[0].split('-')[1];
        let startYear = startDate.split('T')[0].split('-')[0];
        let date = startDay + '-' + startMonth + '-' + startYear;

        if (endDate !== null) {
            let endDay = endDate.split('T')[0].split('-')[2];
            let endMonth = endDate.split('T')[0].split('-')[1];
            let endYear = endDate.split('T')[0].split('-')[0];
            date += ' até ' + endDay + '-' + endMonth + '-' + endYear;
        }

        return date;
    }

    render() {
        if (this.state.loading) {
            return (
                <Root>
                    <AppLoading />
                </Root>
            );
        }

        return (
            <View style={{ backgroundColor: 'white' }}>
                <NewCustomHeader text=' ' fave={true} />
                <ScrollView style={{ backgroundColor: 'white', height: '100%' }}>

                    <View style={{ margin: '0%', padding: '0%', width: '100%', backgroundColor: 'white' }}>
                        <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.event.id } : require('../assets/images/default.png')}
                            style={styles.image}
                            onError={this.ImageLoadingError.bind(this)} />
                    </View>

                    <View style={{ marginHorizontal: '5%', backgroundColor: 'white' }}>
                        <Text style={{ textAlign: 'left', lineHeight: 45, fontSize: 16, color: '#2c8f7f', fontFamily: 'DJB-Coffee-Shoppe-Espresso' }}>{this.event.title}</Text>
                    </View>

                    <View style={{ marginHorizontal: '5%', backgroundColor: '#f8f8d9' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon type='FontAwesome' name='calendar' style={{ flex: 1, fontSize: 13 }} />
                            <Text style={[styles.simpleText, { flex: 11 }]}>{this.getEventDate(this.event)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Icon type='Entypo' name='location-pin' style={{ flex: 1, fontSize: 13 }} />
                            <Text style={[styles.simpleText, { flex: 11 }]}>{this.event.location}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Icon type='FontAwesome' name='money' style={{ flex: 1, fontSize: 13 }} />
                            <Text style={[styles.simpleText, { flex: 11 }]}>Preço: {this.event.price}€</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                            <View style={{ flex: 1 }} />
                            <Button rounded style={{ flex: 3, height: 35, backgroundColor: '#2c8f7f' }}>
                                <Text>Mapa</Text>
                            </Button>
                            <View style={{ flex: 1 }} />
                            <Button rounded style={{ flex: 3, height: 35, backgroundColor: '#2c8f7f' }}>
                                <Text>Calendário</Text>
                            </Button>
                            <View style={{ flex: 1 }} />
                        </View>

                    </View>

                    <View style={{ marginHorizontal: '5%', backgroundColor: 'white' }}>
                        <Text style={[styles.simpleText, { textAlign: 'justify' }]}>{this.event.description}</Text>
                    </View>

                </ScrollView>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    textBlack: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        paddingLeft: 0
    },
    buttonText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        paddingLeft: 5
    },
    simpleText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 13
    },
    eventTitle: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
        fontWeight: 'bold'
    },
    image: {
        height: 300,
        width: null,
        flex: 1
    }
});
