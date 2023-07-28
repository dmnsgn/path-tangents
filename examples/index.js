import pathTangents from "../index.js";

import canvasContext from "canvas-context";
import { vec3 } from "pex-math";
import { Pane } from "tweakpane";

const CONFIG = {
  closed: true,
};

// Get paths
const TAU = 2 * Math.PI;
const radius = 200;
const divisions = 50;
const lineWidth = 2;

const starPath = [];
for (let i = 0; i < divisions; i++) {
  const n = i / divisions;
  const offset = radius * 0.1 * Math.cos(10 * n * TAU);
  starPath.push([
    (radius + offset) * Math.cos(TAU * n),
    (radius + offset) * Math.sin(TAU * n),
    0,
  ]);
}

// Draw debug
const { context, canvas } = canvasContext("2d");
document.querySelector("main").appendChild(canvas);

const draw = () => {
  const path = [...starPath];
  // Add first point to close path
  if (CONFIG.closed) path.push([...path[0]]);

  // Compute tangents
  const tangents = pathTangents(path, CONFIG.closed);

  const width = context.canvas.width;
  const height = context.canvas.height;

  // Clear
  context.fillStyle = "#111";
  context.fillRect(0, 0, width, height);

  // Draw
  context.save();
  context.translate(width * 0.5, height * 0.5);

  // Draw path
  context.lineWidth = lineWidth * 2;
  context.strokeStyle = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--color-light");

  context.beginPath();
  context.moveTo(...path[0]);
  for (let i = 1; i < path.length; i++) {
    context.lineTo(...path[i]);
  }
  context.stroke();
  context.closePath();

  // Draw tangents
  context.lineWidth = lineWidth * 0.5;
  for (let i = 0; i < path.length; i++) {
    const tangent = tangents[i];
    context.strokeStyle = `rgb(${127 + 128 * tangent[0]}, ${
      127 + 128 * tangent[1]
    }, 127)`;
    context.beginPath();
    context.moveTo(...path[i]);
    context.lineTo(...vec3.addScaled([...path[i]], tangent, radius / 3));
    context.stroke();
    context.closePath();
  }

  // Draw points
  context.fillStyle = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim();
  for (let i = 0; i < path.length; i++) {
    context.beginPath();
    context.arc(path[i][0], path[i][1], 1.5 * lineWidth, 0, TAU);
    context.closePath();
    context.fill();
  }

  context.restore();

  requestAnimationFrame(draw);
};

const onResize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
window.addEventListener("resize", onResize);
onResize();

draw();

const pane = new Pane();
pane.addInput(CONFIG, "closed");
