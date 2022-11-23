import { NextApiRequest, NextApiResponse } from "next";
import { compute } from "./list";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(compute);
}
