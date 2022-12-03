import { AlertDialog, DialogContainer } from "@adobe/react-spectrum";
import React from "react";
import { useState } from "react";
import { Login } from "../components/Login/Login";

export const useNotifications = () => {
  const [error, setError] = useState<null | string>(null);

  const NotificationElement = () => {
    return (
      <DialogContainer type="modal" onDismiss={() => setError(null)}>
        {!!error && (
          <AlertDialog title="Error" primaryActionLabel="Close">
            {error === "Not Logged In" && (
              <>
                You aren't logged in!
                <br />
                <br />
                <Login />
              </>
            )}
          </AlertDialog>
        )}
      </DialogContainer>
    );
  };
  const notify = (error: string) => {
    setError(error);
  };

  return {
    notify,
    NotificationElement,
  };
};
