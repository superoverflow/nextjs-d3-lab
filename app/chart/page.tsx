"use client";
import { useMemo } from "react";
import { useChartData } from "./useChart";

import * as d3 from "d3";

const Axis = ({ domain = [0, 100], range = [10, 700] }) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear().domain(domain).range(range);

    const width = range[1] - range[0];
    const pixelsPerTick = 30;
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [domain.join("-"), range.join("-")]);

  return (
    <g>
      <path
        d={["M", range[0], 6, "v", -6, "H", range[1], "v", 6].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </g>
  );
};

export default function Page() {
  const { data } = useChartData({ symbol: "SPY" });

  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  

  return (
    <svg width={width} height={height}>
      <g>
    
         <g transform={`translate(0, ${height - margin.bottom})`}>
          <Axis domain={[0, 100]} range={[margin.left, width - margin.right]} />
        </g>
      </g>
    </svg>
  );
}
