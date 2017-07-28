// Good Hexagon Info: http://www.redblobgames.com/grids/hexagons/

(function(chance, Snap, Honeycomb) {

  const {Grid, HEX_ORIENTATIONS} = Honeycomb;
  const ctx = Snap("#map");
  let hexes = buildHexRectangle(
    Grid({size: 50, origin: [-250, -250]})
  );

  console.log(hexes);

  function buildHexRectangle(grid) {
    const hexes = new Map();
    const rectangle = grid.rectangle({width: 5, height: 5});

    for(let hex of rectangle) {
      let {x, y, z} = hex;
      let point = grid.hexToPoint(hex);
      let hexPoints = determinePolygonPoints({
        degrees: [30, 90, 150, 210, 270, 330, 390],
        center: point,
        radius: 50
      });

      // store hex info
      hexes.set({x, y, z}, {hex});

      let hexPath = ctx.path(createPolygon(hexPoints));
      setupHex(hexPath);
      displayCoords(hex, point);
    }

    return hexes;
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