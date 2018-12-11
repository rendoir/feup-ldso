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
            if (this.props.screenProps.language === 'PT')
                date += ' até ';
            else
                date += ' to ';
            date += endDay + '-' + endMonth + '-' + endYear;
        }

        return date;
    }

    getEventTime(event){
        let startTime = event.start_date.split('T')[1];
        startTime = startTime.split(':')[0] + ':' + startTime.split(':')[1] + (this.props.screenProps.language === "PT" ? ' horas' : ' hours');
        return startTime;
    }

    redirectGoogleMaps() {

        Platform.OS === 'ios'
            ? Linking.openURL('http://maps.apple.com/maps?daddr=' + this.state.event.location)
            : Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + encodeURI(this.state.event.location));
    }

    async addEventToCalendar() {

        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.CALENDAR);

        if (status === "granted") {
            let res = null;

            let endDate = this.state.event.end_date;
            if (this.state.event.end_date == null) {
                endDate = new Date(this.state.event.start_date);
                endDate.setHours(endDate.getHours() + 1);
            }

            if (this.props.screenProps.language === "PT") {

                res = await Expo.Calendar.createEventAsync(Expo.Calendar.DEFAULT, {
                    title: this.state.event.title,
                    startDate: new Date(this.state.event.start_date),
                    endDate: new Date(endDate),
                    location: this.state.location,
                    timeZone: "UTC",
                    notes: this.state.event.description
                });

            } else {

                res = await Expo.Calendar.createEventAsync(Expo.Calendar.DEFAULT, {
                    title: this.state.event.title_english,
                    startDate: new Date(this.state.event.start_date),
                    endDate: new Date(endDate),
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

    getEntity(){
        if (this.props.screenProps.language === 'PT'){
            if (this.state.event.entity == null)
                return "Entidade promotora: " + this.state.event.initials;
            else
                return "Entidade promotora: " + this.state.event.entity.initials;
        } else {
            if (this.state.event.entity == null)
                return "Promoting entity: " + this.state.event.initials;
            else
                return "Promoting entity: " + this.state.event.entity.initials;
        }
    }

    getPrice() {
        if (this.state.event.price == 0)
            return this.props.screenProps.language === "PT" ? 'Gratuito' : 'Free';
        else
            return this.state.event.price + "€";
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
                <ScrollView stickyHeaderIndices={[1]} style={styles.scrollView}>

                    <View style={styles.imageView}>
                        <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.state.event.id } : require('../assets/images/default.png')}
                            style={styles.image}
                            onError={this.ImageLoadingError.bind(this)} />
                    </View>

                    <View style={styles.titleView}>
                        <Text style={styles.eventTitle}>{this.getTitle()}</Text>
                    </View>

                    <View style={styles.buttonsView}>
                        <Button className="map-button" rounded style={styles.button} onPress={() => this.redirectGoogleMaps()}>
                            <Icon type='Entypo' name='location-pin' style={styles.buttonIcon} />
                            <Text style={styles.buttonText} >{global.dictionary["MAP"][this.props.screenProps.language]}</Text>
                        </Button>
                        <Button className="calendar-button" rounded style={styles.button} onPress={this.addEventToCalendar}>
                            <Icon type='FontAwesome' name='calendar' style={styles.buttonIcon} />
                            <Text style={styles.buttonText} >{global.dictionary["CALENDAR"][this.props.screenProps.language]}</Text>
                        </Button>
                    </View>

                    <View style={styles.listView}>
                        <View style={styles.listItemView}>
                            <Icon type='FontAwesome' name='circle' style={styles.dotIcon} />
                            <Text style={styles.simpleText}>{this.getEventDate(this.state.event)}</Text>
                        </View>

                        <View style={styles.listItemView}>
                            <Icon type='FontAwesome' name='circle' style={styles.dotIcon} />
                            <Text style={styles.simpleText}>{this.getEventTime(this.state.event)}</Text>
                        </View>

                        <View style={styles.listItemView}>
                            <Icon type='FontAwesome' name='circle' style={styles.dotIcon} />
                            <Text style={styles.simpleText}>{this.state.event.location}</Text>
                        </View>

                        <View style={styles.listItemView}>
                            <Icon type='FontAwesome' name='circle' style={styles.dotIcon} />
                            <Text style={styles.simpleText}>{global.dictionary["PRICE"][this.props.screenProps.language]}: {this.getPrice()}</Text>
                        </View>

                        <View style={styles.listItemView}>
                            <Icon type='FontAwesome' name='circle' style={styles.dotIcon} />
                            <Text style={styles.simpleText}>{this.getEntity()}</Text>
                        </View>

                    </View>

                    <View style={styles.descriptionView}>
                        <Text style={styles.descriptionText}>{this.getDescription()}</Text>
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
    buttonsView: {
        marginVertical: '3%',
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    button: {
        flex: 1,
        height: 40,
        backgroundColor: 'white',
        marginHorizontal: '10%'
    },
    buttonText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        textAlign: 'center',
        flex: 2
    },
    buttonIcon: {
        flex: 1,
        fontSize: 18,
        color: '#D05722'
    },
    simpleText: {
        color: 'white',
        fontFamily: 'OpenSans-Regular',
        fontSize: 16,
        flex: 11
    },
    descriptionView: {
        marginHorizontal: '5%',
        backgroundColor: 'white',
        marginBottom: '15%',
        marginTop: '5%'
    },
    descriptionText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 16,
        textAlign: 'center'
    },
    titleView: {
        margin: 0,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    listView: {
        paddingTop: '5%',
        paddingBottom: '2%',
        paddingLeft: '3%',
        marginHorizontal: '0%',
        backgroundColor: '#7C8589'
    },
    listItemView: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: '3%'
    },
    eventTitle: {
        color: '#455A64',
        fontFamily: 'OpenSans-Regular',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 45
    },
    dotIcon: {
        flex: 1,
        fontSize: 13,
        color: 'white'
    },
    imageView: {
        margin: '0%',
        padding: '0%',
        width: '100%',
        backgroundColor: 'white'
    },
    image: {
        height: 250,
        width: null,
        flex: 1
    },
    scrollView: {
        backgroundColor: 'white',
        height: '100%'
    }
});
