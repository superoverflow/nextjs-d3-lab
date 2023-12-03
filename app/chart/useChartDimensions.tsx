import { useState, useRef, useEffect } from "react"
import { ResizeObserver } from "@juggle/resize-observer"

// taken from https://wattenberger.com/blog/react-and-d3

type Dimensions = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

const combineChartDimensions = (dimensions: Dimensions) => {
  const parsedDimensions = {
    ...dimensions,
    marginTop: dimensions.margin?.top || 10,
    marginRight: dimensions.margin?.right || 10,
    marginBottom: dimensions.margin?.bottom || 40,
    marginLeft: dimensions.margin?.left || 75,
  }
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0,
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0,
    ),
  }
}

export const useChartDimensions = (passedSettings: {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const dimensions = combineChartDimensions(passedSettings)

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (dimensions.width && dimensions.height) return
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return
      if (!entries.length) return

      const entry = entries[0]

      if (width != entry.contentRect.width) setWidth(entry.contentRect.width)
      if (height != entry.contentRect.height)
        setHeight(entry.contentRect.height)
    })
    const element = ref.current
    if (element) {
      resizeObserver.observe(element)
      return () => element && resizeObserver.unobserve(element)
    }
  }, [])

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  })

  return { ref, dms: newSettings }
}
