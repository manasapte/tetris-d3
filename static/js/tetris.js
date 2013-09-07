var tetris = {
        board : [],
        clock : undefined,
        theend : false,
        interval : 700,
        score : [0],
        width : 10,
        height : 22,
        currentPiece : undefined,
        currentIndex : -1,
        currentX : 0,
        currentY : 0,
        motionStarted : 0,
        sizes : [4,2,3,3,3,3,3],
        colorDict : {
          0 : 'DAF0ED',
          1 : 'FFA500',
          2 : '0000CD',
          3 : '008080',
          4 : 'FFFF00',
          5 : '008000',
          6 : '800080',
          7 : 'FF0000'
        },
        pieces : [
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
        ],
       
    makeBoard : function(width,height) {
      return d3.range(height).map(function() {
        return d3.range(width).map(function() {
          return 0;
        });
      });
    },

    rotate : function() {
      var newpiece,
          size,
          auxboard,
          pRow=0,
          pCol=0;
      size = sizes[currentIndex];
      newpiece = currentPiece.map(function(test){ return test.slice(); });
      for(i=0;i<size;i++) {
        for(j=0;j<size;j++) {
          newpiece[j][(size-1)-i] = currentPiece[i][j];
        } 
      }
      auxboard = board.map(function(test){ return test.slice(); });
      for(i=currentY;i<(currentY+size) && i<height;i++) {
        pCol=0;
        for(j=currentX;j<(currentX+size) && j<width;j++) {
          if(currentPiece[pRow][pCol]) {
            auxboard[i][j] = 0;
          }
          pCol++;
        }
        pRow++;
      }
      pRow = pCol = 0;
      for(i=currentY;i<currentY+size;i++) {
        pCol = 0;
        for(j=currentX;j<currentX+size;j++) {
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
      currentPiece = newpiece;
      return auxboard;
    },
      
    start : function(tick,interval) {
        clock = setInterval(tick,interval)
    },
 
    initRender : function(board) {
      var row,
          cells;
      d3.select('body').select('div.panel').selectAll('div.score')
                       .data(tetris.score)
                       .enter()
                       .append('div')
                         .attr('class','score')
                         .text(function(d) { return "Score: "+d; });
      row = d3.select('svg').selectAll('g')
                .data(board)
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
                   .attr('style','fill:'+tetris.colorDict[0])
          
    },
    
    updateScore : d3.scale.linear()
                              .domain([1,4])
                              .range([100,400]),
    clearLines : function() {
      var newboard;
      newboard = board.filter(function(test){return test.map(function(d){ return d>0 ? 1 : 0;}).reduce(function(a,b){return a+b}) != width;})
      if(newboard.length < board.length) {
        score.push(score.shift() + updateScore(board.length - newboard.length));
        d3.range(board.length - newboard.length).map(function(){
          newboard.unshift(d3.range(width).map(function(){return 0;}));
        });
        board = newboard
        d3.select('svg')
          .selectAll('g')
            .data(board)
          .selectAll('rect')
               .data(function(d,i){return d;})
               .transition()
                 .delay(200)
                 .duration(500)
               .attr('x',function(d,i){return i*22;})
               .attr('width',20)
               .attr('height',20)
               .attr('style',function(d,i){ return 'fill:'+tetris.colorDict[d]; } );

      }
      d3.select('body').select('div.panel').selectAll('div.score')
                       .data(score)
                       .text(function(d) { return "Score: "+d; });
    },

    renderBoard : function(board) {
      d3.select('svg')
          .selectAll('g')
            .data(board)
          .selectAll('rect')
               .data(function(d,i){return d;})
               .attr('x',function(d,i){return i*22;})
               .attr('width',20)
               .attr('height',20)
               .attr('style',function(d,i){ return 'fill:'+tetris.colorDict[d]; } );
    },

    
    generatePiece : function() {
      var size,
          pRow=0,
          pCol=0;
      if( board[0].reduce(function(a,b){return a+b;}) > 0 ) {
        return false;
      }
      tetris.currentIndex = Math.floor(Math.random()*tetris.pieces.length)   
      currentY = 0;
      currentPiece = pieces[currentIndex]; 
      size = sizes[currentIndex];
      currentX = Math.floor((width - size) / 2);
      for(i=currentY;i<(currentY+size);i++) {
        pCol = 0;
        for(j=currentX;j<(currentX+size);j++) {
          if((currentPiece[pRow][pCol] && board[i][j])) {
            return false;
          }
          if(currentPiece[pRow][pCol]) {  
            board[i][j] = currentPiece[pRow][pCol];
          }
          pCol++;
        } 
        pRow++;
      }
      return true;
    },
    
    move : function(direction) {
      var size,
          pRow = 0,
          pCol = 0,
          collision = false; 
      size = sizes[currentIndex];
      auxboard = board.map(function(test){ return test.slice(); });
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
          currentX--;
        }
        if(direction == 'right') {
          currentX++;
        }
        if(direction == 'down') {
          currentY++;
        }
        return auxboard;
      }
      return false;
    },

    pausePlay : function() {
      if(theend) { 
        return;
      }
      if(clock) {
        clock = clearInterval(clock);
      }
      else {
        clock = setInterval(tick,interval);
        tick();
      }
    },

    gameOver : function() {
      clock = clearInterval(clock);
      theend = true;
    },

    tick : function() {
      var test = false;
      if(tetris.currentIndex == -1) {
        if(!tetris.generatePiece()) {
          tetris.gameOver();
        } 
      }
      else {
        test=tetris.move('down');
        if(!test) {
          tetris.clearLines();
          tetris.currentIndex = -1;    
          return;
        }
        board = test;
      } 
      tetris.renderBoard(board);
    }
}

$(document).ready(function() {
    
    board = tetris.makeBoard(tetris.width,tetris.height);
    tetris.initRender(board);
    tetris.renderBoard(board);
    tetris.start(tetris.tick,tetris.interval);
    //Key handlers:
    $(document).keydown(function(e){
        var test;
        if (e.keyCode == 32) { 
          e.preventDefault();
          tetris.pausePlay();
        }
        if (e.keyCode == 37) { 
          test =  tetris.move('left');
        }
        if (e.keyCode == 38) { 
          test = tetris.rotate();
        }
        if (e.keyCode == 39) { 
          test = tetris.move('right')
        }
        if (e.keyCode == 40) { 
          e.preventDefault();
          test = tetris.move('down');
        }
        if(test) {
          board = test;
          tetris.renderBoard(board);
        }
    });
});

