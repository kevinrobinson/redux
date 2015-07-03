import React from 'react';
import { bindActionCreators, ReduxPropType } from 'redux';
import { Connector } from 'redux/react';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/TodoActions';

export default class TodoApp {
  static propTypes = {
    loggit: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        <Header loggit={this.props.loggit} />
        <MainSection loggit={this.props.loggit} />
      </div>
    );
  }
}
