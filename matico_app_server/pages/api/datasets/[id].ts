import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { userFromSession } from "../../../utils/db";
import { deleteDataset, getPresignedGetUrl } from "../../../utils/s3";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../db";
import { userHasManage } from "../../../utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const user = await userFromSession(session, prisma);
  if (!user) {
    res.status(401).json({ error: "You need to be logged in to do this" });
  }

  const dataset = await prisma.dataset.findUnique({
    where: { id: req.query.id },
  });

  if (!dataset) {
    res.status(404).json({ error: "No dataset found" });
    return;
  }

  if (req.method === "GET") {
    if (user.id !== dataset.ownerId && dataset.public === false) {
      res
        .status(401)
        .json({ error: "You are not authorizied to use this dataset" });
    }
    if (req.query.includeDataUrl) {
      const dataUrl = await getPresignedGetUrl(dataset.ownerId, dataset.id);
      res.status(200).json({ ...dataset, dataUrl });
      return;
    } else {
      res.status(200).json(dataset);
      return;
    }
  }

  if (req.method === "DELETE") {
    if (user.id !== dataset.ownerId) {
      res.status(401).json({ error: "You dont own this dataset" });
      return;
    }
    try {
      await deleteDataset(user!.id, req.query.id as string);
      await prisma.dataset.delete({ where: { id: req.query.id } });
    } catch (e) {
      res.status(500).json(dataset);
      return;
    }
  }
}
