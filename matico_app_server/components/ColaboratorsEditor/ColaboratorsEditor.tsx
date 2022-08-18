import {
  ActionButton,
  Divider,
  Flex,
  Switch,
  Text,
  TextField,
} from "@adobe/react-spectrum";
import { App, Colaborator, User } from "@prisma/client";
import { useColaborators } from "../../hooks/useColaborators";
import { UserFinder } from "../UserFinder/UserFinder";
import Delete from "@spectrum-icons/workflow/Delete";

export interface ColaboratorsEditorProps {
  app: App & { colaborators: Colaborator[] };
}
export const ColaboratorsEditor: React.FC<ColaboratorsEditorProps> = ({
  app,
}) => {
  const {
    colaborators,
    mutate,
    error,
    addOrUpdateColaborator,
    removeColaborator,
  } = useColaborators(app.id);

  const updateColaborator = (userId: string, permisions: any) => {
    addOrUpdateColaborator(userId, permisions);
  };

  return (
    <Flex direction="column" gap={"size-200"}>
      {colaborators &&
        colaborators.map((colaborator:Colaborator) => (
          <Flex
            key={colaborator.id}
            alignItems="center"
            direction={"row"}
            gap="size-200"
          >
            <Text>{colaborator.user.name}</Text>
            <Flex direction="row">
              <Switch
                isEmphasized 
                isSelected={colaborator.view}
                onChange={(view) =>
                  updateColaborator(colaborator.userId, {
                    view,
                    edit: colaborator.edit,
                    manage:colaborator.manage
                  })
                }
              >
                View
              </Switch>
              <Switch
                isEmphasized
                isSelected={colaborator.edit}
                onChange={(edit) =>
                  updateColaborator(colaborator.userId, {
                    view: colaborator.view,
                    edit,
                    manage: colaborator.manage
                  })
                }
              >
                Edit
              </Switch>
              <Switch
                isEmphasized
                isSelected={colaborator.manage}
                onChange={(manage) =>
                  updateColaborator(colaborator.userId, {
                    view: colaborator.view,
                    edit: colaborator.edit,
                    manage,
                  })
                }
              >
                Manage
              </Switch>
              <ActionButton onPress={()=>removeColaborator(colaborator.id)} isQuiet>
                <Delete />
              </ActionButton>
            </Flex>
          </Flex>
        ))}
      <Divider size="S" />
      <UserFinder onSelect={(user) => addOrUpdateColaborator(user.id)} />
    </Flex>
  );
};
