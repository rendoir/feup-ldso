import React from 'react';
import { Font, AppLoading } from "expo";
import { Root, Button, Text } from 'native-base';
import { View, Image, StatusBar, StyleSheet } from "react-native";

export default class LogInScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { signedIn: false, userName: "", userToken: "" };
    }

    static navigationOptions = {
        header: null
    };

    componentWillUnmount() {
        this.isCancelled = true;
    }

    async componentDidMount() {
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });
        this.setState({ loading: false });
    }

    render() {
        if (this.state.loading) {
            return (
                <Root>
                    <AppLoading />
                </Root>
            );
        }

        return (
            <View style={styles.wrapperView}>
                <StatusBar hidden />

                <View style={styles.mainView}>
                    <View style={{ flex: 2 }}></View>
                    <Image source={require('../assets/images/logo.png')} resizeMode="contain" style={{ flex: 3 }} />
                    <View style={styles.buttonView}>
                        <Button iconLeft light onPress={() => this.props.signIn()} className={'login_button'} >
                            <Image source={require('../assets/images/google.png')} resizeMode="contain" style={styles.image} />
                            <Text style={styles.text}>{global.dictionary["GOOGLE_SIGNIN"][this.props.language]}</Text>
                        </Button>
                    </View>
                    <View style={{ flex: 1 }}>{this.props.signInErrorMessage}</View>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    wrapperView: {
        backgroundColor: '#292929',
        height: '100%'
    },
    mainView: {
        alignItems: 'center',
        flexDirection: 'column',
        height: '99%'
    },
    buttonView: {
        width: '60%',
        flex: 1,
        paddingTop: '10%'
    },
    text: {
        color: '#696969',
        flex: 4
    },
    image: {
        flex: 1,
        height: '75%'
    }
});
