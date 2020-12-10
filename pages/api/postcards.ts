import { NextApiRequest, NextApiResponse } from "next";
import { getInventory } from "../../airtable";

function randomValue(a?: number, b?: number) {
  if (!a && a !== 0) return Math.random();
  if (!b && b !== 0) return Math.random() * a;
  if (a > b) [a, b] = [b, a];
  return a + Math.random() * (b - a);
}

function randomInt(a?: number, b?: number) {
  return ~~randomValue(a, b);
}

function shuffle<T>(arr: Array<T>) {
  let tmpArray = [...arr];
  for (let i = tmpArray.length - 1; i; i--) {
    let randomIndex = randomInt(i + 1);
    [tmpArray[i], tmpArray[randomIndex]] = [tmpArray[randomIndex], tmpArray[i]];
  }
  return tmpArray;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const postcards = await getInventory();
    res.statusCode = 200;
    res.json(shuffle(postcards));
  } catch (err) {
    res.statusCode = 500;
    res.json({ statusCode: 500, message: err.message });
  }
};
