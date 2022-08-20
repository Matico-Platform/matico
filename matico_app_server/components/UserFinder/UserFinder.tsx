import { User } from "@prisma/client";
import { useSearchUsers } from "../../hooks/useUsers";
import { ActionButton, ComboBox, Flex, Item } from "@adobe/react-spectrum";
import { useState } from "react";

export interface UserFinderInterface {
  onSelect: (user: User) => void;
}
export const UserFinder: React.FC<UserFinderInterface> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  let { users } = useSearchUsers(searchTerm);
  return (
    <Flex direction="column" gap="size-200">
      <ComboBox
        label="Collaborator To Add"
        items={users ?? []}
        inputValue={searchTerm}
        onInputChange={setSearchTerm}
        onSelectionChange={(id) =>setSelectedUserId(id as string)}
        selectedKey={selectedUserId}
        menuTrigger="focus"
        
      >
        {(item: User) => <Item key={item.id}>{item.name} </Item>}
      </ComboBox>
      <ActionButton
        isDisabled={!selectedUserId}
        onPress={(key) =>
          onSelect(users.find((u: User) => u.id === selectedUserId))
        }
      >
        Add Collaborator
      </ActionButton>
    </Flex>
  );
};
