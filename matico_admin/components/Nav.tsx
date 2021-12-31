import React from "react";
import { Text, Flex, View } from "@adobe/react-spectrum";
import { Link as ALink } from "@adobe/react-spectrum";
import Link from "next/link";

export const Nav: React.FC = () => {
  return (
    <Flex
      gridArea="header"
      direction="row"
      justifyContent={"left"}
      gap="size-550"
      alignItems="center"
      marginX="size-550"
    >
      <ALink>
        <Link href="/apps">Apps</Link>
      </ALink>
      <ALink>
        <Link href="/datasets">Datasets</Link>
      </ALink>
      <ALink>
        <Link href="/apis">Apis</Link>
      </ALink>
      <ALink>
        <Link href="/admin">Admin</Link>
      </ALink>
    </Flex>
  );
};
