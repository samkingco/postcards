import { NextApiRequest, NextApiResponse } from "next";
import { markAsSent } from "../../airtable";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const id: string = req.body.id;

    try {
      await markAsSent(id);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.statusCode = 200;
    } catch (err) {
      res.statusCode = 500;
      res.json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
