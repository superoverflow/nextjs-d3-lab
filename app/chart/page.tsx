"use client"
import * as d3 from "d3"
import { useMemo } from "react"
import { useWindowSize } from "@uidotdev/usehooks";
import { useChartDimensions } from "./useChartDimensions"
import { XAxis, YAxis } from "@/components/Axis"

export default function Page() {
  // const { data } = useChartData({ symbol: "SPY" })
  const { height, width } = useWindowSize()

  const chartSettings = {
    width: width || 800,
    height: height || 600,
    margin: { top: 40, right: 80, bottom: 80, left: 40 },
  }
  const { ref, dms } = useChartDimensions(chartSettings)
  
  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, 100])
        .range([dms.marginLeft, dms.marginLeft + dms.boundedWidth]),
    [dms.boundedWidth],
  )
  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([100, 0])
        .range([dms.marginTop, dms.marginTop + dms.boundedHeight]),
    [dms.boundedHeight],
  )

  return (
    <div ref={ref}>
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${dms.marginLeft + dms.boundedWidth}, 0)`}>
          <YAxis
            domain={yScale.domain()}
            range={yScale.range()}
          />
        </g>
        <g transform={`translate(0, ${dms.marginTop + dms.boundedHeight})`}>
          <XAxis domain={xScale.domain()} range={xScale.range()} />
        </g>
      </svg>
    </div>
  )
}
