import {
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Flex,
  Header,
  View,
} from "@adobe/react-spectrum";
import { useSession, signIn, signOut } from "next-auth/react";
import { Icon } from "../Icons/Icon";

export const Login: React.FC = () => {
  const { data: session } = useSession();

  return (
    <DialogTrigger type="popover" isDismissable>
      <View backgroundColor="static-indigo-500">
        <ActionButton
          isQuiet
          UNSAFE_style={{
            color: "black",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow:
              "6px -8px 15px -3px rgba(0,0,0,0.1),0px 10px 15px -3px rgba(0,0,0,0.1)",
          }}
        >
          {session ? session.user?.name : "Login"}
        </ActionButton>
      </View>
      <Dialog>
        <>
          <Header
            UNSAFE_style={{ textAlign: "center", fontWeight: "bold" }}
            justifySelf="center"
            marginBottom="size-100"
          >
            {session ? `Hey there ${session.user?.name}` : "Login"}
          </Header>
          <Divider />
          <Content>
            <>
              {session ? (
                <ActionButton onPress={() => signOut()}>Sign Out</ActionButton>
              ) : (
                <Flex direction="column" gap="size-100">
                  <ActionButton onPress={() => signIn("github")} isQuiet>
                    <div>
                      <Icon icon="github" />
                      Github
                    </div>
                  </ActionButton>
                  <ActionButton onPress={() => signIn("google")} isQuiet>
                    <div>
                      <Icon icon="google" />
                      Google
                    </div>
                  </ActionButton>
                  {/* <ActionButton onPress={() => signIn("gitlab")} isQuiet>
                    <div>
                      <Icon icon="gitlab" />
                      Gitlab
                    </div>
                  </ActionButton> */}
                  <ActionButton onPress={() => signIn("facebook")} isQuiet>
                    <div>
                      <Icon icon="facebook" />
                      Facebook
                    </div>
                  </ActionButton>
                </Flex>
              )}
            </>
          </Content>
        </>
      </Dialog>
    </DialogTrigger>
  );
};
