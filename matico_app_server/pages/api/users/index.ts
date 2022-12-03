import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let query: any = {
      where: {},
      select: { name: true, id: true, createdAt: true, image: true },
    };
    if (req.query.hasOwnProperty("take")) {
      query.take = parseInt(req.query.take as string);
    }
    if (req.query.hasOwnProperty("search")) {
      query.where.name = { search: req.query.search };
    }

    let users = await prisma.user.findMany(query);
    res.status(200).json(users);
  }
}
