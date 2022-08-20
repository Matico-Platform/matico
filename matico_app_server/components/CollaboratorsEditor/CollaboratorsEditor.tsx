import {
  ActionButton,
  Divider,
  Flex,
  Switch,
  Text,
  TextField,
} from "@adobe/react-spectrum";
import { App, Collaborator, User } from "@prisma/client";
import { useCollaborators } from "../../hooks/useCollaborators";
import { UserFinder } from "../UserFinder/UserFinder";
import Delete from "@spectrum-icons/workflow/Delete";

export interface CollaboratorsEditorProps {
  app: App & { Collaborators: Collaborator[] };
}
export const CollaboratorsEditor: React.FC<CollaboratorsEditorProps> = ({
  app,
}) => {
  const {
    Collaborators,
    mutate,
    error,
    addOrUpdateCollaborator,
    removeCollaborator,
  } = useCollaborators(app.id);

  const updateCollaborator = (userId: string, permisions: any) => {
    addOrUpdateCollaborator(userId, permisions);
  };

  return (
    <Flex direction="column" gap={"size-200"}>
      {Collaborators &&
        Collaborators.map((collaborator:Collaborator) => (
          <Flex
            key={collaborator.id}
            alignItems="center"
            direction={"row"}
            gap="size-200"
          >
            <Text>{collaborator.user.name}</Text>
            <Flex direction="row">
              <Switch
                isEmphasized 
                isSelected={collaborator.view}
                onChange={(view) =>
                  updateCollaborator(collaborator.userId, {
                    view,
                    edit: collaborator.edit,
                    manage:collaborator.manage
                  })
                }
              >
                View
              </Switch>
              <Switch
                isEmphasized
                isSelected={collaborator.edit}
                onChange={(edit) =>
                  updateCollaborator(collaborator.userId, {
                    view: collaborator.view,
                    edit,
                    manage: collaborator.manage
                  })
                }
              >
                Edit
              </Switch>
              <Switch
                isEmphasized
                isSelected={collaborator.manage}
                onChange={(manage) =>
                  updateCollaborator(collaborator.userId, {
                    view: collaborator.view,
                    edit: collaborator.edit,
                    manage,
                  })
                }
              >
                Manage
              </Switch>
              <ActionButton onPress={()=>removeCollaborator(collaborator.id)} isQuiet>
                <Delete />
              </ActionButton>
            </Flex>
          </Flex>
        ))}
      <Divider size="S" />
      <UserFinder onSelect={(user) => addOrUpdateCollaborator(user.id)} />
    </Flex>
  );
};
