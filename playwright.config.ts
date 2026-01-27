import { defineConfig, devices } from "@playwright/test";

const defaultPort = process.env.PLAYWRIGHT_PORT || "3001";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${defaultPort}`;
const shouldStartWebServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  webServer: shouldStartWebServer
    ? {
        command: `npm run dev -- -p ${defaultPort}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
