var me = true;
var over = false;
var chessBoard = [];
//赢法数组
var win = [];
//赢法统计数组
var myWin = [];
var computerWin = [];

for (var i = 0; i < 15; i++) {
  chessBoard[i] = [];
  for (var j = 0; j < 15; j++) {
    chessBoard[i][j] = 0;
  }
}
for (var i = 0; i < 15; i++) {
  win[i] = [];
  for (var j = 0; j < 15; j++) {
    win[i][j] = [];
  }
}

var count = 0;
//横线赢法
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      win[i][j + k][count] = true;
    }
    count++;
  }
}
//竖线赢法
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      win[j + k][i][count] = true;
    }
    count++;
  }
}
//斜线赢法
for (var i = 0; i < 11; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      win[i + k][j + k][count] = true;
    }
    count++;
  }
}
//反斜线赢法
for (var i = 0; i < 11; i++) {
  for (var j = 14; j > 3; j--) {
    for (var k = 0; k < 5; k++) {
      win[i + k][j - k][count] = true;
    }
    count++;
  }
}
console.log(count)
//初始化统计数组
for (var i = 0; i < count; i++) {
  myWin[i] = 0;
  computerWin[i] = 0;
}
var chess = document.getElementById('chess');
var context = chess.getContext('2d');
context.strokeStyle = '#bfbfbf';

var logo = new Image();
logo.src = './background.png';
logo.onload = function () {
  context.drawImage(logo, 0, 0, 450, 450);
  drawChessBoard();
}

var drawChessBoard = function () {
  for (var i = 0; i < 15; i++) {
    context.moveTo(15 + i * 30, 15);
    context.lineTo(15 + i * 30, 435);
    context.stroke();
    context.moveTo(15, 15 + i * 30);
    context.lineTo(435, 15 + i * 30);
    context.stroke();
  }
}

var oneStep = function (i, j, me) {
  context.beginPath();
  context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
  context.closePath();
  var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0)
  if (me) {
    gradient.addColorStop(0, '#0A0A0A');
    gradient.addColorStop(1, '#636766');
  } else {
    gradient.addColorStop(0, '#D1D1D1');
    gradient.addColorStop(1, '#F9F9F9');
  }
  context.fillStyle = gradient;
  context.fill();
}

chess.onclick = function (e) {
  //如果结束不生效
  if (over) {
    return
  }
  //如果不是我的回合结束
  if (!me) {
    return
  }
  //获取点击位置
  var i = Math.floor(e.offsetX / 30);
  var j = Math.floor(e.offsetY / 30);
  //判断是否已经有棋子
  if (chessBoard[i][j] == 0) {
    //画棋子
    oneStep(i, j, me);
    //记录我的棋子
    chessBoard[i][j] = 1;
    //判断点击位置所有赢法
    for (var k = 0; k < count; k++) {
      //第k种赢法上新增了一个子
      if (win[i][j][k]) {
        //k种赢法上一共的子数
        myWin[k]++;
        computerWin[k] = 6;
        if (myWin[k] == 5) {
          setTimeout(function () {
            window.alert("你赢了!!");
          })
          over = true;
        }
      }
    }
    if (!over) {
      me = !me
      computerAI()
    }
  }
}

var computerAI = function () {
  var myScore = [];
  var computerScore = [];
  var max = 0, u = 0, v = 0;

  //初始化每个可落子位置的权重
  for (var i = 0; i < 15; i++) {
    myScore[i] = [];
    computerScore[i] = [];
    for (var j = 0; j < 15; j++) {
      myScore[i][j] = 0;
      computerScore[i][j] = 0;
    }
  }
  //遍历整个棋盘
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      //如果该位置可以落子
      if (chessBoard[i][j] == 0) {
        //遍历整个赢法数组
        for (var k = 0; k < count; k++) {
          if (win[i][j][k]) {
            //统计我方第k种赢法已有颗子则加上相应权重分
            if (myWin[k] == 1) {
              myScore[i][j] += 200
            } else if (myWin[k] == 2) {
              myScore[i][j] += 400
            } else if (myWin[k] == 3) {
              myScore[i][j] += 2000
            } else if (myWin[k] == 4) {
              myScore[i][j] += 10000
            }
            //统计计算机方第k种赢法已有颗子则加上相应权重分
            if (computerWin[k] == 1) {
              computerScore[i][j] += 200
            } else if (computerWin[k] == 2) {
              computerScore[i][j] += 400
            } else if (computerWin[k] == 3) {
              computerScore[i][j] += 2000
            } else if (computerWin[k] == 4) {
              computerScore[i][j] += 20000
            }
          }
        }

        if (myScore[i][j] > max) {
          max = myScore[i][j]
          u = i;
          v = j;
        } else if (myScore[i][j] == max) {
          if (computerScore[i][j] > computerScore[u][v]) {
            u = i;
            v = j;
          }
        }
        if (computerScore[i][j] > max) {
          max = computerScore[i][j]
          u = i;
          v = j;
        } else if (computerScore[i][j] == max) {
          if (myScore[i][j] > myScore[u][v]) {
            u = i;
            v = j;
          }
        }
      }
    }
  }

  oneStep(u, v, false);
  chessBoard[u][v] = 2;
  //判断点击位置所有赢法
  for (var k = 0; k < count; k++) {
    //第k种赢法上新增了一个子
    if (win[u][v][k]) {
      //k种赢法上一共的子数
      computerWin[k]++;
      myWin[k] = 6;
      if (computerWin[k] == 5) {
        setTimeout(function () {
          window.alert("你输了!!");
        })
        over = true;
      }
    }
  }
  if (!over) {
    me = !me
  }
}