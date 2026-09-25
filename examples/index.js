import pathTangents from "../index.js";

import canvasContext from "canvas-context";
import { vec3 } from "pex-math";
import { Pane } from "tweakpane";

const METHODS = {
  forward: "#ff5a5a",
  uniform: "#ffd23f",
  centripetal: "#5aff8c",
  chordal: "#3fc8ff",
};

const CONFIG = {
  shape: "edgeCases",
  closed: false,
  method: "all",
};

// Get paths
const TAU = 2 * Math.PI;
const radius = 200;
const divisions = 50;
const lineWidth = 2;
const tangentLength = 40;

const star = Array.from({ length: divisions }, (_, i) => {
  const n = i / divisions;
  const offset = radius * 0.1 * Math.cos(10 * n * TAU);
  return [
    (radius + offset) * Math.cos(TAU * n),
    (radius + offset) * Math.sin(TAU * n),
    0,
  ];
});

// Fixed jitter so the shape is the same on every reload
const jitter = [0, 0.3, -0.35, 0.2, -0.1, 0.4, -0.3, 0.1, -0.25, 0.35, 0];

const edgeCases = [
  // Straight line with uneven spacing
  ...[-320, -300, -295, -240, -180].map((x) => [x, -150, 0]),
  // Sharp corner between unequal segments
  [-180, -60, 0],
  // Duplicated point
  [-180, 0, 0],
  [-180, 0, 0],
  // Smooth arc with even spacing
  ...Array.from({ length: 12 }, (_, i) => {
    const a = Math.PI - (Math.PI * (i + 1)) / 12;
    return [-100 + 80 * Math.cos(a), 80 * Math.sin(a), 0];
  }),
  // Sine wave with uneven spacing
  ...jitter.slice(1).map((j, i) => {
    const u = (i + 1 + j) / 10;
    return [-20 + 180 * u, -50 * Math.sin(u * TAU), 0];
  }),
  // Path folding back on itself
  [220, 0, 0],
  [270, 0, 0],
  [220, 0, 0],
  // Tight loop with spacing growing along it
  ...Array.from({ length: 24 }, (_, i) => {
    const a = Math.PI / 2 + TAU * 0.9 * ((i + 1) / 24) ** 2;
    return [220 + 40 * Math.cos(a), -40 + 40 * Math.sin(a), 0];
  }),
].map((p) => p.map((n) => n * 2));

const shapes = { edgeCases, star };

// Draw debug
const { context, canvas } = canvasContext("2d");
document.querySelector("main").append(canvas);

const getColor = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const drawTangents = (path, tangents, color) => {
  context.lineWidth = lineWidth * 0.5;
  context.strokeStyle = color;
  for (let i = 0; i < path.length; i++) {
    context.beginPath();
    context.moveTo(...path[i]);
    context.lineTo(...vec3.addScaled([...path[i]], tangents[i], tangentLength));
    context.stroke();
  }
};

const draw = () => {
  const path = shapes[CONFIG.shape];
  const methods =
    CONFIG.method === "all" ? Object.keys(METHODS) : [CONFIG.method];

  const width = context.canvas.width;
  const height = context.canvas.height;

  // Clear
  context.fillStyle = "#111";
  context.fillRect(0, 0, width, height);

  // Legend
  context.font = "14px monospace";
  methods.forEach((method, i) => {
    context.fillStyle = METHODS[method];
    context.fillText(method, 20, 100 + i * 20);
  });

  // Draw
  context.save();
  context.translate(width * 0.5, height * 0.5);

  // Draw path
  context.lineWidth = lineWidth * 2;
  context.strokeStyle = getColor("--color-light");
  context.beginPath();
  context.moveTo(...path[0]);
  for (let i = 1; i < path.length; i++) context.lineTo(...path[i]);
  if (CONFIG.closed) context.closePath();
  context.stroke();

  // Draw tangents
  for (const method of methods) {
    drawTangents(
      path,
      pathTangents(path, { closed: CONFIG.closed, method }),
      METHODS[method],
    );
  }

  // Draw points
  context.fillStyle = getColor("--color-accent");
  for (let i = 0; i < path.length; i++) {
    context.beginPath();
    context.arc(path[i][0], path[i][1], 1.5 * lineWidth, 0, TAU);
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
pane.addBinding(CONFIG, "shape", {
  options: Object.fromEntries(Object.keys(shapes).map((key) => [key, key])),
});
pane.addBinding(CONFIG, "closed");
pane.addBinding(CONFIG, "method", {
  options: Object.fromEntries(
    ["all", ...Object.keys(METHODS)].map((key) => [key, key]),
  ),
});

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) canvas.remove();
  });
}
