import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  /* notes
  storing state in the lowest level JSX component isn't super great so we need to lift the state from the lowest level to higher levels (i.e from a child to a parent)
  most notable here because if we kept track of the state for every Square rather than sending the state to the Board, we'd need to coordinate 9 different components together

  */
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()} // onClick() is a property of Square that was passed down via Board
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    // intiate state tracking here, where state is a 3x3 array
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return ( // ALSO We split the returned element into multiple lines for readability, and added parentheses so that JavaScript doesn’t insert a semicolon after return and break our code.
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)} //state is considered private to the component that defines it, we can't directly update it. So we use event delegation instead
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
