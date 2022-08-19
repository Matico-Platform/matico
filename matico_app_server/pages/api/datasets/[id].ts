import {PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {unstable_getServerSession} from "next-auth";
import {userFromSession} from "../../../utils/db";
import {getPresignedGetUrl} from "../../../utils/s3";
import {authOptions} from "../auth/[...nextauth]";

export default async function handler(req:NextApiRequest, res: NextApiResponse){
  const prisma = new PrismaClient();
  const session = await unstable_getServerSession(req, res, authOptions);

  const user = await userFromSession(session, prisma);
  if(!user){res.status(401).json({error:"You need to be logged in to do this"})}

  const dataset = await prisma.dataset.findUnique({
      where:{id:req.query.id}
  })

  if(!dataset){
    res.status(404).json({error:"No dataset found"})
    return 
  }

  if(req.method==="GET"){
    if (req.query.includeDataUrl){
      const dataUrl = await getPresignedGetUrl(dataset.ownerId, dataset.id)
      res.status(200).json({...dataset,dataUrl})
      return
    }
    else{
      res.status(200).json(dataset)
      return
    }
  }
}
