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
        switch (parseInt(month)) {
        case 1: return 'JAN';
        case 2: return 'FEV';
        case 3: return 'MAR';
        case 4: return 'ABR';
        case 5: return 'MAI';
        case 6: return 'JUN';
        case 7: return 'JUL';
        case 8: return 'AGO';
        case 9: return 'SET';
        case 10: return 'OUT';
        case 11: return 'NOV';
        case 12: return 'DEZ';
        default: return 'Error';
        }
    }

    onFavoriteCall() {
        this.props.onFavorite(this.props.id);
    }

    render() {
        return (
            <Card onPress={this.props.onPress} style={{ backgroundColor: 'white' }}>
                <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.props.id } : require('../assets/images/default.png')}
                    style={styles.image}
                    onError={this.ImageLoadingError.bind(this)}
                    onPress={this.props.onPress} />
                <View style={{ flexDirection: 'row', backgroundColor: 'white' }} onPress={this.props.onPress}>
                    <Badge style={{ flex: 1, backgroundColor: '#002040', margin: '3%', height: 68, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, lineHeight: 30 }} onPress={this.props.onPress}>{this.props.start_date.split('T')[0].split('-')[2]}</Text>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, lineHeight: 30 }} onPress={this.props.onPress}>{this.getMonthInString(this.props.start_date.split('T')[0].split('-')[1])}</Text>
                    </Badge>
                    <View style={{ flex: 5, marginRight: '3%', marginVertical: '3%' }} onPress={this.props.onPress}>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18, fontWeight: 'bold' }} numberOfLines={1} onPress={this.props.onPress}>{this.props.title}</Text>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 16 }} numberOfLines={1} onPress={this.props.onPress}>{this.props.location} - {this.props.start_date.split('T')[1].split(':')[0] + ':' + this.props.start_date.split('T')[1].split(':')[1]}</Text>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 16 }} numberOfLines={1} onPress={this.props.onPress}>Preço: {this.props.price}€</Text>
                    </View>
                    <Icon className="fave_icon" style={{ fontSize: 35, flex: 1, alignSelf: 'center', color: '#D05722' }} type='FontAwesome' name={this.props.is_favorite ? 'heart' : 'heart-o'} onPress={this.onFavoriteCall} />
                </View>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 160,
        width: null,
        flex: 1
    }
});
