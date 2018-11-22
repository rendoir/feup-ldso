import React from 'react';
import {
    StatusBar
} from 'react-native';
import {
    View,
    Text,
    Icon
} from 'native-base';
import '../global.js';

export default class NewCustomHeader extends React.Component {
    render() {

        let faveElement;
        if (this.props.fave) {
            faveElement = (
                <Icon type='FontAwesome' name='heart-o' style={{ color: '#D05722' }} />
            );
        } else {
            faveElement = (
                <Text> </Text>
            );
        }

        return (
            <View style={{ height: '6%' }}>
                <StatusBar hidden />
                <View style={{ backgroundColor: '#002040', flexDirection: 'row', height: '100%' }}>
                    <View style={{ flex: 1 }} >
                        <Icon type='FontAwesome' name='arrow-left' style={{ color: '#F0F0F0' }} />
                    </View>
                    <View style={{ flex: 4 }} >
                        <Text style={{ color: '#F0F0F0' }}>
                            {this.props.text}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} >
                        {faveElement}
                    </View>
                </View>
            </View>
        );
    }
}
