import {
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Flex,
  Header,
} from "@adobe/react-spectrum";
import { useSession, signIn, signOut } from "next-auth/react";
import { Icon } from "../Icons/Icon";

export const Login: React.FC = () => {
  const { data: session } = useSession();

  return (
    <DialogTrigger type="popover" isDismissable>
      <ActionButton>{session ? session.user?.name : "Login"}</ActionButton>
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
                  <ActionButton onPress={() => signIn("gitlab")} isQuiet>
                    <div>
                      <Icon icon="gitlab" />
                      Gitlab
                    </div>
                  </ActionButton>
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
