export default async function getPrice() {
  const url =
    "https://gateway.thegraph.com/api/subgraphs/id/DiYPVdygkfjDWhbxGSqAQxwBKmfKnkWQojqeM2rkLb3G";

  // 1 PEPU = 0.000000566141 ETH
  const pepuEth = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 0b071495d8b3052de57bbdffab13b383`,
    },
    body: JSON.stringify({
      query:
        '{ pool(id: "0xb1b10b05aa043dd8d471d4da999782bc694993e3ecbe8e7319892b261b412ed5") { id token0Price } }',
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.pool.token0Price);

  // 1 ETH = 2500 USD
  const ethUsd = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 0b071495d8b3052de57bbdffab13b383`,
    },
    body: JSON.stringify({
      query:
        '{ pool(id: "0x21c67e77068de97969ba93d4aab21826d33ca12bb9f565d8496e8fda8a82ca27") { id token1Price } }',
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.pool.token1Price);

  const pepuUsd = pepuEth * ethUsd;
  return pepuUsd;
}
