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
                <View style={{ backgroundColor: '#455A64', height: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, height: '100%', alignSelf: 'center', alignItems: 'flex-start' }}>
                        <Image source={require('../assets/images/logo_screen.png')}
                            style={{
                                width: '50%',
                                height: '85%',
                                resizeMode: 'contain',
                                marginLeft: '2%',
                                marginVertical: '1%'
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, alignSelf: 'center' }}>
                        <Text style={{ color: 'white', textAlign: 'center', paddingRight: '1%', marginHorizontal: '1%' }}>{global.userName}</Text>
                    </View>
                    <View style={{ flex: 1, alignSelf: 'center', alignItems: 'flex-end', marginRight: '2%' }}>
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
                </View>
            </View>
        );
    }

    toggleLanguage() {
        this.props.toggleLanguage();
    }
}
