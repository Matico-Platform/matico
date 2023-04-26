import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { userFromSession, userHasManage } from "../../../../../utils/db"
import { authOptions } from "../../../auth/[...nextauth]";
import { prisma } from '../../../../../db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const session = await unstable_getServerSession(req, res, authOptions);
  let user = await userFromSession(session, prisma);

  let appId = req.query.id

  let app = await prisma.app.findUnique({
    where: { id: appId as string },
    include: {
      owner: true, collaborators: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    }
  });

  if (!app) { res.status(404).json({ "error": "Failed to find app" }) }

  if (!userHasManage(app, user)) {
    res.status(401).json({ error: "You dont have permission to manage this app" })
  }

  if (req.method === "DELETE") {
    let id = req.query.id
    let result = await prisma.collaborator.delete({ where: { id: req.query.collaboratorId } })
    res.status(202).json(result)
  }
}
