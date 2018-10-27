import React from 'react';
import {
    Image,
    StatusBar,
} from 'react-native';
import {
    View
} from 'native-base';

export default class CustomHeader extends React.Component {
    render() {
        return (
            <View style={{ height: '6%' }}>
                <StatusBar hidden />
                <View style={{ backgroundColor: '#2c8f7f', height: '100%', justifyContent: 'center' }}>
                    <Image source={require('../assets/images/original.png')}
                        style={{
                            width: '30%',
                            height: '100%',
                            resizeMode: 'contain',
                            margin: '1%'
                        }}
                    />
                </View>
            </View>
        );
    }
}