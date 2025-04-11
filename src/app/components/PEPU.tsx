import { Data } from "@/types";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { createPublicClient, http } from "viem";

export default function PEPU() {
  // https://recharts.org/en-US/examples/SimpleBarChart
  const [data, setData] = useState([] as Data[]);

  const client = createPublicClient({
    transport: http("https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz"),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    // get price of PEPE
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=pepe-unchained&vs_currencies=usd"
    ).then((res) => res.json());
    const price = res["pepe-unchained"].usd;

    // get latest block
    const blockNumber = Number(await client.getBlockNumber());

    // calculate blocks per day (2 seconds per block)
    const blocksPerDay = 43_200;

    // get balances for the last x days
    const blocks = Array.from(
      { length: 10 }, // number of days
      (_, i) => blockNumber - i * blocksPerDay
    );

    // https://viem.sh/docs/clients/transports/http.html
    const balances = await Promise.all(
      blocks.map(async (block) => {
        const balance = await client.getBalance({
          address: process.env.NEXT_PUBLIC_EOA_ADDRESS as `0x${string}`,
          blockNumber: block
        });
        return balance;
      })
    );

    // format data
    const formattedData = balances
      .map((balance, i) => {
        return {
          name: new Date(
            Date.now() - i * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
          date: new Date(
            Date.now() - i * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
          amount: (Number(balance) / 1e18) * price,
        };
      })
      .reverse();
    console.log(formattedData);
    setData(formattedData);
  };

  return (
    <BarChart
      width={1500}
      height={500}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <YAxis dataKey="amount" />
      <XAxis dataKey="name" />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="amount"
        fill="#8884d8"
        activeBar={<Rectangle fill="pink" stroke="blue" />}
      />
    </BarChart>
  );
}
