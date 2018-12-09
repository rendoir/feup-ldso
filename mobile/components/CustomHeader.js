import React from 'react';
import {
    Image,
    StyleSheet,
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
                <View style={styles.mainView}>
                    <View style={styles.imageView}>
                        <Image source={require('../assets/images/logo_screen.png')}
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.userNameView}>
                        <Text style={styles.userName}>{global.userName}</Text>
                    </View>
                    <View style={styles.toggleView}>
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

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: '#455A64',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    image: {
        width: '50%',
        height: '85%',
        resizeMode: 'contain',
        marginLeft: '2%',
        marginVertical: '1%'
    },
    imageView: {
        flex: 1,
        height: '100%',
        alignSelf: 'center',
        alignItems: 'flex-start'
    },
    userName: {
        color: 'white',
        textAlign: 'center',
        paddingRight: '1%',
        marginHorizontal: '1%'
    },
    userNameView: {
        flex: 1,
        alignSelf: 'center'
    },
    toggleView: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'flex-end',
        marginRight: '2%'
    }
});
