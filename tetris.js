$(document).ready(function() {
  function tetris() {
    console.log("in tetris");
    var board = [],
        clock,
        width = 10,
        height = 22,
        currentPiece,
        currentIndex = -1,
        currentX = 0,
        currentY = 0,
        motionStarted = 0;
        sizes = [4,2,3,3,3,3,3],
        pieces = [
          [  [1, 1, 1, 1],
             [0, 0, 0, 0],
             [0, 0, 0, 0],
             [0, 0, 0, 0]
          ],
          [  [1, 1],
             [1, 1]
          ],
          [  [0, 1, 0],
             [1, 1, 1],
             [0, 0, 0]
          ],
          [  [0, 1, 1],
             [1, 1, 0],
             [0, 0, 0]
          ],
          [  [1, 1, 0],
             [0, 1, 1],
             [0, 0, 0]
          ],
          [  [1, 0, 0],
             [1, 1, 1],
             [0, 0, 0]
          ],
          [  [0, 0, 1],
             [1, 1, 1],
             [0, 0, 0]
          ]
        ];
       
    var initBoard = function() {
      var row;
      for(i=0;i<height;i++) {
        row = [];
        for(j=0;j<width;j++) {
          row.push(0) 
        }
        board.push(row)
      }
      initRender();
    }

    var rotate = function(piece) {
      newpiece = piece.slice();
      for(i=0;i<piece.length;i++) {
        for(j=0;j<piece.length;j++) {
          newpiece[j][(piece.length-1)-i] = piece[i][j];
        } 
      }
    }
      
    var start = function() {
        clock = setInterval(tick,1000)
    }
 
    var initRender = function() {
      var row,
          cells;
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
                   .attr('style','fill:DAF0ED')
          
    }

    var renderBoard = function() {
      d3.select('svg')
          .selectAll('g')
            .data(board)
          .selectAll('rect')
               .data(function(d,i){return d;})
               .attr('x',function(d,i){return i*22;})
               .attr('width',20)
               .attr('height',20)
               .attr('style',function(d,i){ return d==0 ? 'fill:DAF0ED' : 'fill:152EE8'; } );
    }

    
    var generatePiece = function() {
      var size,
          pRow=0,
          pCol=0;
      currentIndex = Math.floor(Math.random()*pieces.length)   
      currentY = 0;
      currentPiece = pieces[currentIndex]; 
      size = sizes[currentIndex];
      currentX = Math.floor((width - size) / 2);
      for(i=currentY;i<(currentY+size);i++) {
        pCol = 0;
        for(j=currentX;j<(currentX+size);j++) {
          if(currentPiece[pRow][pCol] && board[i][j]) {
            return false;
          }  
          board[i][j] = currentPiece[pRow][pCol];
          pCol++;
        } 
        pRow++;
      }
      return true;
    }
    
    var moveLeft = function() {
      var size,
          pRow = 0,
          pCol = 0; 
      size = sizes[currentIndex];
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
      for(i=currentY;i<(currentY+size);i++) {
        pCol = 0;
        for(j=currentX-1;j<(currentX-1+size);j++) {
          if(j<0) {
            console.log("border collision");
            return false;
          }
          if(currentPiece[pRow][pCol] && auxboard[i][j]) {
            console.log("piece collision");
            return false;
          }
          pCol++;
        }
        pRow++; 
      }
      pRow = pCol = 0;
      for(i=currentY;i<(currentY+size);i++) {
        pCol = 0;
        for(j=currentX;j<(currentX+size);j++) {
          if(currentPiece[pRow][pCol]) {
            board[i][j] = 0; 
          }
          pCol++;
        }
        pRow++; 
      }
      pRow = pCol = 0;
      for(i=currentY;i<(currentY+size);i++) {
        pCol = 0;
        for(j=currentX;j<(currentX+size);j++) {
          if(currentPiece[pRow][pCol]) {
            board[i][j-1] = currentPiece[pRow][pCol];         
          }
          pCol++;
        }
        pRow++; 
      }

      currentX--;
    }

    var moveRight = function() {
      var size,
          pRow = 0,
          pCol = 0; 
      size = sizes[currentIndex];
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
      for(i=currentY;i<(currentY+size);i++) {
        pCol = 0;
        for(j=currentX+1;j<(currentX+1+size);j++) {
          if(j>=width) {
            console.log("border collision");
            return false;
          }
          if(currentPiece[pRow][pCol] && auxboard[i][j]) {
            console.log("piece collision");
            return false;
          }
          pCol++;
        }
        pRow++; 
      }
      pRow = pCol = 0;
      for(i=currentY;i<(currentY+size);i++) {
        pCol = 0;
        for(j=currentX;j<(currentX+size);j++) {
          if(currentPiece[pRow][pCol]) {
            board[i][j] = 0;
          }
          pCol++;
        }
        pRow++; 
      }
      pRow = pCol = 0;
      for(i=currentY;i<(currentY+size);i++) {
        pCol = 0;
        for(j=currentX;j<(currentX+size);j++) {
          if(currentPiece[pRow][pCol]) {
            board[i][j+1] = currentPiece[pRow][pCol];
          }
          pCol++;
        }
        pRow++; 
      }

      currentX++;
    }

 
    var moveDown = function() {
      var size,
          pRow = 0,
          pCol = 0;
      size = sizes[currentIndex];
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
      for(i=currentY+1;i<(currentY+1+size) && i<height+size;i++) {
        pCol = 0;
        for(j=currentX;j<(currentX+size);j++) {
          if(currentPiece[pRow][pCol] && i > (height-1)) {
            return false;
          }
          pCol++;
        }
        pRow++;
      }
      pRow = pCol = 0;
      for(i=currentY+1;i<(currentY+1+size) && i<height;i++) {
        pCol = 0;
        for(j=currentX;j<(currentX+size);j++) {
          if(auxboard[i][j] && currentPiece[pRow][pCol]) {
            return false;
          }
          pCol++;
        }
        pRow++; 
      }
      pRow = pCol = 0;
      for(i=currentY+1;i<(currentY+1+size) && i<height;i++) {
        pCol = 0;
        for(j=currentX;j<(currentX+size);j++) {
          if(currentPiece[pRow][pCol]) {
              auxboard[i][j] = currentPiece[pRow][pCol]; 
          }
          pCol++;
        }
        pRow++; 
      }
      board = auxboard;
      currentY++;
      return true;
    }

    var gameOver = function() {
      console.log("game over!");
      clearInterval(clock);
    }

    var tick = function() {
      console.log("in tick and current index: "+currentIndex);
      if(currentIndex == -1) {
        if(!generatePiece()) {
          gameOver();
        } 
      }
      else {
        if(!moveDown()) {
          currentIndex = -1;    
        }
      } 
      renderBoard();
    }
    
    initBoard();
    console.log("board after init board: "+board);
    renderBoard();
    start();
    //Key handlers:

    $(document).keydown(function(e){
        if (e.keyCode == 37) { 
           moveLeft();
           renderBoard();
        }
        if (e.keyCode == 38) { 
           alert( "up pressed" );
           return false;
        }
        if (e.keyCode == 39) { 
           moveRight();
           renderBoard();
        }
        if (e.keyCode == 40) { 
          moveDown();
        }

    });

  }
  tetris(); 
  
 

});

