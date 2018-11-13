import React from 'react';
import {
    StyleSheet,
    Image,
    Platform,
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

    render() {
        return (
            <Card onPress={this.props.onPress} style={{ backgroundColor: '#607D8B'}}>
                <Image source={this.state.imageLoaded ? { uri: 'http://' + global.api + ':3030/' + this.props.data.id } : require('../assets/images/default.png')}
                    style={styles.image}
                    onError={this.ImageLoadingError.bind(this)} 
                    onPress={this.props.onPress} />
                <View style={{ flexDirection: 'row', backgroundColor: '#607D8B' }} onPress={this.props.onPress}>
                    <Badge style={{ flex: 1, backgroundColor: '#455A64', margin: '3%', height: 68, alignItems:'center' }}>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, lineHeight: 30 }} onPress={this.props.onPress}>{this.props.data.start_date.split('T')[0].split('-')[2]}</Text>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, lineHeight: 30 }} onPress={this.props.onPress}>{this.getMonthInString(this.props.data.start_date.split('T')[0].split('-')[1])}</Text>
                    </Badge>
                    <View style={{ flex: 5, marginRight: '3%', marginVertical: '3%' }} onPress={this.props.onPress}>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 18, fontWeight: 'bold' }} numberOfLines={1} onPress={this.props.onPress}>{this.props.data.title}</Text>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 16 }} numberOfLines={1} onPress={this.props.onPress}>{this.props.data.location} - {this.props.data.start_date.split('T')[1].split(':')[0] + ':' + this.props.data.start_date.split('T')[1].split(':')[1]}</Text>
                        <Text style={{ color: 'white', fontFamily: 'OpenSans-Regular', fontSize: 16 }} numberOfLines={1} onPress={this.props.onPress}>Preço: {this.props.data.price}€</Text>
                    </View>
                    <Icon style={{ fontSize: 35, flex: 1, alignSelf: 'center', color: '#FF5722'}} name={'md-star'} onPress={this.props.onPress} />
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
    },
});
