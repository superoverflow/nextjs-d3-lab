import useSWR from "swr";
import * as d3 from "d3";


export type Data = {
    Close: number;
    Date: Date;
}

async function fetcher(url: string) {
  const tParser = d3.timeParse("%Y-%m-%d");
  const row = (d: any) => {
    d.Close = +d.Close;
    d.Date = tParser(d.Date);
    return d;
  };
  const result = await d3.csv<Data>(url, row);
  return result;
}

export function useChartData({ symbol }: { symbol: string }) {
  const { data, isLoading, error } = useSWR(
    `http://localhost:3000/api/chart?symbol=${symbol}`,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}
