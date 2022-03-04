import React, { useState } from "react";
import {
  Flex,
  View,
  TextField,
  Text,
  Well,
  Heading,
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
} from "@adobe/react-spectrum";
import { RowEntryMultiButton } from "../Utils/RowEntryMultiButton";
import {
  setCurrentEditPath,
  setSpecAtPath,
  addPage,
} from "Stores/MaticoSpecSlice";
import { useMaticoSelector, useMaticoDispatch } from "Hooks/redux";
import { PaneDefaults } from "../PaneDefaults";

interface AddPageModalProps {
  onAddPage: (pageName: string) => void;
  validatePageName?: (pageName: string) => boolean;
}

const AddPageModal: React.FC<AddPageModalProps> = ({
  onAddPage,
  validatePageName,
}) => {
  const [newPageName, setNewPageName] = useState("New Page");
  const [errorText, setErrorText] = useState<string | null>(null);

  const attemptToAddPage = (pageName: string, close: () => void) => {
    if (newPageName.length === 0) {
      setErrorText("Please provide a name");
    }
    if (validatePageName) {
      if (validatePageName(pageName)) {
        onAddPage(pageName);
        close();
      } else {
        setErrorText(
          "Another page with the same name exists, pick something else"
        );
      }
    } else {
      onAddPage(newPageName);
    }
  };

  return (
    <DialogTrigger type="popover" isDismissable>
      <ActionButton isQuiet>Add</ActionButton>
      {(close: any) => (
        <Dialog>
          <Heading>Select pane to add</Heading>
          <Content>
            <Flex direction="column" gap="size-150">
              <TextField
                label="New pane name"
                value={newPageName}
                onChange={setNewPageName}
                errorMessage={errorText}
                width="100%"
              />
              <ActionButton
                onPress={() => {
                  attemptToAddPage(newPageName, close);
                }}
              >
                Add Page
              </ActionButton>
            </Flex>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  );
};

interface AppEditorProps {}

export const AppEditor: React.FC<AppEditorProps> = () => {
  const spec = useMaticoSelector((state) => state.spec.spec);
  const dispatch = useMaticoDispatch();
  const [confirmDelete, setConfirmDelete] = useState(false);

  console.log("Spec is ", spec);

  const app = spec;
  const pages = app.pages;
  const editPath = "";

  const addNewPage = (pageName: string) => {
    const firstPage = pages.length === 0;
    const pageNo = firstPage ? 0 : Math.max(...pages.map((p) => p.order)) + 1;

    dispatch(
      addPage({
        //@ts-ignore
        page: {
          name: pageName,
          content: ``,
          path: "/" + pageName.split(" ").join("_"),
          icon: firstPage ? "Home" : "Page",
          //@ts-ignore
          order: pageNo,
          sections: [],
        },
      })
    );
  };

  //const duplicatePage = (index: number) => {
  //  let [[pageType, props]] = Object.entries(pages[index]);
  //  dispatch(
  //    addPage({
  //      page:
  //        //@ts-ignore
  //        { ...props, name: `${props.name}_copy`, path: `${props.path}_copy` },
  //    })
  //  );
  //};

  const deletePage = (index: number) => {
    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          pages: [...pages.slice(0, index), ...pages.slice(index + 1)],
        },
      })
    );
  };

  const editPage = (index: number) => {
    const paneType = "Page";
    dispatch(
      setCurrentEditPath({
        editPath: `pages.${index}`,
        editType: paneType,
      })
    );
  };

  const changePageOrder = (index: number, direction: "up" | "down") => {
    if (
      (index === 0 && direction === "up") ||
      (index === pages.length - 1 && direction === "down")
    ) {
      return;
    }

    let pagesCopy = [...pages];
    const changedPage = pagesCopy.splice(index, 1)[0];
    pagesCopy.splice(
      direction === "up" ? index - 1 : index + 1,
      0,
      changedPage
    );

    dispatch(
      setSpecAtPath({
        editPath,
        update: {
          pages: pagesCopy,
        },
      })
    );
  };

  const validatePageName = (name: string) => {
    if (pages.find((f) => f.name === name)) {
      return false;
    }
    return true;
  };

  return (
    <Flex direction="column">
      <Well>
        <Heading>
          <Flex direction="row" justifyContent="space-between" alignItems="end">
            <Text>Pages</Text>
            <AddPageModal
              validatePageName={validatePageName}
              onAddPage={addNewPage}
            />
          </Flex>
        </Heading>
        <Flex marginBottom={"size-200"} direction="column">
          {pages.map((page, index) => (
            <RowEntryMultiButton
              key={index}
              index={index}
              entryName={page.name}
              setEdit={editPage}
              changeOrder={changePageOrder}
              deleteEntry={deletePage}
            />
          ))}
        </Flex>
      </Well>
    </Flex>
  );
};
