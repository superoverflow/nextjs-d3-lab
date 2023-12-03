"use client"
import * as d3 from "d3"
import { useMemo } from "react"
import { useChartDimensions } from "./useChartDimensions"
import { XAxis, YAxis } from "@/components/Axis"

export default function Page() {
  // const { data } = useChartData({ symbol: "SPY" })

  const chartSettings = {
    width: 460,
    height: 460,
    margin: { top: 20, right: 40, bottom: 40, left: 20 },
  }
  const { ref, dms } = useChartDimensions(chartSettings)
  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, 100])
        .range([dms.marginLeft, dms.boundedWidth]),
    [dms.boundedWidth],
  )

  return (
    <div ref={ref}>
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${dms.boundedWidth}, 0)`}>
          <YAxis
            domain={[100, 0]}
            range={[dms.marginTop, dms.height - dms.marginBottom]}
          />
        </g>
        <g transform={`translate(0, ${dms.height - dms.marginBottom})`}>
          <XAxis domain={xScale.domain()} range={xScale.range()} />
        </g>
      </svg>
    </div>
  )
}
