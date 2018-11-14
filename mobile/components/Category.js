import React from 'react';
import {
    StyleSheet
} from 'react-native';

import { Text, ListItem, Button } from 'native-base';

export default class Category extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <ListItem style={styles.listItem} onPress={this.props.onPress} >
                <Button transparent onPress={this.props.onPress}><Text style={styles.buttonText}>{this.props.data.name}</Text></Button>
            </ListItem>
        );
    }
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        paddingLeft: 5
    },
    listItem: {
        justifyContent: "center"
    }
});
