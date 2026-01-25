import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// Start the worker in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  worker.start({
    onUnhandledRequest: "bypass",
  });
}
