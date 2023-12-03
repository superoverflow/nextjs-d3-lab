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
    width: (width || 460) * 0.8,
    height: (height || 460) * 0.8,
    margin: { top: 20, right: 40, bottom: 40, left: 20 },
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

  return (
    <div ref={ref}>
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${dms.marginLeft + dms.boundedWidth}, 0)`}>
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
