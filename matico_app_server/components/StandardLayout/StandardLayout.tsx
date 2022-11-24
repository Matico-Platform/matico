import { Grid } from "@adobe/react-spectrum";
import { PropsWithChildren } from "react";
import { Header } from "../Header/Header";

export const StandardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Grid
      width="100%"
      minHeight={"100vh"}
      height="auto"
      areas={{
        base: ["header", "nav", "content", "footer"],
        M: ["header   header", "content      content", "footer   footer"],
        L: [
          "header header  header",
          "content    content toc",
          "footer footer  footer",
        ],
      }}
      columns={{
        M: ["size-2000", "1fr"],
        L: ["size-2000", "1fr", "size-2000"],
      }}
      rows={{
        M: ["size-1000", "auto"],
        L: ["size-1000", "auto", "size-1000"],
      }}
      gap="size-100"
    >
      <Header />
      {children}
    </Grid>
  );
};
