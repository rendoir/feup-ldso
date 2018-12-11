import React from 'react';
import {
    StyleSheet,
    Image
} from 'react-native';

import { Card, Icon, View, Badge, Text } from 'native-base';

export default class Event extends React.Component {

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
        return global.calendar[parseInt(month)][this.props.language];
    }

    onFavoriteCall() {
        this.props.onFavorite(this.props.id);
    }

    render() {
        return (
            <Card onPress={this.props.onPress} style={styles.card}>
                <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.props.id } : require('../assets/images/default.png')}
                    style={styles.image}
                    onError={this.ImageLoadingError.bind(this)}
                    onPress={this.props.onPress} />
                <View style={styles.badgeView} onPress={this.props.onPress}>
                    <Badge style={styles.badge}>
                        <Text style={styles.badgeText} onPress={this.props.onPress}>{this.props.start_date.split('T')[0].split('-')[2]}</Text>
                        <Text style={styles.badgeText} onPress={this.props.onPress}>{this.getMonthInString(this.props.start_date.split('T')[0].split('-')[1])}</Text>
                    </Badge>
                    <View style={styles.mainView} onPress={this.props.onPress}>
                        <Text style={styles.title} numberOfLines={1} onPress={this.props.onPress}>{this.getTitle()}</Text>
                        <Text style={styles.simpleText} numberOfLines={1} onPress={this.props.onPress}>{this.props.location} - {this.props.start_date.split('T')[1].split(':')[0] + ':' + this.props.start_date.split('T')[1].split(':')[1]}</Text>
                        <Text style={styles.simpleText} numberOfLines={1} onPress={this.props.onPress}>{global.dictionary["PRICE"][this.props.language]}: {this.getPrice()}</Text>
                    </View>
                    <Icon className="fave_icon" style={styles.faveIcon} type='FontAwesome' name={this.props.is_favorite ? 'heart' : 'heart-o'} onPress={this.onFavoriteCall} />
                </View>
            </Card>
        );
    }

    getTitle() {
        if (this.props.language === "PT")      return this.props.title;
        else if (this.props.language === "EN") return this.props.title_english;
    }

    getPrice() {
        return (this.props.price == 0) ? global.dictionary["FREE"][this.props.language] : (this.props.price + '€');
    }
}

const styles = StyleSheet.create({
    image: {
        height: 160,
        width: null,
        flex: 1
    },
    faveIcon: {
        fontSize: 35,
        flex: 2,
        alignSelf: 'center',
        color: '#FF5722'
    },
    simpleText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 16
    },
    title: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        fontWeight: 'bold'
    },
    badgeText: {
        color: 'white',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        lineHeight: 30
    },
    badge: {
        flex: 2,
        backgroundColor: '#455A64',
        margin: '3%',
        height: 68,
        alignItems: 'center'
    },
    badgeView: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    mainView: {
        flex: 9,
        marginRight: '3%',
        marginVertical: '3%'
    },
    card: {
        backgroundColor: 'white'
    }
});
