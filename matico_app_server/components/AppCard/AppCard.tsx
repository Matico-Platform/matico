import { Flex, View } from "@adobe/react-spectrum";
import Link from "next/link";
import Preview from "@spectrum-icons/workflow/Preview";
import EdinIn from "@spectrum-icons/workflow/EditIn";
import Branch2 from "@spectrum-icons/workflow/Branch2";
import React from "react";
import { DeleteAppDialog } from "../DeleteAppDialog/DeleteAppDialog";
export interface AppCardInterface {
  app: any;
  includeEdit: boolean;
  includeView: boolean;
  includeFork: boolean;
  includeDelete: boolean;
}

export const AppCard: React.FC<AppCardInterface> = ({
  app,
  includeFork,
  includeView = true,
  includeEdit,
  includeDelete,
}) => {
  return (
    <tr>
      <td>
        <p>
          <b>{app.name}</b>
        </p>
      </td>
      <td>
        <p>{app.owner.name} </p>
      </td>
      <td>
        <p>{app.updatedAt}</p>
      </td>
      <td>
        <Flex
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
        >
          {includeView && (
            <Link href={`/apps/${app.id}`} style={{ textDecoration: "none" }}>
              <Flex
                direction="row"
                alignItems="center"
                gap="size-100"
                UNSAFE_style={{ color: "white" }}
              >
                <Preview size="S" />
                <p>View</p>
              </Flex>
            </Link>
          )}
          {includeFork && (
            <Link href={`/apps/${app.id}`} style={{ textDecoration: "none" }} >
              <Flex
                direction="row"
                alignItems="center"
                gap="size-100"
                UNSAFE_style={{ color: "white" }}
              >
                <Branch2 size="S" />
                <p>Fork</p>
              </Flex>
            </Link>
          )}
          {includeEdit && (
            <Link href={`/apps/edit/${app.id}`} style={{ textDecoration: "none" }}>
              <Flex
                direction="row"
                alignItems="center"
                gap="size-100"
                UNSAFE_style={{ color: "white" }}
              >
                <EdinIn size="S" />
                <p>Edit</p>
              </Flex>
            </Link>
          )}
          {includeDelete && <DeleteAppDialog appId={app.id} />}
        </Flex>
      </td>
    </tr>
  );
};
