import {prisma} from "../../../db";
import {NextApiRequest, NextApiResponse} from "next";
import { unstable_getServerSession } from "next-auth";
import { userFromSession, userHasView } from "../../../utils/db";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await userFromSession(session, prisma);

  const appId: string = req.query.id;

  if (req.method === "GET") {
    const app = await prisma.app.findUnique({
      where: {
        id: appId,
      },
      include: { owner: true, _count: { select: { collaborators: true } } },
    });

    if (!app) {
      return res.status(404).json({ error: "Failed to find app" });
    }
    if (userHasView(app, user)) {
      return res.status(200).json(app);
    }

    return res.status(200).json(app);
  }

  if (req.method === "PUT") {
    let query = {};
    let where: any = { public: true };

    const appUpdate = JSON.parse(req.body);
    try {
      const updatedApp = await prisma.app.update({
        data: {
          ...appUpdate,
          updatedAt: new Date(),
        },
        where: {
          id: appId,
        },
        include: {
          owner:true,
          _count:{select:{collaborators: true}},
        },
      });

      res.status(200).json(updatedApp);
      return;
    } catch (e: any) {
      res.status(500).json({ error: `Could not update app ${e.message}` });
      return;
    }
  }

  if (req.method === "DELETE") {
    try {
      const deletedApp = await prisma.app.delete({
        where: {
          id: appId,
        },
      });
      res.status(200).json(deletedApp);
      return;
    } catch (e: any) {
      res.status(500).json({ error: `Failed to delete app ${e.message}` });
      return;
    }
  }
}
