import {
  DialogTrigger,
  ActionButton,
  Dialog,
  Heading,
  Divider,
  Content,
  Form,
  TextField,
  TextArea,
  ButtonGroup,
  Button,
  Switch,
  TabList,
  Item,
  TabPanels,
  Tabs,
  Text,
} from "@adobe/react-spectrum";
import { Key, useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";

interface LoginSignupDialogProps {
  popover?: boolean;
}

export const LoginSignupDialog: React.FC<LoginSignupDialogProps> = ({
  popover,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTab, setSelectedTab] = useState<Key>("login");
  const [isOpen, setIsOpen] = useState(false);
  const { user, login, signup, loginError, signupError } = useUser();

  const tryLogin = () => {
    login(email, password);
  };

  const trySignup = () => {
    signup(name, password, email);
  };

  useEffect(() => {
    if (user) {
      setIsOpen(false);
    }
  }, [user]);

  return (
    <DialogTrigger type={popover ? "popover" : "modal"} isOpen={isOpen}>
      {popover ? (
        <ActionButton onPress={() => setIsOpen(true)}>
          Login / Signup
        </ActionButton>
      ) : (
        <Button onPress={() => setIsOpen(true)} variant={"cta"}>
          Login / SignUp
        </Button>
      )}
      <Dialog>
        <Content>
          <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
            <TabList>
              <Item key="login">Login</Item>
              <Item key="signup">Signup</Item>
            </TabList>
            <TabPanels>
              <Item key="login">
                <Form>
                  <TextField
                    label="email"
                    placeholder="someone@somedomain.com"
                    value={email}
                    onChange={setEmail}
                  />
                  <TextField
                    type="password"
                    label="Password"
                    placeholder="Very Secure Password"
                    value={password}
                    onChange={setPassword}
                  />
                </Form>
                {loginError && <Text>{loginError}</Text>}
              </Item>
              <Item key="signup">
                <Form>
                  <TextField
                    label="username"
                    placeholder="Your name"
                    value={name}
                    onChange={setName}
                  />
                  <TextField
                    label="email"
                    placeholder="someone@somedomain.com"
                    value={email}
                    onChange={setEmail}
                  />
                  <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Very Secure Password"
                  />
                </Form>
                {signupError && <Text>{signupError}</Text>}
              </Item>
            </TabPanels>
          </Tabs>
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="cta"
            onPress={() => (selectedTab === "login" ? tryLogin() : trySignup())}
          >
            {selectedTab === "login" ? "Login" : "Sign Up"}
          </Button>
        </ButtonGroup>
      </Dialog>
    </DialogTrigger>
  );
};
