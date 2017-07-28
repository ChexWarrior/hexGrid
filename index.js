// Good Hexagon Info: http://www.redblobgames.com/grids/hexagons/

(function (chance, Snap, Honeycomb) {

  const {Grid, HEX_ORIENTATIONS} = Honeycomb;
  const ctx = Snap("#map");
  const grid = Grid({size: 50, origin: [-250, -250]});
  const hexGrid = grid.rectangle({width: 5, height: 5});

  for(let hex of hexGrid) {
    let point = grid.hexToPoint(hex);

    let hexPoints = determinePolygonPoints({
      degrees: [30, 90, 150, 210, 270, 330, 390],
      center: point,
      radius: 50
    });

    let hexPath = ctx.path(createPolygon(hexPoints));
    setupHex(hexPath);
  }

  function determinePolygonPoints(params) {
    let {degrees, center, radius} = params;
    let polygonPoints = [];
    let x, y;

    for (let i = 0; i < degrees.length; i += 1) {
      x = center.x + radius * Math.cos(degrees[i] * (Math.PI / 180));
      y = center.y + radius * Math.sin(degrees[i] * (Math.PI / 180));
      polygonPoints.push({
        x,
        y
      });
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

  function setupHex(hexagon) {
    // style hex
    let hexColor = chance.color({format: 'hex'});
    hexagon.attr({
      fill: hexColor,
      stroke: '#000'
    });

    // events
    hexagon.mouseover(() => {
      hexagon.attr({
        fill: '#FFF'
      });
    });

    hexagon.mouseout(() => {
      hexagon.attr({
        fill: hexColor
      });
    });

    return hexagon;
  }

}(chance, Snap, Honeycomb));