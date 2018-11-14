import React from 'react';
import { Icon } from 'expo';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={40}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? '#F0F0F0' : '#6090c0'}
      />
    );
  }
}
