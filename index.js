import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const dataUrl = new URL("./files/老人長期照顧、安養機構所數及可供進住人數.csv", import.meta.url);

async function loadData() {
  const rows = await d3.csv(dataUrl.href, d3.autoType);
  if (!rows.length) throw new Error("資料檔案為空");

  const sorted = rows.slice().sort((a, b) => a["年份"] - b["年份"]);
  const first = sorted.at(0);
  const last = sorted.at(-1);

  return {
    years: [first["年份"], last["年份"]],
    series: [
      { name: "機構數", start: first["機構數"], end: last["機構數"] },
      { name: "可供進住人數", start: first["可供進住人數"], end: last["可供進住人數"] }
    ]
  };
}

function renderChart({ years, series }) {
  const width = 928;
  const height = 600;
  const marginTop = 40;
  const marginRight = 50;
  const marginBottom = 10;
  const marginLeft = 50;
  const padding = 3;

  const x = d3.scalePoint()
    .domain([0, 1])
    .range([marginLeft, width - marginRight])
    .padding(0.5);

  const y = d3.scaleLinear()
    .domain([0, d3.max(series.flatMap(d => [d.start, d.end]))])
    .nice()
    .range([height - marginBottom, marginTop]);

  const line = d3.line()
    .x((d, i) => x(i))
    .y(y);

  const formatNumber = y.tickFormat(100);

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  svg.append("g")
    .attr("text-anchor", "middle")
    .selectAll("g")
    .data([0, 1])
    .join("g")
    .attr("transform", (i) => `translate(${x(i)},20)`)
    .call(g => g.append("text").text((i) => i ? years[1] : years[0]))
    .call(g => g.append("line").attr("y1", 3).attr("y2", 9).attr("stroke", "currentColor"));

  svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("d", (d) => line([d.start, d.end]));

  svg.append("g")
    .selectAll("g")
    .data([0, 1])
    .join("g")
    .attr("transform", (i) => `translate(${x(i) + (i ? padding : -padding)},0)`)
    .attr("text-anchor", (i) => i ? "start" : "end")
    .selectAll("text")
    .data((i) => d3.zip(
      series.map(i ? (d) => `${formatNumber(d.end)} ${d.name}` : (d) => `${d.name} ${formatNumber(d.start)}`),
      dodge(series.map(d => y(d[i ? "end" : "start"])))
    ))
    .join("text")
    .attr("y", ([, y]) => y)
    .attr("dy", "0.35em")
    .text(([text]) => text);

  const target = document.getElementById("chart");
  target.innerHTML = "";
  target.appendChild(svg.node());
}

function dodge(positions, separation = 10, maxiter = 10, maxerror = 1e-1) {
  positions = Array.from(positions);
  let n = positions.length;
  if (!positions.every(isFinite)) throw new Error("invalid position");
  if (!(n > 1)) return positions;
  let index = d3.range(positions.length);
  for (let iter = 0; iter < maxiter; ++iter) {
    index.sort((i, j) => d3.ascending(positions[i], positions[j]));
    let error = 0;
    for (let i = 1; i < n; ++i) {
      let delta = positions[index[i]] - positions[index[i - 1]];
      if (delta < separation) {
        delta = (separation - delta) / 2;
        error = Math.max(error, delta);
        positions[index[i - 1]] -= delta;
        positions[index[i]] += delta;
      }
    }
    if (error < maxerror) break;
  }
  return positions;
}

function renderError(error) {
  const target = document.getElementById("chart");
  target.innerHTML = `<div style="color: #b30000; font-size: 14px;">載入資料時發生錯誤：${error.message}</div>`;
  console.error(error);
}

loadData().then(renderChart).catch(renderError);
