import { Flex, View } from "@adobe/react-spectrum";
import Link from "next/link";
import Preview from "@spectrum-icons/workflow/Preview";
import EdinIn from "@spectrum-icons/workflow/EditIn";
import Branch2 from "@spectrum-icons/workflow/Branch2";
import React from "react";
import {DeleteAppDialog} from "../DeleteAppDialog/DeleteAppDialog";
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
  includeDelete
}) => {
  return (
    <tr>
      <td>
        <p><b>{app.name}</b></p>
      </td>
      <td>
        <p>{app.owner.name} </p>
      </td>
      <td>
        <p>{app.updatedAt}</p>
      </td>
      <td>
        <Flex direction={"row"} justifyContent="space-between">
          {includeView && (
            <Link href={`/apps/${app.id}`}>
              <a>
                <Flex direction="row" alignItems="center" gap="size-100" UNSAFE_style={{color:'white'}}>
                  <Preview />
                  <p>View</p>
                </Flex>
              </a>
            </Link>
          )}
          {includeFork && (
            <Link href={`/apps/${app.id}`}>
              <a>
                <Flex direction="row" alignItems="center" gap="size-100" UNSAFE_style={{color:'white'}}>
                  <Branch2 />
                  <p>Fork</p>
                </Flex>
              </a>
            </Link>
          )}
          {includeEdit && (
            <Link href={`/apps/edit/${app.id}`}>
              <a>
                <Flex direction="row" alignItems="center" gap="size-100" UNSAFE_style={{color:'white'}}>
                  <EdinIn />
                  <p>edit</p>
                </Flex>
              </a>
            </Link>
          )}
          {includeDelete && (
            <DeleteAppDialog appId={app.id}/>
          )}
        </Flex>
      </td>
    </tr>
  );
};
