
// make a nextjs function return hello world

import { NextApiRequest, NextApiResponse } from "next"


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const symbol = req.query.symbol
  const url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=1664727901&period2=1696263901&interval=1d&events=history&includeAdjustedClose=true`
  const response = await fetch(url)
  const csv = await response.text()
  
  //how to return a csv file?
  res.status(200).write(csv)
  res.end()
}
