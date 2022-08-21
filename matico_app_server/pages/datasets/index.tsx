import {Flex} from "@adobe/react-spectrum"
import { User} from "@prisma/client";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import React from "react"
import {NewDatasetModal} from "../../components/DatasetCreation/NewDatasetModal";
import {userFromSession} from "../../utils/db";
import {prisma} from '../../db'
import {DatasetSelector} from "../../components/DatasetSelector/DatasetSelector";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  let user = null
  if(session){
   user = await userFromSession(session, prisma);
  }

  return{props: {user: JSON.parse(JSON.stringify(user))}}

} 

interface DatasetsPageProps{
  user?:User
}

const DatasetsPage : React.FC<DatasetsPageProps> = ({user})=>{

  return(
    <Flex>
      <DatasetSelector onSelectDataset={(d)=>console.log(d)}/>
      <NewDatasetModal />
    </Flex>
  )
}

export default DatasetsPage
