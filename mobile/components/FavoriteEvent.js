import React from 'react';
import {
    StyleSheet,
    Image
} from 'react-native';

import { Card, Icon, View, Text } from 'native-base';

export default class FavoriteEvent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            imageLoaded: true
        };

        this.onFavoriteCall = this.onFavoriteCall.bind(this);

    }

    ImageLoadingError() {
        this.setState({ imageLoaded: false });
    }

    getMonthInString(month) {
        return global.fullCalendar[parseInt(month)][this.props.language];
    }

    getDateString() {
        let day = this.props.start_date.split('T')[0].split('-')[2];
        let month = this.getMonthInString(this.props.start_date.split('T')[0].split('-')[1]);
        let time = this.props.start_date.split('T')[1].split(':')[0] + ':' + this.props.start_date.split('T')[1].split(':')[1];
        let date = "";
        if (this.props.language === "PT")
            date = day + ' de ' + month + ' às ' + time;
        else if (this.props.language === "EN")
            date = month + ' ' + day + ' at ' + time;
        return date;
    }

    getPrice() {
        return (this.props.price == 0) ? global.dictionary["FREE"][this.props.language] : (this.props.price + '€');
    }

    getTitle() {
        if (this.props.language === "PT")      return this.props.title;
        else if (this.props.language === "EN") return this.props.title_english;
    }

    onFavoriteCall() {
        this.props.onFavorite(this.props.id);
    }

    render() {
        return (
            <Card onPress={this.props.onPress} style={{ backgroundColor: 'white', height: 125 }}>

                <View style={styles.mainView}>
                    <View style={styles.imageView}>
                        <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.props.id } : require('../assets/images/default.png')}
                            style={styles.image}
                            onError={this.ImageLoadingError.bind(this)}
                            onPress={this.props.onPress} />
                    </View>
                    <View style={styles.infoView}>
                        <Text style={styles.title} numberOfLines={1} onPress={this.props.onPress}>{this.getTitle()}</Text>
                        <Text style={styles.date} numberOfLines={1} onPress={this.props.onPress}>{this.getDateString()}</Text>
                        <View style={styles.iconView} >
                            <Text style={styles.price} numberOfLines={1} onPress={this.props.onPress}>{global.dictionary["PRICE"][this.props.language]}: {this.getPrice()}</Text>
                            <Icon className="fave_icon" style={styles.faveIcon} type='FontAwesome' name={this.props.is_favorite ? 'heart' : 'heart-o'} onPress={this.onFavoriteCall} />
                        </View>
                    </View>
                </View>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: null,
        flex: 1
    },
    imageView: {
        flex: 2
    },
    mainView: {
        flexDirection: 'row',
        height: '100%'
    },
    infoView: {
        flex: 5,
        borderLeftColor: '#D05722',
        borderLeftWidth: 5,
        justifyContent: 'space-between',
        paddingHorizontal: '2%',
        paddingBottom: '2%'
    },
    title: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
        fontWeight: 'bold'
    },
    date: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18
    },
    iconView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    price: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18
    },
    faveIcon: {
        fontSize: 25,
        alignSelf: 'center',
        color: '#FF5722'
    }
});
