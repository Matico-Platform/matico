import { prisma } from "../../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { Templates } from "../../../templates";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { userFromSession, userHasFork, userHasView } from "../../../utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const user = await userFromSession(session, prisma);

  if (req.method === "GET") {
    const query = req.query;

    let findQuery: Record<string, any> = {
      where: {},
      orderBy: {},
      include: {
        owner: true,
        collaborators:
          query.includeCollaborators && query.includeCollaborators === "true",
      },
    };

    if (query.hasOwnProperty("public")) {
      findQuery.where.public = query.public === "true";
    }

    if (query.hasOwnProperty("search")) {
      findQuery.where.name = { search: query.search };
    }

    if (query.hasOwnProperty("ownerId")) {
      findQuery.where.ownerId = query.ownerId;
    }

    if (query.hasOwnProperty("order")) {
      findQuery.orderBy[query.order as string] = query.orderDir
        ? query.orderDir
        : "desc";
    }

    if (query.hasOwnProperty("skip")) {
      findQuery.skip = query.skip;
    }

    if (query.hasOwnProperty("take")) {
      findQuery.take = query.take;
    }

    let apps = await prisma.app.findMany(findQuery);
    apps = apps.filter((a) => userHasView(a, user));

    res.status(200).json(apps);
  }

  if (req.method === "POST") {
    if (!session) {
      res.status(401).json({ error: "Not Logged In" });
      return;
    }

    if (!user) {
      res.status(401).json({ error: "Failed to find User" });
      return;
    }

    const appDetails = JSON.parse(req.body);

    if (!Object.keys(Templates).includes(appDetails?.template)) {
      res.status(401).json({ error: "Unknown template type" });
      return;
    }

    let data;
    // If we specify a template create a new app from that
    if (appDetails.template) {
      const template = Templates[appDetails.template];
      data = {
        name: appDetails.name as string,
        description: appDetails.description as string,
        public: appDetails.public as boolean,
        spec: {
          ...template,
          metadata: {
            ...template.metadata,
            name: appDetails.name,
            description: appDetails.description,
          },
        },
      };
    }

    // If we specify a forkId fork that app if we have permision
    // to do so
    if (appDetails.forkId) {
      const otherApp = await prisma.app.findUnique({
        where: { id: appDetails.forkId },
        include: { owner: true, collaborators: true },
      });

      if (!otherApp) {
        res.status(404).json({ error: "Failed to find app to fork" });
      }

      if (!userHasFork(otherApp!, user)) {
        res
          .status(403)
          .json({ error: "You dont have permision to fork that app" });
      }

      await prisma.app.update({
        where: { id: otherApp.id },
        data: { noForks: { increment: 1 } },
      });

      data = {
        name: otherApp!.name as string,
        description: otherApp!.description as string,
        public: false,
        spec: otherApp!.spec,
      };
    }

    // If we specify a forkId fork that app if we have permision
    // to do so
    if (appDetails.spec) {
      data = {
        name: appDetails.spec.name as string,
        description: appDetails.spec.description as string,
        public: appDetails.public as boolean,
        spec: appDetails.spec,
      };
    }

    // if passed a manual spec to build off of
    if (appDetails.manualSpec) {
      data = {
        name: appDetails.name as string,
        description: appDetails.description as string,
        public: appDetails.public as boolean,
        spec: appDetails.manualSpec,
      };
    }

    if (user) {
      data = { ...data, owner: { connect: { id: user.id } } };
    }
    console.log("Creating new app  with data ", data);

    let newApp = await prisma.app.create({
      data,
    });

    if (!newApp) {
      res
        .status(500)
        .json({ error: "Failed to create new app for some reasion" });
    }
    res.status(200).json(newApp);
  }
}
