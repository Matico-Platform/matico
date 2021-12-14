import { DatasetService } from "./DatasetService";
import * as Comlink from 'comlink'

Comlink.expose(DatasetService,self);
