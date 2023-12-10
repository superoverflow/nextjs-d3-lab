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

const START_DATE = new Date(2022, 8, 1)
const END_DATE = new Date()

function OHLCBar({
  data,
  x,
  y,
}: {
  data: OHLCData
  x: d3.ScaleBand<string>
  y: d3.ScaleLinear<number, number, never>
}) {
  const xOffset = x(dateToStr(data.closeDate)) || 0 
  const strokeColor = data.open < data.close ? "green" : "red"
  const y1 = data.open > data.close ? y(data.open) : y(data.close)
  const y2 = data.open > data.close ? y(data.close) : y(data.open)
  const height = y2 - y1
  return (
    <g>
      <path
        d={`M${xOffset},${y(data.low)}V${y(data.high)}`}
        fill="none"
        stroke={strokeColor}
      />
      <rect
        x={xOffset - x.bandwidth() / 2}
        y={y1}
        width={x.bandwidth()}
        height={height}
        fill={strokeColor}
      />
    </g>
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

  const tScale = useMemo(() => {
    const dates = d3.timeDay
      .range(START_DATE, END_DATE)
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
        <g transform={`translate(${tScale.range()[1]}, 0)`}>
          <YAxis domain={yScale.domain()} range={yScale.range()} />
        </g>
        <g transform={`translate(0, ${yScale.range()[0]})`}>
          <TimeAxis range={tScale.range()} domain={[START_DATE, END_DATE]} />
        </g>
        {data?.map((d, i) => (
          <OHLCBar key={i} data={d} x={tScale} y={yScale} />
        ))}
      </svg>
    </div>
  )
}
