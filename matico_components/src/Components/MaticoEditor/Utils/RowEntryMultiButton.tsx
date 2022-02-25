import React from "react";
import { Content, Flex, ActionButton, DialogTrigger, Dialog, Heading, View, Button } from "@adobe/react-spectrum"
import Edit from "@spectrum-icons/workflow/Edit";
import ChevronUp from "@spectrum-icons/workflow/ChevronUp";
import ChevronDown from "@spectrum-icons/workflow/ChevronDown";
import Delete from "@spectrum-icons/workflow/Delete";
import Copy from "@spectrum-icons/workflow/Copy";

interface RowEntryMultiButtonProps {
    entryName: string | React.ReactNode,
    index: number,
    setEdit: (index: number) => void,
    changeOrder?: (index: number, direction: "up" | "down") => void,
    deleteEntry?: (index: number) => void,
    duplicateEntry?: (index: number) => void,
}

export const RowEntryMultiButton: React.FC<RowEntryMultiButtonProps> = ({ // TODO: arial labels
    index,
    entryName,
    setEdit,
    changeOrder,
    deleteEntry,
    duplicateEntry
})=> <Flex direction="row" gap="size-100" marginBottom="size-200">
      <ActionButton onPress={()=>setEdit(index)} width="50%">{entryName}</ActionButton>
      <ActionButton onPress={()=>setEdit(index)} flex><Edit/></ActionButton>
      {duplicateEntry !== undefined && <ActionButton onPress={()=>duplicateEntry(index)} flex><Copy/> </ActionButton>}
      {changeOrder !== undefined && <ActionButton onPress={()=>changeOrder(index, 'up')} flex><ChevronUp/> </ActionButton>}
      {changeOrder !== undefined && <ActionButton onPress={()=>changeOrder(index, 'down')} flex><ChevronDown/></ActionButton>}
      {deleteEntry !== undefined && <View flex>
            <DialogTrigger 
                isDismissable 
                type="popover"
                mobileType="tray"
                containerPadding={1}
                >
                    <ActionButton><Delete/></ActionButton>
                    {(close) => (
                        <Dialog>
                            <Heading>Gone, forever?</Heading>
                            <Content marginTop="size-100">
                                <Button 
                                variant="negative"
                                onPress={()=>{
                                    deleteEntry(index);
                                    close();
                                }}><Delete/> Delete</Button>
                            </Content>
                        </Dialog>
                    )}
            </DialogTrigger>
        </View>}
      
      
      
    </Flex>