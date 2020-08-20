const graphicsСanvas = document.getElementById("graphicsСanvas");
const ctx = graphicsСanvas.getContext("2d");

// if (graphicsСanvas.getContext) {
//   const ctx = graphicsСanvas.getContext("2d");
//   // drawing code here
// } else {
//   // canvas-unsupported code here
// }

const canW =
    document.documentElement.clientWidth > 800
      ? 800
      : document.documentElement.clientWidth - 16,
  canH = canW * 0.6;

graphicsСanvas.width = canW;
graphicsСanvas.height = canH;

ctx.translate(0, graphicsСanvas.height);
ctx.scale(1, -1);
ctx.fillStyle = "rgba(158,167,184,0.3)";
ctx.fillRect(0, 0, canW, canH);

const canvasPadding = canH * 0.07;

ctx.translate(canvasPadding, canvasPadding);
ctx.moveTo(0, 0);
ctx.lineTo(canW - 2 * canvasPadding, 0);
ctx.moveTo(0, 0);
ctx.lineTo(0, canH - 2 * canvasPadding);
ctx.stroke();

let pointsAmount = Math.floor(Math.random() * 8) + 2;
let pointsCoords = getChartData(pointsAmount);
drawintGraph(pointsCoords);
graphicsСanvas.onclick = redrawintGraph;

function redrawintGraph() {
  console.log(pointsCoords);
  let newPointsAmount = Math.floor(Math.random() * 8) + 2;
  let newPointsCoords = getChartData(newPointsAmount);
  const intermediatePointsCoords = newPointsCoords.map((_, index) => {
    return {
      ...pointsCoords[
        Math.ceil((pointsCoords.length / newPointsCoords.length) * index) - 1
      ],
    };
  });
  console.log("intermediatePointsCoords", intermediatePointsCoords);
  console.log("newPointsCoords", newPointsCoords);
}

function drawintGraph(pointsCoords) {
  ctx.fillStyle = "#FFFFFF";
  pointsCoords.forEach(({ x, y }, index) => {
    if (index) {
      lineDrawing(pointsCoords[index - 1].x, pointsCoords[index - 1].y, x, y);
    }
  });
  pointsCoords.forEach(({ x, y }) => {
    pointDrawing(x, y);
  });
}

function getChartData(pointsAmount) {
  const pointsCoords = [];
  for (let i = 0; i < pointsAmount; i++) {
    let x = ((canW - 2 * canvasPadding) / pointsAmount) * (i + 0.5);
    let y = Math.floor(Math.random() * (canH - 2 * canvasPadding));
    pointsCoords.push({ x, y });
  }
  return pointsCoords;
}

function lineDrawing(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function pointDrawing(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();
}
