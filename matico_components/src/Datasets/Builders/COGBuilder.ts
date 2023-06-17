import React from "react";
import { COGDataset } from "./COGDataset";
import { COGDataset as COGDatasetSpec } from "@maticoapp/matico_types/spec";

export const COGBuilder = (details: COGDatasetSpec) => {
    const { name, url } = details;

    return new COGDataset(name, url, "");
};
