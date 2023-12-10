import * as d3 from "d3"
import { useMemo } from "react"

export const XAxis = ({ domain = [0, 100], range = [10, 700] }) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear().domain(domain).range(range)

    const width = range[1] - range[0]
    const pixelsPerTick = 30
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick))

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }))
  }, [domain.join("-"), range.join("-")])

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
  )
}

export const YAxis = ({ domain = [0, 100], range = [10, 300] }) => {
  const ticks = useMemo(() => {
    const yScale = d3.scaleLinear().domain(domain).range(range)

    const height = range[0] - range[1]
    const pixelsPerTick =50
    const numberOfTicksTarget = Math.max(1, Math.floor(height / pixelsPerTick))

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
    }))
  }, [domain.join("-"), range.join("-")])

  return (
    <g>
      <path
        d={["M", 6, range[0], "h", -6, "V", range[1], "h", 6].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, yOffset }) => (
        <g key={value} transform={`translate(0, ${yOffset})`}>
          <line x2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateX(20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </g>
  )
}

export const TimeAxis = ({
  domain = [new Date(2023, 0, 1), new Date(2023, 11, 31)],
  range = [30, 300],
}) => {
  const dateToStr = d3.timeFormat("%y-%m-%d")
  const ticks = useMemo(() => {
    const dates = d3.timeDay
      .range(domain[0], domain[1])
      .filter((d) => d.getDay() !== 0 && d.getDay() !== 6)
      .map((d) => dateToStr(d))

    const tScale = d3.scaleBand().domain(dates).range(range).paddingInner(0.2)

    return d3.timeMonday
      .range(domain[0], domain[1], 10)
      .map((value) => ({
        value: d3.timeFormat("%b-%d")(value),
        xOffset: tScale(dateToStr(value)),
      }))
  }, [domain.join("-"), range.join("-")])

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
  )
}
