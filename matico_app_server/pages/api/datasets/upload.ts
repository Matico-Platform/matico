import {PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {unstable_getServerSession} from "next-auth";
import {userFromSession} from "../../../utils/db";
import {getPresignedUploadUrl} from "../../../utils/s3";
import {authOptions} from "../auth/[...nextauth]";

export default async function handler(req:NextApiRequest, res: NextApiResponse){
  const prisma = new PrismaClient();
  const session = await unstable_getServerSession(req, res, authOptions);

  const user = await userFromSession(session, prisma);
  if(!user){res.status(401).json({error:"You need to be logged in to do this"})}

  if(req.method==="POST"){
    const params = JSON.parse(req.body)
    
    const dataset = await prisma.dataset.create({
      data:{
        owner:{connect:{id: user!.id}},
        name: params.name,
        description: params.description,
        public : params.public,
        path:""
      }
    })
    res.status(200).json(await getPresignedUploadUrl(user!.id, dataset.id))
  }
}
