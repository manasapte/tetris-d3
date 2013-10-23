function Tetris(params) {
      if(!params) {
        params = {};
      }
      console.log("params: "+JSON.stringify(params));
      this.gameId = params.gameId || -1;
      this.board = params.board || [],
      this.secondPlayer = params.secondPlayer || false;
      this.boardId = params.boardId || 1,
      this.clock = params.clock || undefined,
      this.theend = params.theend || false,
      this.interval = params.interval || 700,
      this.score = params.score || [0],
      this.width = params.width || 10,
      this.height = params.height || 22,
      this.currentPiece = params.currentPiece || undefined,
      this.currentIndex = params.currentIndex || -1,
      this.nextIndex = params.nextIndex || -1;
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
      randLength = this.pieces.length;
      this.randPieces = params.randPieces || d3.range(10000).map(function(){return Math.floor(Math.random()*randLength);});
}

Tetris.prototype.move = function(direction) {
  var size,
      currentPiece,
      auxboard,
      height,
      width,
      currentX,
      currentY,
      pRow = 0,
      pCol = 0,
      collision = false; 
  size = this.sizes[this.currentIndex];
  auxboard = this.board.map(function(test){ return test.slice(); });
  currentPiece = this.currentPiece;
  currentX = this.currentX;
  currentY = this.currentY;
  height = this.height;
  width = this.width;
  d3.range(size).map(function(pRow){
    i = pRow + currentY;
    d3.range(size).map(function(pCol){
      j = pCol + currentX;
      if(currentPiece[pRow][pCol]) {
        auxboard[i][j] = 0;
      }
    });
  });

  d3.range(size).map(function(pRow){
    i = pRow + currentY;
    d3.range(size).map(function(pCol){
      j = pCol + currentX;
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
};


Tetris.prototype.makeBoard = function(width,height) {
  return d3.range(height).map(function() {
    return d3.range(width).map(function() {
      return 0;
    });
  });
};

Tetris.prototype.nextPrender = function() {
  var nextProw,
      nextPcels,
      colorDict;
  colorDict = this.colorDict;
  nextProw = d3.select('svg#tetris-nextpiece'+this.boardId).selectAll('g')
               .data(this.getNextpiece(this.nextIndex))
               .attr('transform',function(d,i){ return 'translate(0,'+i*22+')';})
  nextPcells = nextProw.selectAll('rect')
                         .data(function(d,i){return d;})               
                       .attr('x',function(d,i){return i*22;})
                       .attr('width',20)
                       .attr('height',20)
                       .attr('style',function(d,i){ return 'fill:'+colorDict[d]; } );
}

Tetris.prototype.getNextpiece = function(index) {
  var piece,
      nextPiece;
  nextPiece =  d3.range(4).map(function(){
    return d3.range(4).map(function(){
      return 0;
    });
  }); 
  if(index == -1) {
    return nextPiece;
  }
  piece = this.pieces[index];
  for(i=0;i<piece.length;i++) {
    for(j=0;j<piece.length;j++) {
      nextPiece[i][j] = piece[i][j];
    }
  }
  return nextPiece;
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
  auxboard = this.board.map(function(test){ return test.slice(); });
  for(i=this.currentY;i<(this.currentY+size) && i<this.height;i++) {
    pCol=0;
    for(j=this.currentX;j<(this.currentX+size) && j<this.width;j++) {
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
      if( (newpiece[pRow][pCol] && j<0) || (newpiece[pRow][pCol] && j>=this.width)  ) {
        return false;
      }
      if(newpiece[pRow][pCol]) {
        auxboard[i][j] = newpiece[pRow][pCol];
      }
      pCol++;
    }
    pRow++; 
  }
  this.currentPiece = newpiece;
  return auxboard;
};
  
Tetris.prototype.initRender = function() {
  d3.select('body').select('div#tetris-score'+this.boardId).selectAll('div.score')
                   .data(this.score)
                   .enter()
                   .append('div')
                     .attr('class','score')
                     .text(function(d) { return "Score: "+d; });
  nextProw = d3.select('svg#tetris-nextpiece'+this.boardId).selectAll('g')
               .data(this.getNextpiece(-1))
               .enter()
               .append('g') 
                 .attr('transform',function(d,i){ return 'translate(0,'+i*22+')';})
  nextPcells = nextProw.selectAll('rect')
                         .data(function(d,i){return d;})               
                       .enter()
                       .append('rect')
                         .attr('x',function(d,i){return i*22;})
                         .attr('width',20)
                         .attr('height',20)
                         .attr('style','fill:DAF0ED')


  row = d3.select('svg#tetris-board'+this.boardId).selectAll('g')
                .data(this.board)
              .enter()
              .append('g')
                .attr('transform',function(d,i){ return 'translate(0,'+i*22+')';})
  cells = row.selectAll('rect')
               .data(function(d,i){return d;})
             .enter()
             .append('rect')
               .attr('x',function(d,i){return i*22;})
               .attr('width',20)
               .attr('height',20)
               .attr('style','fill:DAF0ED')

};

Tetris.prototype.updateScore = d3.scale.linear()
                          .domain([1,4])
                          .range([100,400]);

Tetris.prototype.scoreRender = function() {
  d3.select('body').select('div#tetris-score'+this.boardId).selectAll('div.score')
                   .data(this.score)
                   .text(function(d) { return "Score: "+d; });
}

Tetris.prototype.clearLines = function() {
  var newboard,
      width;
  width = this.width;
  newboard = this.board.filter(function(test){return test.map(function(d){ return d>0 ? 1 : 0;}).reduce(function(a,b){return a+b}) != width;})
  if(newboard.length < this.board.length) {
    this.score.push(this.score.shift() + this.updateScore(this.board.length - newboard.length));
    console.log("this score: "+this.score);
    d3.range(this.board.length - newboard.length).map(function(){
      newboard.unshift(d3.range(width).map(function(){return 0;}));
    });
  }
  this.scoreRender();
  return newboard;
};

Tetris.prototype.renderBoard = function() {
  var colorDict;
  colorDict = this.colorDict;
  d3.select('svg#tetris-board'+this.boardId)
      .selectAll('g')
        .data(this.board)
      .selectAll('rect')
           .data(function(d,i){return d;})
           .attr('x',function(d,i){return i*22;})
           .attr('width',20)
           .attr('height',20)
           .attr('style',function(d,i){ return 'fill:'+colorDict[d]; } );
};

Tetris.prototype.generatePiece = function() {
  var size,
      pRow=0,
      pCol=0;
  if( this.board[0].reduce(function(a,b){return a+b;}) > 0 ) {
    return false;
  }
  if(this.nextIndex == -1) {
    this.currentIndex = this.randPieces.shift();
  }
  else {
    this.currentIndex = this.nextIndex; 
  }
  this.nextIndex = this.randPieces.shift();
  this.currentY = 0;
  this.currentPiece = this.pieces[this.currentIndex]; 
  size = this.currentPiece.length; 
  this.currentX = Math.floor((this.width - size) / 2);
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
};


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
};

Tetris.prototype.gameOver = function() {
  this.clock = clearInterval(this.clock);
  this.theend = true;
};

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
      this.board = this.clearLines(this.board,this.score);
      this.currentIndex = -1;    
    }
    else {
      this.board = test;
    }
  } 
  this.renderBoard();
  this.nextPrender();
};


var handleGameOptions = function(socket){
  var multi;
  if($('#tetris-alias').val().trim() == "") {
    $('#error-alias').removeClass('error-hidden')
                     .addClass('error-visible');
    return;
  }
    
  socket.on('login',function(data){
    console.log('logged in with id: '+data.id+" and partner id: "+data.partner+" and pieces: "+data.pieces);
    $('#tetris-play').button('reset')

    $('#myModal').modal('hide'); 
    multi = false;
    if(data.partner != -1) {
      multi= true;
    }
    game(multi,data.pieces,socket);
  });

  if($('#optionsRadios2').prop('checked')) {
    $('#tetris-play').button('loading')
    socket.emit('login',{'multi':true})
  }
  else {
    socket.emit('login',{'multi':false}) 
  }
};

var game = function(multi,pieces,socket) {
  t = new Tetris();
  t.board = t.makeBoard(t.width,t.height);
  if(multi) {
    t.randPieces = pieces;
    s = new Tetris({'boardId':2})
    s.board = s.makeBoard(s.width,s.height);
    s.initRender();
    t.secondPlayer = s;
  }
  t.initRender();
  t.clock = setInterval(function(){
    t.tick();
    console.log('emitting sync')
    ret = socket.emit('sync',{"board":t.board,"score":t.score,"nextIndex":t.nextIndex});
    if(multi) {
      socket.on('sync', function(data){
        data = JSON.parse(data.partnerData);
        s.board = data.board;
        s.nextIndex = data.nextIndex;
        s.score = data.score;
        s.renderBoard();
        s.nextPrender();
        s.scoreRender();
      });
    }
  },t.interval)
  t.renderBoard();
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
          t.renderBoard();
        }
  });

}


$(document).ready(function() {
  var socket;
  $('#closemodal').click(function(){
    $('#myModal').modal('hide'); 
  });
  $('#tetris-alias').click(function(){
    $('#error-alias').removeClass('error-visible')
                     .addClass('error-hidden'); 
  });
  $('#myModal').modal(); 
  $('#tetris-play').click(function(){
    socket = io.connect('/players'); 
    socket.on('connect',function(data){
      console.log('player connected');
    });
    handleGameOptions(socket);
  });
});

