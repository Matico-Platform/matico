import { App } from "@maticoapp/matico_types/spec";

export const updateApp = async (app: any) => {
  return fetch(`/api/apps/${app.id}`, {
    method: "PUT",
    body: JSON.stringify(app),
  }).then((r) => r.json());
};

export const createAppFromTemplate = async (template: string) => {
  return fetch(`/api/apps/`, {
    method: "POST",
    body: JSON.stringify({
      name: "My New App",
      description: "A new blank app",
      public: false,
      template,
    }),
  }).then((r) => r.json());
};
