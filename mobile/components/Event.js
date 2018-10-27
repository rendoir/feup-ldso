import React from 'react';
import {
    StyleSheet,
    Image,
} from 'react-native';

import { Card, Icon, View, Badge, Text } from 'native-base';

export default class Event extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            imageLoaded: true
        }
    }

    ImageLoadingError() {
        this.setState({ imageLoaded: false });
    }

    getMonthInString(month) {
        switch (parseInt(month)) {
            case 1: return 'JAN';
                break;
            case 2: return 'FEB';
                break;
            case 3: return 'MAR';
                break;
            case 4: return 'ABR';
                break;
            case 5: return 'MAI';
                break;
            case 6: return 'JUN';
                break;
            case 7: return 'JUL';
                break;
            case 8: return 'AGO';
                break;
            case 9: return 'SET';
                break;
            case 10: return 'OUT';
                break;
            case 11: return 'NOV';
                break;
            case 12: return 'DEZ';
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <Card>
                <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.props.data.id } : require('../assets/images/default.png')}
                    style={{ height: 160, width: null, flex: 1 }}
                    onError={this.ImageLoadingError.bind(this)} />
                <View style={{ flexDirection: 'row' }}>
                    <Badge style={{ flex: 1, backgroundColor: 'grey', margin: '3%', height: 68, alignItems:'center' }}>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, lineHeight: 30 }}>{this.props.data.start_date.split('T')[0].split('-')[2]}</Text>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, lineHeight: 30 }}>{this.getMonthInString(this.props.data.start_date.split('T')[0].split('-')[1])}</Text>
                    </Badge>
                    <View style={{ flex: 5, marginRight: '3%', marginVertical: '3%' }}>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18, fontWeight: 'bold' }} numberOfLines={1}>{this.props.data.title}</Text>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 16 }} numberOfLines={1}>{this.props.data.location} - {this.props.data.start_date.split('T')[1].split(':')[0] + ':' + this.props.data.start_date.split('T')[1].split(':')[1]}</Text>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 16 }} numberOfLines={1}>Preço: {this.props.data.price}€</Text>
                    </View>
                    <Icon style={{ fontSize: 35, flex: 1, alignSelf: 'center' }} type="FontAwesome" name="heart-o" />
                </View>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    textBlack: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        paddingLeft: 0,
    },
    buttonText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        paddingLeft: 5,
    },
    simpleText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        padding: 0,
    },
    eventTitle: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 16,
    },
});
