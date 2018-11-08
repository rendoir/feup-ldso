import React from 'react';
import {
    Image,
    StatusBar,
} from 'react-native';
import {
    View,
    Right,
    Text
} from 'native-base';

export default class CustomHeader extends React.Component {
    render() {
        return (
            <View style={{ height: '6%' }}>
                <StatusBar hidden />
                <View style={{ backgroundColor: '#2c8f7f', height: '100%', flexDirection: 'row' }}>
                    <View style={{ flex: 2, height: '100%', padding: '0%', margin: '0%' }}>
                        <Image source={require('../assets/images/original.png')}
                            style={{
                                width: '80%',
                                height: '100%',
                                resizeMode: 'contain',
                                marginHorizontal: '1%',
                                marginVertical: '0%',
                            }}
                        />
                    </View>
                    <View style={{ flex: 2, alignSelf: 'center' }}>
                        <Text style={{
                            color: 'white', textAlign: 'right', paddingRight: '1%', marginHorizontal: '1%'
                        }}>{this.props.name}</Text>
                    </View>
                    <View style={{ flex: 1, alignSelf: 'center', marginLeft: '5%', right: 0 }}>
                        <Image source={{ uri: this.props.photoUrl }} style={{ padding: '0%', margin: '0%', height: 40, width: 40, borderColor: "black", borderWidth: 3, borderRadius: 40 }} />
                    </View>
                </View>

                {console.log(this.props.name)}
            </View>
        );
    }
}