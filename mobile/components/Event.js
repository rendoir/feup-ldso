import React from 'react';
import {
    StyleSheet,
    Image,
} from 'react-native';

import { Card, Icon, View, Badge, Text } from 'native-base';

export default class Event extends React.Component {

    constructor(props){ 
        super(props);

        this.state={
          imageLoaded : true
        }
    }

    ImageLoadingError(){
        this.setState({ imageLoaded: false });
    }

    getMonthInString(month) {
        switch (month) {
            case '1': return 'JAN';
                break;
            case '2': return 'FEB';
                break;
            case '3': return 'MAR';
                break;
            case '4': return 'ABR';
                break;
            case '5': return 'MAI';
                break;
            case '6': return 'JUN';
                break;
            case '7': return 'JUL';
                break;
            case '8': return 'AGO';
                break;
            case '9': return 'SET';
                break;
            case '10': return 'OUT';
                break;
            case '11': return 'NOV';
                break;
            case '12': return 'DEZ';
                break;
            default:
                break;
        }
    }

    render() {
        let d = Date(this.props.data.start_date);
        return (
            <Card>
                <Image source={ this.state.imageLoaded ? { uri: 'http://192.168.1.82:3030/' + this.props.data.id } : require('../assets/images/default.png')}
                    style={{ height: 160, width: null, flex: 1 }}
                    onError={this.ImageLoadingError.bind(this)} />
                <View style={{ flexDirection: 'row' }}>
                    <Badge style={{ flex: 1, backgroundColor: 'grey', margin: '3%', height: 54 }}>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, lineHeight: 26 }}>{this.props.data.start_date.split('T')[0].split('-')[2]}</Text>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, lineHeight: 26 }}>{this.getMonthInString(this.props.data.start_date.split('T')[0].split('-')[1])}</Text>
                    </Badge>
                    <View style={{ flex: 5, margin: '3%' }}>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 18 }} numberOfLines={1}>{this.props.data.title}</Text>
                        <Text style={{ color: 'black', fontFamily: 'OpenSans-Regular', fontSize: 14 }} numberOfLines={1}>{this.props.data.location}</Text>
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
