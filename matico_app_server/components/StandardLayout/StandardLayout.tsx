import { Grid } from "@adobe/react-spectrum";
import { PropsWithChildren } from "react";
import {Header} from "../Header/Header";

export const StandardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Grid
      flex={1}
      width="100vw"
      areas={{
        base: ["header", "nav", "content", "footer"],
        M: [
          "header   header",
          "nav      content",
          "footer   footer",
        ],
        L: [
          "header header  header",
          "nav    content toc",
          "footer footer  footer",
        ],
      }}
      columns={{
        M: ["size-2000", "1fr"],
        L: ["size-2000", "1fr", "size-2000"],
      }}
      rows={{
        M: ["size-300", "auto" ],
        L: ["size-300", "auto",  "size-1000"]
      }}
      gap="size-100"
    >
      <Header />
      {children}
    </Grid>
  );
};
