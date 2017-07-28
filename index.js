// Good Hexagon Info: http://www.redblobgames.com/grids/hexagons/

(function (chance, Snap) {
  const ctx = Snap("#map");
  let hexGrid = createHexGrid({
    degrees: [30, 90, 150, 210, 270, 330, 390],
    center: {x: 50, y: 50},
    radius: 50,
    numRows: 10,
    numCols: 8,
    ctx
  });

  console.log(hexGrid);


  function createHexGrid(params) {
    let {
      degrees,
      center,
      radius,
      numRows,
      numCols,
      ctx
    } = params;
    let hexagon;
    let hexGrid = new Map();

    // The height of a hexagon is it's radius * 2
    const hexagonHeight = radius * 2;

    // The width of a hexagon is sqrt(3)/2 * height
    const hexagonWidth = Math.sqrt(3) / 2 * hexagonHeight;
    const initialX = center.x;

    for (let currentRow = 0; currentRow < numRows; currentRow += 1) {
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

      /**
       * Even rows should have the initial horizontal offset while odd rows
       * need to equal to the initial offset plus half the width of a hexagon
       */
      center.x = (currentRow % 2 === 1) ? initialX : initialX + (hexagonWidth / 2);
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

    for (let {
        x,
        y
      } of points) {
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