import { App } from "@maticoapp/types/spec";

export const Blank: App = {
  pages: [],
  datasets: [],
  datasetTransforms: [],
  panes: [],
  metadata: {
    name: "A cool app!",
    description: "Make anything you want",
    id: "test_app",
    createdAt: new Date(),
  },
};
