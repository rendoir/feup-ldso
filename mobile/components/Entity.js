import React from 'react';
import {
    StyleSheet,
    Image,
} from 'react-native';

import { Card, Icon, View, Badge, Text, ListItem, Button } from 'native-base';

export default class Entity extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <ListItem style={styles.listItem} onPress={this.props.onPress} >
                <Button transparent onPress={this.props.onPress}><Text style={styles.buttonText}>{this.props.data.initials}</Text></Button>
            </ListItem>
        );
    }
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        paddingLeft: 5,
    },
    listItem: {
        justifyContent: "center",
    },
});