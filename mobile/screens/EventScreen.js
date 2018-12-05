import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Image,
    Platform,
    Linking
} from 'react-native';
import { Font, AppLoading } from "expo";
import Expo from "expo";
import DropdownAlert from 'react-native-dropdownalert';
import { Root, View, Button, Icon, Text } from 'native-base';
import NewCustomHeader from '../components/NewCustomHeader.js';

export default class AgendaScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            imageLoaded: true,
            loading: true,
            event: null
        };

        this.redirectGoogleMaps = this.redirectGoogleMaps.bind(this);
        this.addEventToCalendar = this.addEventToCalendar.bind(this);
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
        let event = this.props.navigation.getParam('eventData', 'null');
        this.setState({ loading: false, event: event });
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

    redirectGoogleMaps() {

        Platform.OS === 'ios'
            ? Linking.openURL('http://maps.apple.com/maps?daddr=' + this.state.event.location)
            : Linking.openURL('http://maps.google.com/maps/geo:0,0?q=' + encodeURI(this.state.event.location));
    }

    async addEventToCalendar() {

        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CALENDAR);

        if (status === "granted") {
            let res = null;

            if (this.props.screenProps.language === "PT") {

                res = await Expo.Calendar.createEventAsync(Expo.Calendar.DEFAULT, {
                    title: this.state.event.title,
                    startDate: new Date(this.state.event.start_date),
                    endDate: new Date(this.state.event.end_date),
                    location: this.state.location,
                    timeZone: "UTC",
                    notes: this.state.event.description
                });

            } else {

                res = await Expo.Calendar.createEventAsync(Expo.Calendar.DEFAULT, {
                    title: this.state.event.title_english,
                    startDate: new Date(this.state.event.start_date),
                    endDate: new Date(this.state.event.end_date),
                    location: this.state.location,
                    timeZone: "UTC",
                    notes: this.state.event.description_english
                });

            }

            if (res !== null) {
                this.dropdown.alertWithType('success', global.dictionary["SUCCESS"][this.props.screenProps.language], global.dictionary["EVENT_ADDED_CALENDAR"][this.props.screenProps.language]);
            } else {
                this.dropdown.alertWithType('error', global.dictionary["ERROR"][this.props.screenProps.language], global.dictionary["EVENT_NOT_ADDED_CALENDAR"][this.props.screenProps.language]);
            }

        } else {
            this.dropdown.alertWithType('error', global.dictionary["ERROR"][this.props.screenProps.language], global.dictionary["EVENT_NOT_ADDED_CALENDAR"][this.props.screenProps.language]);
        }
    }

    getTitle() {
        if (this.props.screenProps.language === "PT") return this.state.event.title;
        else if (this.props.screenProps.language === "EN") return this.state.event.title_english;
    }

    getDescription() {
        if (this.props.screenProps.language === "PT") return this.state.event.description;
        else if (this.props.screenProps.language === "EN") return this.state.event.description_english;
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
                <NewCustomHeader navigation={this.props.navigation} text=' ' fave={true} language={this.props.screenProps.language} toggleLanguage={this.props.screenProps.toggleLanguage} />
                <ScrollView stickyHeaderIndices={[0]} style={{ backgroundColor: 'white', height: '100%' }}>

                    <View style={{ margin: '0%', padding: '0%', width: '100%', backgroundColor: 'white' }}>
                        <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.state.event.id } : require('../assets/images/default.png')}
                            style={styles.image}
                            onError={this.ImageLoadingError.bind(this)} />
                    </View>

                    <View style={{ margin: 0, borderBottomColor: 'black', borderBottomWidth: 1, backgroundColor: 'white' }}>
                        <Text style={{ textAlign: 'center', lineHeight: 45, fontSize: 20, color: 'black', fontFamily: 'OpenSans-Regular' }}>{this.getTitle()}</Text>
                    </View>

                    <View style={{ margin: 0, backgroundColor: 'white', flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}></View>
                        <Button className="map-button" rounded style={{ flex: 2, height: 35, backgroundColor: 'white', flexDirection: 'column' }} onPress={() => this.redirectGoogleMaps()}>
                            <Icon type='Entypo' name='location-pin' style={{ flex: 1, fontSize: 10, color: '#D05722' }} />
                            <Text style={{ color: 'black' }} >{global.dictionary["MAP"][this.props.screenProps.language]}</Text>
                        </Button>
                        <View style={{ flex: 1 }}></View>
                        <Button className="calendar-button" rounded style={{ flex: 2, height: 35, backgroundColor: 'white', flexDirection: 'column' }} onPress={this.addEventToCalendar}>
                            <Icon type='FontAwesome' name='calendar' style={{ flex: 1, fontSize: 10, color: '#D05722' }} />
                            <Text style={{ color: 'black' }} >{global.dictionary["CALENDAR"][this.props.screenProps.language]}</Text>
                        </Button>
                        <View style={{ flex: 1 }}></View>
                    </View>

                    <View style={{ marginHorizontal: '0%', backgroundColor: '#7C8589' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon type='Entypo' name='dot-single' style={{ flex: 1, fontSize: 20, color: 'white' }} />
                            <Text style={[styles.simpleText, { flex: 11 }]}>{this.getEventDate(this.state.event)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Icon type='Entypo' name='dot-single' style={{ flex: 1, fontSize: 20, color: 'white' }} />
                            <Text style={[styles.simpleText, { flex: 11 }]}>{this.state.event.location}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Icon type='Entypo' name='dot-single' style={{ flex: 1, fontSize: 20, color: 'white' }} />
                            <Text style={[styles.simpleText, { flex: 11 }]}>{global.dictionary["PRICE"][this.props.screenProps.language]}: {this.state.event.price}€</Text>
                        </View>

                    </View>

                    <View style={{ marginHorizontal: '5%', backgroundColor: 'white' }}>
                        <Text style={[styles.simpleText, { textAlign: 'justify' }]}>{this.getDescription()}</Text>
                    </View>
                </ScrollView>

                <DropdownAlert ref={ref => this.dropdown = ref} translucent={true}
                    defaultContainer={{ padding: 8, paddingTop: 0, flexDirection: 'row' }}
                    defaultTextContainer={{ flex: 1, paddingTop: 0 }} />
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
        color: 'white',
        fontFamily: 'OpenSans-Regular',
        fontSize: 16
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
