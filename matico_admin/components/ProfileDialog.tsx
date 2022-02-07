import {
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
  Flex,
  Link as ALink,
} from "@adobe/react-spectrum";
import React, { useState } from "react";
import Link from "next/link";
import {useUser} from "../hooks/useUser";

export interface ProfileDialogProps {
  username: string;
  popover?: boolean;
  onLogout: () => void;
}

export const ProfileDiaglog: React.FC<ProfileDialogProps> = ({
  username,
  popover,
  onLogout,
}) => {
  const {user, logout} = useUser()
  const [isOpen, setIsOpen] = useState(false);

  const tryLogout = ()=>{
    logout()
    setIsOpen(false)
  }

  return (
    <DialogTrigger type={popover ? "popover" : "modal"} isOpen={isOpen}>
      <ActionButton onPress={() => setIsOpen(!isOpen)}>{username}</ActionButton>
      <Dialog>
        <Content>
          <Flex direction="column" alignItems="center">
            <ALink>
              <Link href="/profile">Profile</Link>
            </ALink>
            <ActionButton onPress={tryLogout}>Logout</ActionButton>
          </Flex>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
};
