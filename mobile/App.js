import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { AppLoading, Asset, Font, Icon, SecureStore } from 'expo';
import MainTabNavigator from './navigation/MainTabNavigator';
import { Root } from 'native-base';
import './global.js';
import LogInScreen from './screens/LogInScreen';
import axios from 'axios';
import Expo from 'expo';

export default class App extends React.Component {
  state = {
      isLoadingComplete: false,
      loading: true,
      signedIn: false,
      userName: "",
      userToken: "",
      userEmail: "",
      signInError: false,
      language: "PT",
      googleLog: ""
  };

  async componentDidMount() {
      await Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
      });
      this.setState({ loading: false });
  }

  signIn = async() => {
      try {
          const result = await Expo.Google.logInAsync({
              androidStandaloneAppClientId: "813704659594-ucq5omdtloe7ntb3oe4t6u4glgioq5s2.apps.googleusercontent.com",
              androidClientId: "813704659594-aanm6hu12jn47cmek4b47d6uar3nd2kt.apps.googleusercontent.com",
              behavior: 'web',
              scopes: ["profile", "email"]
          });

          if (result.type === "success") {
              this.setState({
                  userName: result.user.name,
                  userToken: result.accessToken,
                  userEmail: result.user.email
              });
              global.userName = result.user.name;
              this.handleLogIn();
          } else {
              console.log("cancelled");
              this.setState({ googleLog: "cancelled" });
          }
      } catch (e) {
          console.log("error", e);
          this.setState({ googleLog: e });
      }
  }

  async handleLogIn() {
      let self = this;
      axios.post('http://' + global.api + ':3030/app/login', {
          email: self.state.userEmail,
          name: self.state.userName,
          accessToken: self.state.userToken
      })
          .then(async(res) => {
              if (res.status == 200) {
                  global.userId = res.data.userId;
                  await SecureStore.setItemAsync('access_token', res.data.accessToken);
                  self.setState({ signedIn: true });
              }
          })
          .catch(() => {
              self.setState({ signedIn: false, signInError: true });
          });
  }

  toggleLanguage() {
      if (this.state.language == "PT")      this.setState({ language: "EN" });
      else if (this.state.language == "EN") this.setState({ language: "PT" });
  }

  render() {

      let signInErrorMessage;
      if (this.state.signInError == true) {
          signInErrorMessage = (
              <View>
                  <Button title={"Não foi possível fazer login!\n(Error: " + this.state.googleLog + ")"} disabled onPress={() => {}}/>
              </View>
          );
      }

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
                      <MainTabNavigator screenProps={ {language: this.state.language, toggleLanguage: this.toggleLanguage.bind(this)} } />
                  </View>
              );
          } else {
              return (
                  <LogInScreen language={this.state.language} signIn={this.signIn} signInErrorMessage={signInErrorMessage}/>
              );
          }
      }
  }

  _loadResourcesAsync = async() => {
      return Promise.all([
          Asset.loadAsync([
              require('./assets/images/robot-dev.png'),
              require('./assets/images/robot-prod.png')
          ]),
          Font.loadAsync({
              // This is the font that we are using for our tab bar
              ...Icon.Ionicons.font,
              // We include SpaceMono because we use it in HomeScreen.js. Feel free
              // To remove this if you are not using it in your app
              'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
          })
      ]);
  };

  _handleLoadingError = error => {
      // In this case, you might want to report the error to your error
      // Reporting service, for example Sentry
      console.warn(error);
  };

  _handleFinishLoading = () => {
      this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});
