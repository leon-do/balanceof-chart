import { ChartData } from "@/types";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { createPublicClient, http } from "viem";

export default function WPEPU() {
  // https://recharts.org/en-US/examples/SimpleBarChart
  const [data, setData] = useState([] as ChartData[]);

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
        const balance = await client.readContract({
          address: "0x4200000000000000000000000000000000000006",
          functionName: "balanceOf",
          abi: [
            {
              inputs: [
                { internalType: "address", name: "account", type: "address" },
              ],
              name: "balanceOf",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
          ],
          args: [process.env.NEXT_PUBLIC_EOA_ADDRESS as `0x${string}`],
          blockNumber: BigInt(block),
        });
        return balance;
      })
    );

    // format data
    const formattedData: ChartData[] = balances
      .map((balance, i) => {
        const date = Date.now() - i * 24 * 60 * 60 * 1000;
        return {
          name: new Date(date).toLocaleDateString(),
          date: date,
          amount: (Number(balance) / 1e18) * price,
        };
      })
      .reverse();
    setData(formattedData);
  };

  return (
    <div className="h-[500px] w-full my-20">
      WPEPU Balance
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <YAxis dataKey="amount" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Bar
            dataKey="amount"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
