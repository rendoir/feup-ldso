import React from 'react';
import {
    Image,
    StatusBar
} from 'react-native';
import {
    View,
    Text
} from 'native-base';
import '../global.js';

export default class CustomHeader extends React.Component {
    render() {
        return (
            <View style={{ height: '6%' }}>
                <StatusBar hidden />
                <View style={{ backgroundColor: '#002040', height: '100%', flexDirection: 'row' }}>
                    <View style={{ flex: 2, height: '100%' }}>
                        <Image source={require('../assets/images/original.png')}
                            style={{
                                width: '80%',
                                height: '100%',
                                resizeMode: 'contain',
                                marginHorizontal: '1%',
                                marginVertical: '0%'
                            }}
                        />
                    </View>
                    <View style={{ flex: 2, alignSelf: 'center' }}>
                        <Text style={{
                            color: 'white', textAlign: 'right', paddingRight: '1%', marginHorizontal: '1%'
                        }}>{global.userName}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
