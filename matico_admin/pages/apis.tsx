import type { NextPage } from "next";
import { Layout } from "../components/Layout";
import { Divider, View } from "@adobe/react-spectrum";
import { GetServerSideProps } from "next";
import { useAPIs} from "../hooks/useAPIs";
import { Link as ALink } from "@adobe/react-spectrum";
import Link from "next/link";

import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";


const Home: NextPage = ({}) => {

  const { data: apis, error } = useAPIs();
  console.log("apis ", apis, error )

  return (
    <Layout>
      <View backgroundColor="blue-600" gridArea="sidebar" />
      <View gridArea="content">
        <h3>APIs</h3>
        <Divider size="S" />
        {apis && (
          <TableView
            aria-label="List of APIS"
            selectionMode="multiple"
            marginY="size-40"
          >
            <TableHeader>
              <Column>Name</Column>
              <Column>Access</Column>
            </TableHeader>
            <TableBody>
              {apis.map((api: any, index :number) => (
                <Row key={index}>
                  <Cell>
                    <ALink>
                      <Link href={`/apis/${api.id}`} >{api.name}</Link>
                    </ALink>
                  </Cell>
                  <Cell>{api.public ? "Public" : "Private"}</Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        )}
      </View>
    </Layout>
  );
};

export default Home;
