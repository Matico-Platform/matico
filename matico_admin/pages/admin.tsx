import type { NextPage } from 'next'
import {Layout} from '../components/Layout'
import {View} from "@adobe/react-spectrum"

const Admin: NextPage = () => {
  return (
    <Layout>
      <View backgroundColor="blue-600" gridArea="sidebar" />
      <View backgroundColor="purple-600" gridArea="content" />
      <View backgroundColor="magenta-600" gridArea="footer" />
    </Layout>
  )
}

export default Admin 
