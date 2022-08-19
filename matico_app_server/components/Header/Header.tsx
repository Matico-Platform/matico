import { Flex, Text, View } from "@adobe/react-spectrum";
import { Login } from "../Login/Login";
export const Header: React.FC = () => {
  return (
    <View
      paddingY="size-200"
      width="100%"
      maxWidth="90vw"
      marginX="auto"
      gridArea={"header"}
      minHeight="size-500"
    >
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Text UNSAFE_style={{
          fontSize: "2em",
          fontWeight: "bold"
        }}>Matico</Text>
        <View justifySelf="flex-end">
          <Login />
        </View>
      </Flex>
    </View>
  );
};
