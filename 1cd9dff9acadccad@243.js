function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Slope chart</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# 長照安養機構變化趨勢

使用「老人長期照顧、安養機構所數及可供進住人數.csv」的歷年資料，觀察機構數與可供進住人數在最早與最新年度的變化。`
)}

function _chart(d3,data,dodge)
{

  // Specify the chart’s dimensions.
  const width = 928;
  const height = 600;
  const marginTop = 40;
  const marginRight = 50;
  const marginBottom = 10;
  const marginLeft = 50;
  const padding = 3;
  
  // Prepare the positional scales.
  const x = d3.scalePoint()
    .domain([0, 1])
    .range([marginLeft, width - marginRight])
    .padding(0.5);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data.series.flatMap(d => [d.start, d.end]))])
    .nice()
    .range([height - marginBottom, marginTop]);

  const line = d3.line()
    .x((d, i) => x(i))
    .y(y);

  const formatNumber = y.tickFormat(100);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Append the x axis.
  svg.append("g")
      .attr("text-anchor", "middle")
    .selectAll("g")
    .data([0, 1])
    .join("g")
      .attr("transform", (i) => `translate(${x(i)},20)`)
      .call(g => g.append("text").text((i) => i ? data.years[1] : data.years[0]))
      .call(g => g.append("line").attr("y1", 3).attr("y2", 9).attr("stroke", "currentColor"));

  // Create a line for each country.
  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
    .selectAll("path")
    .data(data.series)
    .join("path")
      .attr("d", (d) => line([d.start, d.end]));

  // Create a group of labels for each year.
  svg.append("g")
    .selectAll("g")
    .data([0, 1])
    .join("g")
      .attr("transform", (i) => `translate(${x(i) + (i ? padding : -padding)},0)`)
      .attr("text-anchor", (i) => i ? "start" : "end")
    .selectAll("text")
    .data((i) => d3.zip(
      data.series.map(i ? (d) => `${formatNumber(d.end)} ${d.name}` : (d) => `${d.name} ${formatNumber(d.start)}`),
      dodge(data.series.map(d => y(d[i ? "end" : "start"]))))))
    .join("text")
      .attr("y", ([, y]) => y)
      .attr("dy", "0.35em")
      .text(([text]) => text);

  return svg.node();
}


function _data(FileAttachment){return(
FileAttachment("老人長期照顧、安養機構所數及可供進住人數.csv").csv({typed: true}).then((rows) => {
  const sorted = rows.slice().sort((a, b) => a["年份"] - b["年份"]);
  const first = sorted.at(0);
  const last = sorted.at(-1);

  return {
    years: [first["年份"], last["年份"]],
    series: [
      {name: "機構數", start: first["機構數"], end: last["機構數"]},
      {name: "可供進住人數", start: first["可供進住人數"], end: last["可供進住人數"]}
    ]
  };
})
)}

function _dodge(d3){return(
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
)}

function _5(md){return(
md`See the [Plot: Slope chart](/@observablehq/plot-slope-chart) notebook for a similar chart made with [Observable Plot](/plot/)’s concise API.`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["老人長期照顧、安養機構所數及可供進住人數.csv", {url: new URL("./files/%E8%80%81%E4%BA%BA%E9%95%B7%E6%9C%9F%E7%85%A7%E9%A1%A7%E3%80%81%E5%AE%89%E9%A4%8A%E6%A9%9F%E6%A7%8B%E6%89%80%E6%95%B8%E5%8F%8A%E5%8F%AF%E4%BE%9B%E9%80%B2%E4%BD%8F%E4%BA%BA%E6%95%B8.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["d3","data","dodge"], _chart);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("dodge")).define("dodge", ["d3"], _dodge);
  main.variable(observer()).define(["md"], _5);
  return main;
}
