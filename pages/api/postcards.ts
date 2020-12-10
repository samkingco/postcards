import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  res.json([{ id: "1" }, { id: "2" }]);
};
