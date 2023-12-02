"use client"
import { useChartData } from "./useChart"
import { XAxis, YAxis } from "@/components/Axis"

export default function Page() {
  const { data } = useChartData({ symbol: "SPY" })

  const width = 440
  const height = 440
  const margin = { top: 20, right: 20, bottom: 20, left: 20 }

  return (
    <svg width={width} height={height}>
      <g>
        <g transform={`translate(${width-margin.left}, 0)`}>
          <YAxis
            domain={[100, 0]}
            range={[margin.top, height - margin.bottom]}
          />
        </g>
        <g transform={`translate(0, ${height - margin.bottom})`}>
          <XAxis
            domain={[0, 100]}
            range={[margin.left, width - margin.right]}
          />
        </g>
      </g>
    </svg>
  )
}
