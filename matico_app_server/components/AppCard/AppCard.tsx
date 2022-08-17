import { Flex } from "@adobe/react-spectrum";
import Link from "next/link";

export interface AppCardInterface {
  app: any;
  includeEdit: boolean;
  includeView: boolean;
  includeFork: boolean;
}

export const AppCard: React.FC<AppCardInterface> = ({
  app,
  includeFork,
  includeView= true,
  includeEdit,
}) => {
  return (
    <section style={{maxWidth:"150px"}}>
      <h2>{app.name}</h2>
      <p>{app.owner.name} </p>
      <p>{app.updatedAt}</p>
      <Flex direction={"row"} justifyContent="space-between">
        {includeView && (
          <Link href={`/apps/${app.id}`}>
            <a>View</a>
          </Link>
        )}
        {includeFork && (
          <Link href={`/apps/${app.id}`}>
            <a>Fork</a>
          </Link>
        )}
        {includeEdit &&
          <Link href={`/apps/edit/${app.id}`}>
            <a>edit</a>
          </Link>
        }
      </Flex>
    </section>
  );
};
