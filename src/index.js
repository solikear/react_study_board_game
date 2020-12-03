/*
 * @Author: Deer404
 * @Date: 2020-12-02 11:11:24
 * @LastEditors: Deer404
 * @LastEditTime: 2020-12-02 21:57:27
 * @Description:
 */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//棋子
// class Square extends React.Component {
//   //   constructor(props) {
//   //     super(props);
//   //     this.state = {
//   //       value: null,
//   //     };
//   //   }
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => {
//           this.props.onClick();
//         }}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }
// 函数式组件 并不是构造函数。
// 因为只是一个函数，在调用时没有内部的 this
// 不要因为大写开头就认为是一个构造对象，其实就只是一个普通函数。
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

// 面板 游戏主要区域面板 由棋子组件构成
class Board extends React.Component {
    //   constructor(props) {
    //     super(props);
    //     this.state = {
    //       squares: Array(9).fill(null),
    //       xIsNext: true,
    //     };
    //   }

    //   handleClick(i) {
    //     // 拷贝数组 不直接修改square数组
    //     const squares = this.state.squares.slice();
    //     // 当有玩家胜出时，或者某个 Square
    //     // 已经被填充时，该函数不做任何处理直接返回。
    //     if (calculateWinner(squares) || squares[i]) {
    //       return;
    //     }
    //     squares[i] = this.state.xIsNext ? "X" : "O";
    //     this.setState({ squares, xIsNext: !this.state.xIsNext });
    //   }

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
        // Square({
        //     value:this.state.squares[i],
        //     onClick:()=>{this.handleClick(i)}
        // })
    }

    render() {
        // 放到这里是因为 setState 是异步 并不能一下子获取到最新的state
        // 而放到渲染函数(render)里面，能保证取到最新的state
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if (winner) {
        //   status = `Winner: ${winner}`;
        // } else {
        //   status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
        // }

        return (
            <div>
                {/* <div className="status">{status}</div> */}
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

// 主组件 显示棋盘和一些游戏内容的组件
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {squares: Array(9).fill(null)},
            ],
            stepNumber: 0,
            xIsNest: true,
        };
    }

    handleClick(i) {
        // 拷贝数组 不直接修改square数组
        // const history = this.state.history;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // 当有玩家胜出时，或者某个 Square
        // 已经被填充时，该函数不做任何处理直接返回。
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{squares}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNest: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? `Go to move # ${move}` : "Go to game start";
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        } else {
            status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
        }

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

// ========================================

ReactDOM.render(<Game/>, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    // 循环胜利数组 只要传进来的数组是对应的 就代表胜利 返回赢得那方 X O
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // 如果下标对应位置的值都是一样的 那么代表获胜
        // examples: squares对应坐标 0 3 6 都是X 那么X获胜 并且返回X
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
