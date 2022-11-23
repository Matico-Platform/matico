import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { userFromSession } from "../../../utils/db";
import { getPresignedGetUrl } from "../../../utils/s3";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../db";
import { QueryBuilder } from "../../../utils/queryBuilder";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const user = await userFromSession(session, prisma);
  if (!user) {
    res.status(401).json({ error: "You need to be logged in to do this" });
  }

  const queryBuilder = new QueryBuilder("Dataset");
  queryBuilder.fromParams(req.query);

  const datasets = await queryBuilder.runQueryMany();

  if (req.method === "GET") {
    return res.status(200).json(datasets);
  }
}
