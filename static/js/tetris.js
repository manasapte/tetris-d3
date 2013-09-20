function Tetris(params) {
      this.board = params.board || [],
      this.boardId = params.boardId || 1,
      this.clock = params.clock || undefined,
      this.theend = params.theend || false,
      this.interval = params.interval || 700,
      this.score = params.score || [0],
      this.width = params.width || 10,
      this.height = params.height || 22,
      this.currentPiece = params.currentPiece || undefined,
      this.currentIndex = params.currentIndex || -1,
      this.currentX = params.currentX || 0,
      this.currentY = params.currentY || 0,
      this.motionStarted = params.motionStarted || 0;
      this.sizes = params.sizes || [4,2,3,3,3,3,3],
      this.colorDict = params.colorDict || {
        0 : 'DAF0ED',
        1 : 'FFA500',
        2 : '0000CD',
        3 : '008080',
        4 : 'FFFF00',
        5 : '008000',
        6 : '800080',
        7 : 'FF0000'
      }
      this.pieces = params.pieces || [
        [  [3, 3, 3, 3],
           [0, 0, 0, 0],
           [0, 0, 0, 0],
           [0, 0, 0, 0]
        ],
        [  [4, 4],
           [4, 4]
        ],
        [  [0, 6, 0],
           [6, 6, 6],
           [0, 0, 0]
        ],
        [  [0, 5, 5],
           [5, 5, 0],
           [0, 0, 0]
        ],
        [  [7, 7, 0],
           [0, 7, 7],
           [0, 0, 0]
        ],
        [  [2, 0, 0],
           [2, 2, 2],
           [0, 0, 0]
        ],
        [  [0, 0, 1],
           [1, 1, 1],
           [0, 0, 0]
        ]
      ];
     
}

Tetris.prototype.makeBoard = function(width,height) {
  return d3.range(height).map(function() {
    return d3.range(width).map(function() {
      return 0;
    });
  });
}

Tetris.prototype.rotate = function(currentPiece) {
  var newpiece,
      size,
      auxboard,
      pRow=0,
      pCol=0;
  size = currentPiece.length;
  newpiece = currentPiece.map(function(test){ return test.slice(); });
  for(i=0;i<size;i++) {
    for(j=0;j<size;j++) {
      newpiece[j][(size-1)-i] = currentPiece[i][j];
    } 
  }
  auxboard = board.map(function(test){ return test.slice(); });
  for(i=this.currentY;i<(this.currentY+size) && i<height;i++) {
    pCol=0;
    for(j=this.currentX;j<(this.currentX+size) && j<width;j++) {
      if(currentPiece[pRow][pCol]) {
        auxboard[i][j] = 0;
      }
      pCol++;
    }
    pRow++;
  }
  pRow = pCol = 0;
  for(i=this.currentY;i<this.currentY+size;i++) {
    pCol = 0;
    for(j=this.currentX;j<this.currentX+size;j++) {
      if(auxboard[i][j] && newpiece[pRow][pCol]) {
        return false;
      }
      if( (newpiece[pRow][pCol] && j<0) || (newpiece[pRow][pCol] && j>=width)  ) {
        return false;
      }
      if(newpiece[pRow][pCol]) {
        auxboard[i][j] = newpiece[pRow][pCol];
      }
      pCol++;
    }
    pRow++; 
  }
  return {'board': auxboard,'piece': newpiece};
}
  
Tetris.prototype.start = function(tick,interval) {
    this.clock = setInterval(tick,interval)
}

Tetris.prototype.scoreRender = function() {
  d3.select('body').select('div.tetris-panel').selectAll('div.score')
                   .data(score)
                   .enter()
                   .append('div')
                     .attr('class','score')
                     .text(function(d) { return "Score: "+d; });
}

Tetris.prototype.updateScore = d3.scale.linear()
                          .domain([1,4])
                          .range([100,400]);
Tetris.prototype.clearLines = function() {
  var newboard;
  newboard = board.filter(function(test){return test.map(function(d){ return d>0 ? 1 : 0;}).reduce(function(a,b){return a+b}) != width;})
  if(newboard.length < board.length) {
    score.push(score.shift() + updateScore(board.length - newboard.length));
    d3.range(board.length - newboard.length).map(function(){
      newboard.unshift(d3.range(width).map(function(){return 0;}));
    });
  }
  d3.select('body').select('div.tetris-panel').selectAll('div.score')
                   .data(score)
                   .text(function(d) { return "Score: "+d; });
  return newboard;
}

Tetris.prototype.renderBoard = function(board) {
  d3.select('svg#tetris-board'+boardId)
      .selectAll('g')
        .data(board)
      .selectAll('rect')
           .data(function(d,i){return d;})
           .attr('x',function(d,i){return i*22;})
           .attr('width',20)
           .attr('height',20)
           .attr('style',function(d,i){ return 'fill:'+colorDict[d]; } );
}


Tetris.prototype.generatePiece = function() {
  var size,
      pRow=0,
      pCol=0;
  if( this.board[0].reduce(function(a,b){return a+b;}) > 0 ) {
    return false;
  }
  this.currentIndex = Math.floor(Math.random()*pieces.length)   
  this.currentY = 0;
  this.currentPiece = pieces[currentIndex]; 
  size = currentPiece.length; 
  this.currentX = Math.floor((width - size) / 2);
  for(i=this.currentY;i<(this.currentY+size);i++) {
    pCol = 0;
    for(j=this.currentX;j<(this.currentX+size);j++) {
      if((this.currentPiece[pRow][pCol] && this.board[i][j])) {
        return false;
      }
      if(this.currentPiece[pRow][pCol]) {  
        this.board[i][j] = this.currentPiece[pRow][pCol];
      }
      pCol++;
    } 
    pRow++;
  }
  return true;
}

Tetris.prototype.move = function(direction) {
  var size,
      pRow = 0,
      pCol = 0,
      collision = false; 
  size = this.sizes[this.currentIndex];
  auxboard = this.board.map(function(test){ return test.slice(); });
  d3.range(size).map(function(pRow){
    i = pRow + this.currentY;
    d3.range(size).map(function(pCol){
      j = pCol + this.currentX;
      if(currentPiece[pRow][pCol]) {
        auxboard[i][j] = 0;
      }
    });
  });

  d3.range(size).map(function(pRow){
    i = pRow + this.currentY;
    d3.range(size).map(function(pCol){
      j = pCol + this.currentX;
      if(currentPiece[pRow][pCol]) {
        if(direction == 'left') {
          if((j-1)<0 ) {
            //border collision
            collision = true;
            return;
          }
          if(auxboard[i][j-1]) {
            //piece collision
            collision = true;
            return;
          }
          auxboard[i][j-1] = currentPiece[pRow][pCol];         
        }
        if(direction == 'right') {
          if((j+1)>=width ) {
            //border collision
            collision = true;
            return;
          }
          if(auxboard[i][j+1]) {
            //piece collision
            collision = true;
            return;
          }
          auxboard[i][j+1] = currentPiece[pRow][pCol];         
        }
        if(direction == 'down') {
          if((i+1)>=height ) {
            //border collision
            collision = true;
            return;
          }
          if(auxboard[i+1][j]) {
            //piece collision
            collision = true;
            return;
          }
          auxboard[i+1][j] = currentPiece[pRow][pCol];         
        }
      }
    });
  });
  if(!collision) {
    if(direction == 'left') {
      this.currentX--;
    }
    if(direction == 'right') {
      this.currentX++;
    }
    if(direction == 'down') {
      this.currentY++;
    }
    return auxboard;
  }
  return false;
}

Tetris.prototype.pausePlay = function() {
  if(this.theend) { 
    return;
  }
  if(this.clock) {
    this.clock = clearInterval(clock);
  }
  else {
    this.clock = setInterval(tick,interval);
    this.tick();
  }
}

Tetris.prototype.gameOver = function() {
  this.clock = clearInterval(clock);
  this.theend = true;
}

Tetris.prototype.tick = function() {
  var test = false;
  if(this.currentIndex == -1) {
    if(!this.generatePiece()) {
      this.gameOver();
    } 
  }
  else {
    test=this.move('down');
    if(!test) {
      this.board = this.clearLines();
      this.currentIndex = -1;    
    }
    else {
      this.board = test;
    }
  } 
  this.renderBoard(this.board);
}

function game() {
  t = new Tetris();
  t.board = t.makeBoard(t.width,t.height);
  t.scoreRender();
  t.start(t.tick,t.interval);
  t.renderBoard(t.board);
  //Key handlers:
  $(document).keydown(function(e){
        var test;
        e.preventDefault();
        if (e.keyCode == 32) { 
          t.pausePlay();
        }
        if (e.keyCode == 37) { 
          test =  t.move('left');
        }
        if (e.keyCode == 38) { 
          test = t.rotate(t.currentPiece);
        }
        if (e.keyCode == 39) { 
          test = t.move('right')
        }
        if (e.keyCode == 40) { 
          test = t.move('down');
        }
        if(test) {
          t.board = test;
          t.renderBoard(t.board);
        }
  });

}

function handleGameOptions(data){
  

}


$(document).ready(function() {
    $('#closemodal').click(function(){
      $('#myModal').modal('hide'); 
    });
    $('#myModal').modal(); 
    $('#tetris-play').click();
    //tetris({}); 
});

