/*
 * @Author: Deer404
 * @Date: 2020-12-02 11:11:24
 * @LastEditors: Deer404
 * @LastEditTime: 2020-12-03 20:02:44
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
// hooks的概念就与这个有关
function Square(props) {
  // 判断是否是赢的Square下标，如果是则高亮
  return (
    <button className={`square ${props.win ? 'win':''}`} onClick={props.onClick}>
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

  //   renderSquare(i) {
  //     return (
  //       <Square
  //         value={this.props.squares[i]}
  //         onClick={() => this.props.onClick(i)}
  //       />
  //     );
  //     // Square({
  //     //     value:this.state.squares[i],
  //     //     onClick:()=>{this.handleClick(i)}
  //     // })
  //   }

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
    let winnerIndexSet = new Set(this.props.indexs);
    return (
      <div className="board-container">
        {this.props.squares.map((_, index) => {
          //   console.log(this.props.squares[_])
          // 如果存储赢的下标的Set集合里有当前的index值
          // 就返回true,传给Square
          // Square 就会让对应的Square高亮
          let win = winnerIndexSet.has(index) ? true : false;
          return (
            <Square
              win={win}
              key={index}
              value={this.props.squares[index]}
              onClick={() => this.props.onClick(index)}
            />
          );
        })}
        {/* <div className="status">{status}</div> */}
        {/* <div className="board-row">
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
        </div> */}
      </div>
    );
  }
}

// 主组件 显示棋盘和一些游戏内容的组件
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const location = convertLocation(i);
    // 拷贝数组 不直接修改square数组
    // const history = this.state.history;
    // slice函数形参是(begin,end) 从数组的begin开始到end前面结束 是不包括end坐标的值的
    // 所以也可以理解为 begin,num 从数组Begin开始，截取多少个值
    // history一开始就有个下标0 的 squares对象值全为null (游戏初始状态)
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // 在history中 获取当前的游戏状态
    const current = history[history.length - 1];
    // 拷贝一份当前的squares
    const squares = current.squares.slice();
    // 当有玩家胜出时，或者某个 Square
    // 已经被填充时，该函数不做任何处理直接返回。
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // 否则游戏还在继续 则点击后更改squares对应的位置
    // 并更新xIsNext
    // stepNumber 更新为下棋前原history的长度(拷贝数组的好处+1)
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares, location }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      //   currentLocation: location,
    });
  }

  // 时光旅行
  // 跳转游戏的状态
  // 注意判断xIsNeXT的状态 这样当跳转到之前的游戏状态时候，xIsNeXT总是正确的。
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    // render函数执行时，state是已经更新好的了 详情看react生命周期函数
    const history = this.state.history;
    // 获取更新后的history 下棋后的最新游戏状态
    const current = history[this.state.stepNumber];
    // 判断玩家是否获胜，如果获胜返回的是玩家对应的值，如'X' 如果没有获胜 返回 null
    const winner = calculateWinner(current.squares);
    const indexs = winner ? winner.winLocation : [];
    // 时间旅行 step为数组元素 move为数组下标
    // 数组的map方法返回：一个由原数组每个元素执行回调函数的结果组成的新数组。
    const moves = history.map((step, move) => {
      // 很巧妙的判断 当move为0时候, ?符号会把前面的值转成布尔值 => (Boolean(move))
      // 而在js中,0转换成布尔值会被转换成false => Boolean(0) => false
      // 刚好对应了数组下标为0的值是游戏的初始状态
      const isCurrent = this.state.stepNumber === move;
      const desc = move ? `Go to move # ${move}` : "Go to game start";
      // 给button的点击事件绑架函数 当点击了onClick时，跳转到对应步骤的游戏状态。
      // 给列表里的每一个组件绑定一个key值
      const location = step.location ? ` [${step.location}]` : "";
      console.log(desc);
      return (
        <li key={move}>
          <button
            className={isCurrent ? "font-bold" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc + location}
          </button>
        </li>
      );
    });
    // 定义游戏当前状态的表示
    let status;
    if (winner) {
      status = `Winner: ${winner.winner}`;
    }else if(history.length>9 && !winner){
      status = 'The game a draw'
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    let ascending = this.state.ascending;
    // react的JSX可以放入一个存放JSX的数组 =>moves
    // 然后将moves数组里的jsx元素全部渲染出来
    return (
      <div className="game">
        <div className="game-board">
          <Board
            indexs={indexs}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            <button
              onClick={() => {
                this.setState({ ascending: !ascending });
              }}
            >
              {ascending ? "ascending" : "Descending"}
            </button>
          </div>
          <div>{status}</div>
          <ol>{ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
      return { winner: squares[a], winLocation: [a, b, c] };
    }
  }
  return null;
}

function convertLocation(index) {
  // 都+1是因为下标是从0开始算的
  // 行号 都除以3向下取整 + 1
  const row = Math.floor(index / 3) + 1;
  // 列号 都取余 + 1
  const column = (index % 3) + 1;
  return [column, row];
}
