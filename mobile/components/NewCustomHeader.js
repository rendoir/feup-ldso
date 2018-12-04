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

        return (
            <View style={{ height: '6%' }}>
                <StatusBar hidden />
                <View style={{ backgroundColor: '#455A64', height: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: '2%', alignItems: 'flex-start', alignSelf: 'center' }}>
                        <Icon
                            onPress={ () => this.props.navigation.goBack(null) }
                            name='arrow-circle-left'
                            type='FontAwesome'
                            style={{ color: '#D05722', fontSize: 28 }} />
                    </View>
                    <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#F0F0F0', textAlign: 'center' }}>
                            {this.props.text}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: '2%', alignSelf: 'center' }}>
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
                </View>
            </View>
        );
    }
}
