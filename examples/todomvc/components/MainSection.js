import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';
import Footer from './Footer';
import { SHOW_ALL, SHOW_MARKED, SHOW_UNMARKED } from '../constants/TodoFilters';
import ComputeTodos from '../stores/todos.js'
import * as TodoActions from '../actions/TodoActions';


const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_UNMARKED]: todo => !todo.marked,
  [SHOW_MARKED]: todo => todo.marked
};


class MainSection extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { filter: SHOW_ALL };
  }

  handleClearMarked() {
    const { todos } = this.props;
    const atLeastOneMarked = todos.some(todo => todo.marked);
    if (!atLeastOneMarked) return;

    this.props.loggit.recordFact(TodoActions.clearMarked());
  }

  handleShow(filter) {
    this.setState({ filter });
  }

  handleInputChanged() {
    const {todos} = this.props;
    const fact = (todos.every(todo => todo.marked))
      ? TodoActions.uncheckAll()
      : TodoActions.checkAll();
    this.props.loggit.recordFact(fact);
  }

  render() {
    const {todos} = this.props;
    const {filter} = this.state;

    const filteredTodos = todos.filter(TODO_FILTERS[filter]);
    const markedCount = todos.reduce((count, todo) =>
      todo.marked ? count + 1 : count,
      0
    );

    return (
      <section className='main'>
        {this.renderToggleAll(todos, markedCount)}
        <ul className='todo-list'>
          {filteredTodos.map(todo =>
            <TodoItem key={todo.id} todo={todo} loggit={this.props.loggit} />
          )}
        </ul>
        {this.renderFooter(markedCount)}
      </section>
    );
  }

  renderToggleAll(todos, markedCount) {
    if (todos.length > 0) {
      return (
        <input className='toggle-all'
               type='checkbox'
               checked={markedCount === todos.length}
               onChange={this.handleInputChanged.bind(this)} />
      );
    }
  }

  renderFooter(markedCount) {
    const { todos } = this.props;
    const { filter } = this.state;
    const unmarkedCount = todos.length - markedCount;

    if (todos.length) {
      return (
        <Footer markedCount={markedCount}
                unmarkedCount={unmarkedCount}
                filter={filter}
                onClearMarked={::this.handleClearMarked}
                onShow={::this.handleShow} />
      );
    }
  }
}

// export default class Computation {
//   static wrap(childClass, computations) {
//     return <Computation childClass={childClass} computations={computations} />;
//   }

//   static propTypes = {
//     loggit: PropTypes.object.isRequired
//     computations: PropTypes.object.isRequired
//   };
  
//   data() {
//     return this.props.loggit.compute(this.props.computations);
//   }

//   render() {
//     const computedData = this.data();
//     const otherProps 
//     return <this.childClass {...computedData} />;
//   }
// }


// Computation.wrap MainSection, {
//   todos: ComputeTodos 
// }