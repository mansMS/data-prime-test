const graphicsСanvas = document.getElementById("graphicsСanvas");
const ctx = graphicsСanvas.getContext("2d");

const canW =
  document.documentElement.clientWidth > 800
    ? 800
    : document.documentElement.clientWidth - 16;
const canH = canW * 0.6;

graphicsСanvas.width = canW;
graphicsСanvas.height = canH;
const canvasPadding = canH * 0.07;

ctx.translate(0, graphicsСanvas.height);
ctx.scale(1, -1);
ctx.translate(canvasPadding, canvasPadding);

drawPlane();

let pointsAmount = getPointsAmount();
let pointsCoords = getChartData(pointsAmount);
drawintGraph(pointsCoords);

let timerId;
let isDrawing = false;

graphicsСanvas.onclick = redrawintGraph;

function redrawintGraph() {
  if (isDrawing) {
    clearTimeout(timerId);
  }
  isDrawing = true;
  const oldPointsAmount = pointsCoords.length;

  const newPointsAmount = getPointsAmount();
  const newPointsCoords = getChartData(newPointsAmount);

  let startPointsCoords = [];
  let endPointsCoords = [];

  if (oldPointsAmount === newPointsAmount) {
    startPointsCoords = copyCoords(pointsCoords);
    endPointsCoords = copyCoords(newPointsCoords);
  } else if (oldPointsAmount < newPointsAmount) {
    endPointsCoords = copyCoords(newPointsCoords);
    const lengthRation = oldPointsAmount / newPointsAmount;
    for (let i = 1; i <= newPointsAmount; i++) {
      let index =
        (lengthRation * i) % 1 <= lengthRation / 2
          ? Math.floor(lengthRation * i) - 1
          : Math.ceil(lengthRation * i) - 1;
      startPointsCoords.push({ ...pointsCoords[index] });
    }
  } else {
    startPointsCoords = copyCoords(pointsCoords);
    const lengthRation = newPointsAmount / oldPointsAmount;
    for (let i = 1; i <= oldPointsAmount; i++) {
      let index =
        (lengthRation * i) % 1 <= lengthRation / 2
          ? Math.floor(lengthRation * i) - 1
          : Math.ceil(lengthRation * i) - 1;
      endPointsCoords.push({ ...newPointsCoords[index] });
    }
  }

  const iterateNumber = 60;
  const iterateTime = 700;

  const deltaPoints = endPointsCoords.map(({ x, y }, index) => ({
    x: (x - startPointsCoords[index].x) / iterateNumber,
    y: (y - startPointsCoords[index].y) / iterateNumber,
  }));

  let time = 0;
  timerId = setInterval(() => {
    time++;
    for (let i = 0; i < startPointsCoords.length; i++) {
      startPointsCoords[i].x += deltaPoints[i].x;
      startPointsCoords[i].y += deltaPoints[i].y;
    }
    drawPlane();
    drawintGraph(startPointsCoords);

    pointsAmount = startPointsCoords.length;
    pointsCoords = startPointsCoords;

    if (time >= iterateNumber) {
      clearInterval(timerId);
      isDrawing = false;
      pointsAmount = newPointsAmount;
      pointsCoords = newPointsCoords;
    }
  }, iterateTime / iterateNumber);

  function copyCoords(pointsCoords) {
    return pointsCoords.map((coords) => ({ ...coords }));
  }
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

function getPointsAmount() {
  return Math.floor(Math.random() * 9) + 2;
}

function drawintGraph(pointsCoords) {
  ctx.fillStyle = "#FFFFFF";
  pointsCoords.forEach(({ x, y }, index) => {
    if (index) {
      drawLine(pointsCoords[index - 1].x, pointsCoords[index - 1].y, x, y);
    }
  });
  pointsCoords.forEach(({ x, y }) => {
    drawPoint(x, y);
  });
}

function drawPlane() {
  ctx.beginPath();
  ctx.fillStyle = "rgba(158,167,184,0.3)";
  ctx.clearRect(-canvasPadding, -canvasPadding, canW, canH);
  ctx.fillStyle = "rgba(158,167,184,0.3)";
  ctx.fillRect(-canvasPadding, -canvasPadding, canW, canH);
  drawAxes();
}

function drawAxes() {
  drawLine(0, 0, canW - 2 * canvasPadding, 0);
  drawLine(0, 0, 0, canH - 2 * canvasPadding);
}

function drawLine(x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();
}
