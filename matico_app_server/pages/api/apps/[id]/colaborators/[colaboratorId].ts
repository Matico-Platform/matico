import {App, Colaborator, PrismaClient } from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import { unstable_getServerSession, User } from "next-auth";
import { setAppAccess, userFromSession, userHasManage } from "../../../../../utils/db"
import {authOptions} from "../../../auth/[...nextauth]";

export default async function handler(req :NextApiRequest, res: NextApiResponse) {
  
  const prisma = new PrismaClient();
  const session = await unstable_getServerSession(req, res, authOptions);
  let user = await userFromSession(session, prisma);

  let appId  = req.query.id

  if(!user){ res.status(401).json({"error":"You need to be logged in to do this"}) }


  let app  = await prisma.app.findUnique({
    where: { id : appId },
    include: {owner:true, colaborators:{
      include:{
        user: {
          select: {name:true}
        }
      }
    }} 
  });

  if(!app){ res.status(404).json({"error":"Failed to find app"}) }

  if (!userHasManage(app, user)) {
    res.status(401).json({error:"You dont have permision to manage this app"})
  }

  if(req.method==="DELETE"){
    let id = req.query.id
    let result = await prisma.colaborator.delete({where:{id:req.query.colaboratorId}})
    res.status(202).json(result)
  }
}
