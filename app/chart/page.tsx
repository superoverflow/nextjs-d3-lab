"use client"
import * as d3 from "d3"
import { useMemo } from "react"
import { useWindowSize } from "@uidotdev/usehooks"
import { useChartDimensions } from "./useChartDimensions"
import { YAxis, TimeAxis } from "@/components/Axis"
import { useChartData } from "./useChart"
import type { OHLCData } from "./useChart"

//TODO: move to useChartDimensions
const dateToStr = d3.timeFormat("%y-%m-%d")

function OHLCBar({
  data,
  x,
  y,
}: {
  data: OHLCData
  x: d3.ScaleBand<string>
  y: d3.ScaleLinear<number, number, never>
}) {
  
  const xOffset = x(dateToStr(data.closeDate))
  return (
    <path
      d={`
        M${xOffset},${y(data.low)}V${y(data.high)}
        M${xOffset},${y(data.open)}h-4
        M${xOffset},${y(data.close)}h4
      `}
      fill="none"
      stroke="currentColor"
    />
  )
}

export default function Page() {
  const { data } = useChartData({ symbol: "SPY" })
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

  const tScale = useMemo(() => {
    const dates = d3.timeDay
      .range(new Date(2022, 6, 1), new Date(2023, 11, 31))
      .filter((d) => d.getDay() !== 0 && d.getDay() !== 6)
      .map((d) => dateToStr(d))

    return d3
      .scaleBand()
      .domain(dates)
      .range([dms.marginLeft, dms.marginLeft + dms.boundedWidth])
      .padding(0.2)
  }, [data, dms.boundedWidth])

  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([300, 480])
        .range([dms.marginTop + dms.boundedHeight, dms.marginTop]),
    [data, dms.boundedHeight],
  )

  return (
    <div ref={ref}>
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${xScale.range()[1]}, 0)`}>
          <YAxis domain={yScale.domain()} range={yScale.range()} />
        </g>
        <g transform={`translate(0, ${yScale.range()[0]})`}>
          <TimeAxis range={tScale.range()} />
        </g>
        {data?.map((d, i) => 
          <OHLCBar key={i} data={d} x={tScale} y={yScale} />)
        }
      </svg>
    </div>
  )
}
