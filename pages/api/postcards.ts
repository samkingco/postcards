import { NextApiRequest, NextApiResponse } from "next";
import { getInventory } from "../../airtable";
import { shuffle } from "../../utils";

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
