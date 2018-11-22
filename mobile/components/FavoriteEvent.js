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
        switch (parseInt(month)) {
        case 1: return 'Janeiro';
        case 2: return 'Fevereiro';
        case 3: return 'Março';
        case 4: return 'Abril';
        case 5: return 'Maio';
        case 6: return 'Junho';
        case 7: return 'Julho';
        case 8: return 'Agosto';
        case 9: return 'Setembro';
        case 10: return 'Outubro';
        case 11: return 'Novembro';
        case 12: return 'Dezembro';
        default: return 'Error';
        }
    }

    getDateinString() {
        let day = this.props.start_date.split('T')[0].split('-')[2];
        let month = this.getMonthInString(this.props.start_date.split('T')[0].split('-')[1]);
        let time = this.props.start_date.split('T')[1].split(':')[0] + ':' + this.props.start_date.split('T')[1].split(':')[1];
        let date = day + ' de ' + month + ' - ' + time;
        return date;
    }

    getPrice() {
        return (this.props.price == 0) ? 'Gratuito' : (this.props.price + '€');
    }

    onFavoriteCall() {
        this.props.onFavorite(this.props.id);
    }

    render() {
        return (
            <Card onPress={this.props.onPress} style={{ backgroundColor: 'white', height: 125 }}>

                <View style={{ flexDirection: 'row', height: '100%' }}>
                    <View style={{ flex: 2 }}>
                        <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.props.id } : require('../assets/images/default.png')}
                            style={styles.image}
                            onError={this.ImageLoadingError.bind(this)}
                            onPress={this.props.onPress} />
                    </View>
                    <View style={{ flex: 5, borderLeftColor: '#D05722', borderLeftWidth: 5, justifyContent: 'space-between', paddingHorizontal: '2%', paddingBottom: '2%' }}>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 20, fontWeight: 'bold' }} numberOfLines={1} onPress={this.props.onPress}>{this.props.title}</Text>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18 }} numberOfLines={1} onPress={this.props.onPress}>{this.getDateinString()}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                            <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18 }} numberOfLines={1} onPress={this.props.onPress}>Preço: {this.getPrice()}</Text>
                            <Icon className="fave_icon" style={{ fontSize: 25, alignSelf: 'center', color: '#FF5722' }} type='FontAwesome' name={this.props.is_favorite ? 'heart' : 'heart-o'} onPress={this.onFavoriteCall} />
                        </View>
                    </View>
                </View>

                {/* <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.props.id } : require('../assets/images/default.png')}
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
        </View> */}
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: null,
        flex: 1
    }
});
