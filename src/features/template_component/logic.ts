import type { Services } from "../../services/types";
import type { Storage } from "../../storage/types";
import { Logic } from "../../utils/logic";
import { executeTask, type TaskState } from "../../utils/tasks";

export interface TemplateComponentDependencies {
  services?: Services;
  storage?: Storage;
  getRootElement?: () => HTMLElement;
}

export type TemplateComponentState = {
  loadState: TaskState;
};

export class TemplateComponentLogic extends Logic<
  TemplateComponentDependencies,
  TemplateComponentState
> {
  getInitialState = (): TemplateComponentState => ({
    loadState: "pristine",
  });

  async initialize() {
    await executeTask(this, "loadState", async () => {});
  }
}
