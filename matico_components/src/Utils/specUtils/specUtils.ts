import {
    PaneRef,
    App,
    Page,
    ContainerPane,
    Pane
} from "@maticoapp/matico_types/spec";
import _ from "lodash";

export const findPaneParents = (spec: App, paneId: string) => {
    const pages = spec.pages.filter((p: Page) =>
        p.panes.find((p: PaneRef) => p.id === paneId)
    );
    const containers = spec.panes.filter(
        (p: Pane) => p.type === "container"
    ) as Array<ContainerPane>;
    const containersWithPane = containers.filter((container: ContainerPane) =>
        container.panes.find((p: PaneRef) => p.id === paneId)
    );
    return { pages, containers: containersWithPane };
};

export const findPagesForPane = (spec: App, paneRef: PaneRef) => {
    let { pages, containers } = findPaneParents(spec, paneRef.id);
    while (containers.length > 0) {
        let consideration = containers.pop();
        let { pages: considerationPages, containers: considerationContainers } =
            findPaneParents(spec, consideration.id);
        _.extend(pages, considerationPages);
        _.extend(containers, considerationContainers);
    }

    let pageSet = Array.from(new Set(pages));
    return pageSet;
};
