import { PrismaClient } from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import { unstable_getServerSession } from "next-auth";
import { userFromSession } from "../../../../utils/db";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const prisma = new PrismaClient();
  const session = await unstable_getServerSession(req, res, authOptions);
  let appId= req.query.id;
  let user = await userFromSession(session, prisma);
  let app = prisma.app.findUnique({
    where: { id: appId },
    include: {owner:true, collaborators:true} 
  });

  if(req.method==="GET"){
    res.status(200).json(app.collaborators)
  }
}
