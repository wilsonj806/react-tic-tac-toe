import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


  /* Notes
  storing state in the lowest level JSX component isn't super great so we need to lift the state from the lowest level to higher levels (i.e from a child to a parent)
  most notable here because if we kept track of the state for every Square rather than sending the state to the Board, we'd need to coordinate 9 different components together

  React also lets you declare function components if all you're doing is returning a JSX expression. Much slicker than using class components
  */


 function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    // Square recieves value and onClick as props since Game handles state as of Commit da87c24
    // We also move handleClick from Board to Game so we use onClick instead
    return ( // ALSO We split the returned element into multiple lines for readability, and added parentheses so that JavaScript doesn’t insert a semicolon after return and break our code.
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} //state is considered private to the component that defines it, we can't directly update it. So we use event delegation instead
      />
    );
  }

  render() {
    return (
      <div>
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
  // since this is the root component this should be the one to handle most of the state changing and stuff
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // setting up the current history entry as a new copy of the current array(i.e history[i+1])
    const current = history[history.length - 1]; // same as above
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) { // if someone wins or if the square is filled, return
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; // set next player

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history; // reading state as a variable
    const current = history[this.state.stepNumber]; // getting the current state of the square
    const winner = calculateWinner(current.squares); // checking if there's a winner

    const moves = history.map((step, move) => { // using map to make a list of the moves taken in the current game and allows the user to toggle between board states
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      // note that the below button recieves onClick = {()=> this.jumpTo()}, the function is listed below
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    // We need to pass squares and onClick as properties to Board since Game is handling state now
    return (
      <div className="game">
        <div className="game-board">
        <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [ // various win conditions
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
