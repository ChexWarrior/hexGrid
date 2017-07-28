// Good Hexagon Info: http://www.redblobgames.com/grids/hexagons/
(function() {
  const ctx = Snap("#map");
  createHexGrid({
    degrees: [30, 90, 150, 210, 270, 330, 390],
    center: {x: 50, y: 50},
    radius: 50,
    numRows: 5,
    numCols: 5,
    ctx
  });
}());

function createHexGrid(params) {
  let {degrees, center, radius, numRows, numCols, ctx} = params;
  let hexagon;

  // The height of a hexagon is it's radius * 2
  const hexagonHeight = radius * 2;

  // The width of a hexagon is sqrt(3)/2 * height
  const hexagonWidth = Math.sqrt(3) / 2 * hexagonHeight;
  const initialX = center.x;

  for(let i = 0; i < numRows; i += 1) {
    for(let j = 0; j < numCols; j += 1) {
      let hexagonPoints = determinePolygonPoints({degrees, center, radius});
      console.log(`Row:${i} Col:${j}`, hexagonPoints);
      hexagon = ctx.path(createPolygon(hexagonPoints));
      hexagon.attr({
        fill: '#' + Math.floor(Math.random() * 16777215).toString(16),
        stroke: '#000'
      });

      // Horizontal distance between two hexes is the width of a hexagon
      center.x += hexagonWidth;
    }

    // Vertical distance between two hexes is height * 3/4
    center.y += hexagonHeight * 3/4;

    /**
     * Even rows should have the initial horizontal offset while odd rows
     * need to equal to the initial offset plus half the width of a hexagon
     */
    center.x = (i % 2 === 1) ? initialX : initialX + (hexagonWidth / 2);
  }
}

function determinePolygonPoints(params) {
  let {degrees, center, radius} = params;
  let polygonPoints = [];
  let x, y;

  for(let i = 0; i < degrees.length; i += 1) {
    x = center.x + radius * Math.cos(degrees[i] * (Math.PI/180));
    y = center.y + radius * Math.sin(degrees[i] * (Math.PI/180));
    polygonPoints.push({x, y});
  }

  return polygonPoints;
}

function createPolygon(points) {
  let firstPoint = true;
  let polygon = '';
  
  for(let {x, y} of points) {
    if(firstPoint) {
      polygon += `M${x},${y}`;
      firstPoint = false;
    } else {
      polygon += `L${x},${y}`;
    }
  }

  return polygon;
}