$(document).ready(function() {
  function tetris() {
    console.log("in tetris");
    var board = [],
        width = 10,
        height = 22,
        pieces = [
          [  [0, 0, 0, 0],
             [1, 1, 1, 1],
          ],
          [  [0, 1, 1, 0],
             [0, 1, 1, 0]
          ],
          [  [0, 1, 0, 0],
             [1, 1, 1, 0]
          ],
          [  [0, 1, 1, 0],
             [1, 1, 0, 0]
          ],
          [  [1, 1, 0, 0],
             [0, 1, 1, 0]
          ],
          [  [1, 0, 0, 0],
             [1, 1, 1, 0]
          ],
          [  [0, 0, 1, 0],
             [1, 1, 1, 0]
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
    }
 
    var renderBoard = function() {
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
                   .attr('fill','2DD64F')
          
    }
    
    initBoard();
    console.log("board after init board: "+board);
    renderBoard();
  }
  tetris(); 
});

