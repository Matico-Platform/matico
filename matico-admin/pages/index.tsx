import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  const MaticoApp = dynamic(
    () =>
      (import("@maticoapp/matico_components") as any).then((c:any) => c.MaticoApp),
    { ssr: false }
  );

  return (
    <div className={styles.container}>
      <MaticoApp />
    </div>
  );
};

export default Home;
