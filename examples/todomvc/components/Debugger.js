import React from 'react';
import * as TodoActions from '../actions/TodoActions';
import compactionKey from '../stores/compaction_fn';


export default class Debugger extends React.Component {
  static propTypes = {
    loggit: React.PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { isMonkeyAwake: false };
    this.MonkeyTimer = null;
    this.pokeMonkey = this.pokeMonkey.bind(this);
  }

  handleMonkey() {
    this.setState({ isMonkeyAwake: !this.state.isMonkeyAwake });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isMonkeyAwake === this.state.isMonkeyAwake) {
      return;
    }

    if (this.state.isMonkeyAwake) {
      this.MonkeyTimer = window.setInterval(this.pokeMonkey, 5);
    } else {
      window.clearInterval(this.MonkeyTimer);
    }
  }

  pokeMonkey() {
    const actionFns = [
      TodoActions.checkAll,
      TodoActions.uncheckAll,
      TodoActions.clearMarked,
      () => TodoActions.addTodo('do something: ' + Math.random())
    ]
    const randomIndex = Math.floor(Math.random() * actionFns.length);
    const randomAction = actionFns[randomIndex]();
    this.props.loggit.recordFact(randomAction);
  }

  forceCompaction() {
    this.props.loggit.experimental.forceCompaction();
  }

  render() {
    return (
      <div style={{marginTop: 50}}>
        <button
          onClick={this.handleMonkey.bind(this)}
          style={{
            border: '2px solid red',
            padding: 10,
            backgroundColor: this.state.isMonkeyAwake ? 'red' : 'white'
          }}>Monkey</button>
        <button
          onClick={this.forceCompaction.bind(this)}
          style={{
            border: '2px solid blue',
            padding: 10
          }}>force compaction</button>
      </div>
    );
  }
}
