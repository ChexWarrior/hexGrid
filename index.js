// Good Hexagon Info: http://www.redblobgames.com/grids/hexagons/

(function(chance, Snap, Honeycomb) {

  class Board {
    constructor(Hex) {
      this.Hex = Hex;
      this.map = new Map();
    }

    getHex(x, y, z) {
      return this.map.get(`${x}${y}${z}`);
    }

    setHex(x, y, z, hex) {
      //console.log(`Set hex ${x}, ${y}, ${z}`);
      this.map.set(`${x}${y}${z}`, hex);
    }

    selectAdjHexes(targetHex) {
      let {x, y, z} = targetHex;
      console.log(`Select Adj Hexes called by Hex: ${x}, ${y}, ${z}`);
      //this.sayWord('hi');
      for(let neighbor of this.Hex.neighbors(targetHex)) {
        let {x, y, z} = neighbor;
        let adjHex = this.getHex(x, y, z);
        if(adjHex) adjHex.select();
      }
    }
  }

  class BoardUnit {
    constructor(hexPath, hexInfo, hexMap) {
      this.hexPath = hexPath;
      this.hexInfo = hexInfo;
      this.board = hexMap;
      this.setup();
    }

    select() {
      this.hexPath.attr({
        stroke: 'red',
        strokeWidth: 2
      });
    }

    setup() {
      let hexColor = chance.color({format: 'hex'});
      this.hexPath.attr({
        fill: hexColor,
        stroke: '#000'
      });

      // events
      this.hexPath.mouseover(() => {
        this.hexPath.attr({
          fill: '#FFF'
        });
      });

      this.hexPath.mouseout(() => {
        this.hexPath.attr({
          fill: hexColor
        });
      });

      this.hexPath.click(() => {
        this.board.selectAdjHexes(this.hexInfo);
      });
    }
  }

  class BoardFactory {
    constructor(grid) {
      this.grid = grid;
    }

    determineHexagonPoints(params) {
      let {center, radius} = params;
      let degrees = [30, 90, 150, 210, 270, 330, 390];
      let polygonPoints = [];
      let x, y;

      for (let i = 0; i < degrees.length; i += 1) {
        x = center.x + radius * Math.cos(degrees[i] * (Math.PI / 180));
        y = center.y + radius * Math.sin(degrees[i] * (Math.PI / 180));
        polygonPoints.push({x, y});
      }

      return polygonPoints;
    }

    createHexagon(points) {
      let firstPoint = true;
      let polygon = '';

      for (let {x, y} of points) {
        if (firstPoint) {
          polygon += `M${x},${y}`;
          firstPoint = false;
        } else {
          polygon += `L${x},${y}`;
        }
      }

      return polygon;
    }
    
    build(width, height) {
      const board = new Board(this.grid.Hex);
      const rectangle = this.grid.rectangle({width, height});

      for(let hex of rectangle) {
        let {x, y, z} = hex;
        let point = this.grid.hexToPoint(hex);
        let hexPoints = this.determineHexagonPoints({
          center: point,
          radius: 50
        });

        let hexPath = ctx.path(this.createHexagon(hexPoints));
        
        // store hex info
        board.setHex(x, y, z, new BoardUnit(hexPath, hex, board));
      }

      return board;
    }
  }

  const {Grid, HEX_ORIENTATIONS} = Honeycomb;
  const ctx = Snap("#map");
  let gameBoard = 
    new BoardFactory(Grid({size: 50, origin: [-45, -50]}))
      .build(10, 10);

  console.log(gameBoard);

}(chance, Snap, Honeycomb));