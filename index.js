// Good Hexagon Info: http://www.redblobgames.com/grids/hexagons/

(function (chance, Snap) {
  const ctx = Snap("#map");
  let hexGrid = createHexGrid({
    degrees: [30, 90, 150, 210, 270, 330, 390],
    center: {x: 250, y: 50},
    radius: 50,

    /**
     * Each element represents the number of hexes in a row
     * for the first half of the grid, after the mid point it
     * repeats row definitions in reverse order
     */
    rowDefinitions: [4, 5, 6, 7, 8, 7, 6, 5, 4]
  });

  console.log('Hex Grid', hexGrid);

  function createHexGrid(params) {
    let {degrees, center, radius, rowDefinitions} = params;
    let hexagon;
    let hexGrid = new Map();
    let middleRowXOffset;

    // The height of a hexagon is it's radius * 2
    const hexagonHeight = radius * 2;

    // The width of a hexagon is sqrt(3)/2 * height
    const hexagonWidth = Math.sqrt(3) / 2 * hexagonHeight;
    const halfHexWidth = hexagonWidth / 2;
    const initialX = center.x;

    // each row is larger than last, becomes false after middle row
    let rowsAscending = true;
    let middleRowNum = Math.floor(rowDefinitions.length / 2);

    for (let currentRow = 0; currentRow < rowDefinitions.length; currentRow += 1) {
      let numCols = rowDefinitions[currentRow];
      
      if(currentRow === middleRowNum) {
        rowsAscending = false;
        middleRowXOffset = center.x + halfHexWidth;
        console.log(middleRowXOffset);
      } 

      for (let currentCol = 0; currentCol < numCols; currentCol += 1) {
        let hexagonPoints = determinePolygonPoints({
          degrees,
          center,
          radius
        });

        hexagon = ctx.path(createPolygon(hexagonPoints));
        hexagon = setupHex(hexagon);
        displayHexCoordinates({ 
          hexagon, 
          hexCenter: center,
          row: currentRow,
          col: currentCol
        });

        // store each hex in map
        hexGrid.set({row: currentRow, col: currentCol}, hexagon);

        // Horizontal distance between two hexes is the width of a hexagon
        center.x += hexagonWidth;
      }

      // Vertical distance between two hexes is height * 3/4
      center.y += hexagonHeight * 3 / 4;

      // equal to half hexagon width * row num
      if(rowsAscending) {
        center.x = initialX - (halfHexWidth * (currentRow + 1));
      } else {
        center.x = 
          middleRowXOffset + (halfHexWidth * Math.abs((rowDefinitions.length - (middleRowNum  + currentRow + 1))));
      }
    }

    return hexGrid;
  }

  function determinePolygonPoints(params) {
    let {
      degrees,
      center,
      radius
    } = params;
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

  function displayHexCoordinates(params) {
    let {hexagon, hexCenter, row, col} = params;
    ctx.text(hexCenter.x, hexCenter.y, `${row},${col}`);
  }

}(chance, Snap));