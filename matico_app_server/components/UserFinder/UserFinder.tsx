import { User } from "@prisma/client";
import { useSearchUsers } from "../../hooks/useUsers";
import { ActionButton, Flex, Text, TextField } from "@adobe/react-spectrum";
import React, { useState } from "react";

export interface UserFinderInterface {
  onSelect: (user: User) => void;
  label?: string;
  excludeList?: Array<string>;
}
export const UserFinder: React.FC<UserFinderInterface> = ({
  onSelect,
  label,
  excludeList = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  let { users } = useSearchUsers(searchTerm);
  const validUsers = users
    ? users.filter((user: User) => !excludeList.includes(user.id))
    : [];

  return (
    <Flex direction="column" gap="size-200">
      <TextField
        label={label ?? "Search for user"}
        value={searchTerm}
        onChange={setSearchTerm}
        width="100%"
      />
      <Flex direction="column">
        {validUsers &&
          validUsers.map((user: User) => (
            <ActionButton key={user.id} onPress={() => onSelect(user)}>
              <Flex direction="row" gap="size-200">
                <img src={user.image} width="20px" height="20px" />
                <Text>{user.name}</Text>
              </Flex>
            </ActionButton>
          ))}
        {validUsers.length === 0 && searchTerm.length > 0 && (
          <Text>No users found</Text>
        )}
      </Flex>
    </Flex>
  );
};
