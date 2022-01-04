import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import { View } from "@adobe/react-spectrum";
import dynamic from 'next/dynamic'

const Editor: NextPage = () => {
  const spec={
      name: "New Dashboard",
      created_at: new Date(),
      pages: [],
      datasets: [],
  }
  const MaticoApp = dynamic(()=>(import("@maticoapp/matico_components") as any).then( (matico:any)  => matico.MaticoApp), {ssr:false}) 

  return (
    <Layout>
      <View backgroundColor="blue-600" gridArea="sidebar" />
      <View backgroundColor="purple-600" gridArea="content">
        <MaticoApp 
          //@ts-ignore
          spec={spec}
          //@ts-ignore
          editActive={true}
          />
      </View>
      <View backgroundColor="magenta-600" gridArea="footer" />
    </Layout>
  );
};

export default Editor;