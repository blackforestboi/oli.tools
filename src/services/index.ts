import type { Storage } from "../storage/types";
import { ThemeService } from "./theme";
import { CacheService } from "./cache";
import { EventEmitter } from "../utils/events";
import type { Services } from "./types";

// @ts-ignore
export function createServices(options: { storage: Storage }): Services {
  const events = new EventEmitter();
  const services: Services = {
    events,
    cache: new CacheService(),
    theme: new ThemeService({
      getPersistedThemeVariant: async () => "light",
      setPersistedThemeVariant: async () => {},
      removePersistedThemeVariant: async () => {},
    }),
  };

  return services;
}
