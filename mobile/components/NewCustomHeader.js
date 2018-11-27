import React from 'react';
import {
    StatusBar
} from 'react-native';
import {
    View,
    Text,
    Icon
} from 'native-base';
import SwitchToggle from 'react-native-switch-toggle';
import '../global.js';

export default class NewCustomHeader extends React.Component {
    constructor(props) {
        super(props);
    }

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
                    <View style={{ flex: 2 }} >
                        <Text style={{ color: '#F0F0F0' }}>
                            {this.props.text}
                        </Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <SwitchToggle
                            buttonText={this.props.language === 'EN' ? 'EN' : ''}
                            backTextRight={"PT"}
                            backTextLeft={"EN"}
                            switchOn={this.props.language === 'PT'}
                            onPress={this.props.toggleLanguage}
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
                    <View style={{ flex: 1 }} >
                        {faveElement}
                    </View>
                </View>
            </View>
        );
    }
}
