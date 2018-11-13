import React from 'react';
import { Font, AppLoading } from "expo";
import { Root } from 'native-base';
import { StyleSheet, Text, View, Image, Button, StatusBar } from "react-native";

export default class LogInScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = { signedIn: false, userName: "", userToken: "" }
    }

    static navigationOptions = {
        header: null,
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
            <View style={{ backgroundColor: '#2c8f7f', height: '100%' }}>
                <StatusBar hidden />

                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}>
                    <Image
                        style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                            opacity: 0.7
                        }}
                        source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Edif%C3%ADcio_da_Reitoria_da_Universidade_do_Porto.jpg" }}
                    />
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'column', height: '99%' }}>
                    <View style={{ flex: 3 }}></View>
                    <View style={{ flex: 1 }}>
                        <Image source={require('../assets/images/original.png')}
                            style={{
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 25, color: 'white', fontFamily: 'Roboto', textAlign: 'center', marginHorizontal: '10%' }} >
                            Agenda Cultural da Universidade do Porto
                  </Text>
                    </View>
                    <View style={{ width: '50%', flex: 1 }}>
                        <Button title="Sign in with Google" className={'login_button'} onPress={() => this.props.signIn()} />
                    </View>
                    <View style={{ flex: 2 }}>{this.props.signInErrorMessage}</View>
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
});
