import type { Dataset } from "./Dataset";
import type { Metadata } from "./Metadata";
import type { Page } from "./Page";
import type { Pane } from "./Pane";
import type { Theme } from "./Theme";

export interface App { pages: Array<Page>, panes: Array<Pane>, datasets: Array<Dataset>, theme: Theme | null, metadata: Metadata, }