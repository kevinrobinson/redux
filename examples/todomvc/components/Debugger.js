import React from 'react';
import * as TodoActions from '../actions/TodoActions';
import compactionKey from '../stores/compaction';


export default class Debugger extends React.Component {
  static propTypes = {
    loggit: React.PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { isZalgoAwake: false };
    this.zalgoTimer = null;
  }

  handleZalgo() {
    this.setState({ isZalgoAwake: !this.state.isZalgoAwake });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isZalgoAwake === this.state.isZalgoAwake) {
      return;
    }

    if (this.state.isZalgoAwake) {
      this.zalgoTimer = window.setInterval(this.pokeZalgo.bind(this), 5);
    } else {
      window.clearInterval(this.zalgoTimer);
    }
  }

  pokeZalgo() {
    const actionFns = [
      TodoActions.markAll,
      TodoActions.clearMarked,
      () => TodoActions.addTodo('do something: ' + Math.random())
    ]
    const randomIndex = Math.floor(Math.random() * actionFns.length);
    const randomAction = actionFns[randomIndex]();
    this.props.loggit.recordFact(randomAction);
  }

  forceCompaction() {
    //compactionKey
  }

  render() {
    return (
      <div style={{marginTop: 50}}>
        <button
          onClick={this.handleZalgo.bind(this)}
          style={{
            border: '2px solid red',
            padding: 10,
            backgroundColor: this.state.isZalgoAwake ? 'red' : 'white'
          }}>zalgo</button>
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
