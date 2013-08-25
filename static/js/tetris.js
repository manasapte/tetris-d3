$(document).ready(function() {
  function tetris() {
    console.log("in tetris");
    var board = [],
        clock,
        theend = false,
        interval = 700,
        score = [0],
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
       
    var makeBoard = function(width,height) {
      return d3.range(height).map(function() {
        return d3.range(width).map(function() {
          return 0;
        });
      });
    }

    var rotate = function() {
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
            console.log("rotate sensing collision");
            return false;
          }
          if( (newpiece[pRow][pCol] && j<0) || (newpiece[pRow][pCol] && j>=width)  ) {
            console.log("rotate sensing collision");
            return false;
          }

          pCol++;
        }
        pRow++; 
      }
      pRow = pCol = 0;
      for(i=currentY;i<currentY+size;i++) {
        pCol = 0;
        for(j=currentX;j<currentX+size;j++) {
          if(newpiece[pRow][pCol]) {
            auxboard[i][j] = newpiece[pRow][pCol];
          }
          pCol++;
        }
        pRow++; 
      }
      board = auxboard;
      currentPiece = newpiece;

    }
      
    var start = function(tick,interval) {
        clock = setInterval(tick,interval)
    }
 
    var initRender = function(board) {
      var row,
          cells;
      d3.select('body').select('div.panel').selectAll('div.score')
                       .data(score)
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
                   .attr('style','fill:DAF0ED')
          
    }
    
    var updateScore = d3.scale.linear()
                              .domain([1,4])
                              .range([100,400]);
    var clearLines = function() {
      var newboard;
      newboard = board.filter(function(test){return test.reduce(function(a,b){return a+b}) != width;})
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
               .attr('style',function(d,i){ return d==0 ? 'fill:DAF0ED' : 'fill:152EE8'; } );

      }
      d3.select('body').select('div.panel').selectAll('div.score')
                       .data(score)
                       .text(function(d) { return "Score: "+d; });
    }

    var renderBoard = function(board) {
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
      if( board[0].reduce(function(a,b){return a+b;}) > 0 ) {
        return false;
      }
      currentIndex = Math.floor(Math.random()*pieces.length)   
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
          if(currentPiece[pRow][pCol] && j<0 ) {
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
          if(currentPiece[pRow][pCol] && j>=width) {
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
    
    var pausePlay = function() {
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
    }

    var gameOver = function() {
      //console.log("game over!");
      clock = clearInterval(clock);
      theend = true;
    }

    var tick = function() {
      //console.log("in tick and current index: "+currentIndex);
      if(currentIndex == -1) {
        if(!generatePiece()) {
          gameOver();
        } 
      }
      else {
        if(!moveDown()) {
          clearLines();
          currentIndex = -1;    
          return;
        }
      } 
      renderBoard();
    }
    
    board = makeBoard(width,height);
    initRender(board);
    //console.log("board after init board: "+board);
    renderBoard(board);
    start(tick,interval);
    //Key handlers:

    $(document).keydown(function(e){
        if (e.keyCode == 32) { 
          e.preventDefault();
          console.log("space");
          pausePlay();
        }

        if (e.keyCode == 37) { 
          moveLeft();
          renderBoard(board);
        }
        if (e.keyCode == 38) { 
          rotate();
          renderBoard(board);
        }
        if (e.keyCode == 39) { 
          moveRight();
          renderBoard(board);
        }
        if (e.keyCode == 40) { 
          e.preventDefault();
          moveDown();
          renderBoard(board);
        }

    });

  }
  tetris(); 
  
 

});

