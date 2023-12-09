import useSWR from "swr";
import * as d3 from "d3";


export type OHLCData = {
    open: number;
    close: number;
    high: number;
    low: number;
    closeDate: Date;
}

async function fetcher(url: string) {
  const tParser = d3.timeParse("%Y-%m-%d");
  const row = (d: any) => {
    return {
      open: +d.Open,
      close: +d.Close,
      high: +d.High,
      low: +d.Low,
      closeDate: tParser(d.Date) || new Date(2999, 12, 31)
    };
  };
  const result = await d3.csv<OHLCData>(url, row);
  return result;
}

export function useChartData({ symbol }: { symbol: string }) {
  const { data, isLoading, error } = useSWR(
    `api/chart?symbol=${symbol}`,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}
