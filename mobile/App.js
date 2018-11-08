import React from 'react';
import { StyleSheet, View, Text, Button, Image } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { Root } from 'native-base';
import './global.js';
import CustomHeader from './components/CustomHeader';
import LogInScreen from './screens/LogInScreen';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    loading: true,
    signedIn: false,
    userName: "",
    userToken: "",
    photoUrl: ""
  };

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  signIn = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId:
          "813704659594-aanm6hu12jn47cmek4b47d6uar3nd2kt.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        this.setState({
          signedIn: true,
          userName: result.user.name,
          userToken: result.accessToken,
          photoUrl: result.user.photoUrl
        })
        console.log(this.state.userToken);
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }

  render() {

    if (this.state.loading) {
      return (
        <Root>
          <AppLoading />
        </Root>
      );
    }
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      if (this.state.signedIn) {
        return (
          <View style={styles.container}>
            <CustomHeader name={this.state.userName} photoUrl={this.state.photoUrl} />

            <AppNavigator />
          </View>
        );
      } else {
        return (
          <LogInScreen signIn={this.signIn} />
        );
      }
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
