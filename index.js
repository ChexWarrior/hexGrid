// Good Hexagon Info: http://www.redblobgames.com/grids/hexagons/

(function(chance, Snap, Honeycomb) {

  class SpaceCollection {
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

  class Space {
    constructor(hexPath, hexInfo, hexMap) {
      this.path = hexPath;
      this.info = hexInfo;
      this.map = hexMap;
      this.setup();
    }

    select() {
      this.path.attr({
        stroke: 'red',
        strokeWidth: 2
      });
    }

    setup() {
      let hexColor = chance.color({format: 'hex'});
      this.path.attr({
        fill: hexColor,
        stroke: '#000'
      });

      // events
      this.path.mouseover(() => {
        this.path.attr({
          fill: '#FFF'
        });
      });

      this.path.mouseout(() => {
        this.path.attr({
          fill: hexColor
        });
      });

      this.path.click(() => {
        this.map.selectAdjHexes(this.info);
      });
    }
  }

 // console.log(hexes);

  function buildHexRectangle(grid) {
    const hexCollection = new SpaceCollection(grid.Hex);
    const rectangle = grid.rectangle({width: 5, height: 5});

    for(let hex of rectangle) {
      let {x, y, z} = hex;
      let point = grid.hexToPoint(hex);
      let hexPoints = determinePolygonPoints({
        degrees: [30, 90, 150, 210, 270, 330, 390],
        center: point,
        radius: 50
      });

      let hexPath = ctx.path(createPolygon(hexPoints));
      displayCoords(hex, point);
      
      // store hex info
      hexCollection.setHex(x, y, z, new Space(hexPath, hex, hexCollection));
    }

    return hexCollection;
  }

  function determinePolygonPoints(params) {
    let {degrees, center, radius} = params;
    let polygonPoints = [];
    let x, y;

    for (let i = 0; i < degrees.length; i += 1) {
      x = center.x + radius * Math.cos(degrees[i] * (Math.PI / 180));
      y = center.y + radius * Math.sin(degrees[i] * (Math.PI / 180));
      polygonPoints.push({x, y});
    }

    return polygonPoints;
  }

  function createPolygon(points) {
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

  function displayCoords(hex, center) {
    let {x, y, z} = hex;
    ctx.text(center.x - 20, center.y, `${x},${y},${z}`);
  }

  const {Grid, HEX_ORIENTATIONS} = Honeycomb;
  const ctx = Snap("#map");
  let hexCollection = buildHexRectangle(
    Grid({size: 50, origin: [-250, -250]})
  );

  console.log(hexCollection);

}(chance, Snap, Honeycomb));