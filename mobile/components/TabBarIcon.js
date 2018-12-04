import React from 'react';
import { Icon } from 'native-base';

export default class TabBarIcon extends React.Component {
    render() {
        return (
            <Icon type='FontAwesome'
                name={this.props.name}
                size={40}
                style={{ marginBottom: -3, color: 'white' }}
            />
        );
    }
}
