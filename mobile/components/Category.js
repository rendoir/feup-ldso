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
                <Button transparent onPress={this.props.onPress}><Text style={styles.buttonText}>{this.getName()}</Text></Button>
            </ListItem>
        );
    }

    getName() {
        if (this.props.language === "PT")      return this.props.data.name;
        else if (this.props.language === "EN") return this.props.data.name_english;
    }
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: 'center'
    },
    listItem: {
        justifyContent: "center",
        backgroundColor: '#7C8589',
        width: '91%',
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    }
});
