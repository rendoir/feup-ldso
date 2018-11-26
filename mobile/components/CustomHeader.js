import React from 'react';
import {
    Image,
    StatusBar
} from 'react-native';
import {
    View,
    Text
} from 'native-base';
import SwitchToggle from 'react-native-switch-toggle';
import '../global.js';

export default class CustomHeader extends React.Component {
    constructor(props) {
        super(props);

        this.toggleLanguage = this.toggleLanguage.bind(this);
    }

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
                    <View>
                        <SwitchToggle
                            buttonText={this.props.language === 'EN' ? 'EN' : ''}
                            backTextRight={"PT"}
                            backTextLeft={"EN"}
                            switchOn={this.props.language === 'PT'}
                            onPress={this.toggleLanguage}
                            type={1}
                            buttonStyle={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute'
                            }}
                            rightContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                            leftContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}

                            buttonTextStyle={{ fontSize: 9 }}
                            textRightStyle={{ fontSize: 9 }}
                            textLeftStyle={{ fontSize: 9 }}
                            backgroundColorOn='#fff'
                            backgroundColorOff='#fff'
                            circleColorOff='#e5e1e0'
                            circleColorOn='#e5e1e0'
                            className="change-language"
                            accessibilityLabel="Toggle language"
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

    toggleLanguage() {
        this.props.toggleLanguage();
    }
}
