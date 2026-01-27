import { test, expect, type APIRequestContext } from "@playwright/test";

const requireSeededDb = async (request: APIRequestContext) => {
  const resp = await request.get("/api/shows?limit=1&page=1");
  if (!resp.ok()) {
    test.skip(true, `API not reachable (status ${resp.status()}). Set MONGODB_URI/MONGODB_DB and seed Mongo.`);
  }
  const data = (await resp.json()) as { shows?: unknown[]; total?: number };
  if (!data || !Array.isArray(data.shows) || (data.total ?? 0) < 1) {
    test.skip(true, "No shows found. Run `npm run seed` before running E2E tests.");
  }
};

test.describe("Core workflows", () => {
  test("Home renders shows", async ({ page, request }) => {
    await requireSeededDb(request);

    await page.goto("/");
    await expect(page.locator(".card").first()).toBeVisible();
  });

  test("Listen Now updates player and survives search navigation", async ({ page, request }) => {
    await requireSeededDb(request);

    await page.goto("/");

    const firstCard = page.locator(".card").first();
    const firstTitle = (await firstCard.locator(".cardTitle").innerText()).trim();

    // Compact ListenNowButton has no text label, but does have an aria-label.
    await firstCard.locator('button[aria-label^="Play this show"]').click();

    const player = page.getByLabel("Site audio player");
    await expect(player.locator(".playerTitle")).toContainText(firstTitle);

    // Search for a prefix of the title to force a navigation via router.push().
    const query = firstTitle.split(/\s+/).filter(Boolean)[0]?.slice(0, 12) ?? "mix";
    await page.getByPlaceholder("Search shows by genre, artist, or song title…").fill(query);
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page).toHaveURL(/\/?\?.*q=/);
    await expect(player.locator(".playerTitle")).toContainText(firstTitle);
  });

  test("Favorites can be toggled and appear on /favorites", async ({ page, request }) => {
    await requireSeededDb(request);

    await page.goto("/");

    const firstCard = page.locator(".card").first();
    const firstTitle = (await firstCard.locator(".cardTitle").innerText()).trim();

    const favButton = firstCard.getByRole("button", { name: /favorite/i });
    await favButton.click();
    await expect(favButton).toHaveAttribute("aria-label", /remove favorite/i);

    await page.goto("/favorites");
    await expect(page.locator(".card").first()).toBeVisible();
    await expect(page.locator(".cardTitle")).toContainText(firstTitle);
  });

  test("Sidebar filters update URL query params", async ({ page, request }) => {
    await requireSeededDb(request);

    await page.goto("/");

    // Genres should be open by default.
    const genreLinks = page.locator("#sidebar-genres a");
    const genreCount = await genreLinks.count();
    test.skip(genreCount === 0, "No genres in sidebar.");

    const firstGenre = await genreLinks.first().innerText();
    await genreLinks.first().click();
    await expect
      .poll(() => new URL(page.url()).searchParams.get("genre"), { timeout: 10_000 })
      .toBe(firstGenre.toLowerCase());

    // Decades are collapsed by default; expand and apply if present.
    const expandDecades = page.getByRole("button", { name: /expand decades/i });
    if (await expandDecades.isVisible()) {
      await expandDecades.click();
      const decadeLinks = page.locator("#sidebar-decades a");
      if ((await decadeLinks.count()) > 0) {
        const firstDecade = await decadeLinks.first().innerText();
        await decadeLinks.first().click();
        await expect
          .poll(() => new URL(page.url()).searchParams.get("decade"), { timeout: 10_000 })
          .toBe(firstDecade.toLowerCase());
      }
    }

    // Stations are collapsed by default; expand and apply if present.
    const expandStations = page.getByRole("button", { name: /expand stations/i });
    if (await expandStations.isVisible()) {
      await expandStations.click();
      const stationLinks = page.locator("#sidebar-stations a");
      if ((await stationLinks.count()) > 0) {
        const firstStation = await stationLinks.first().innerText();
        await stationLinks.first().click();
        await expect
          .poll(() => new URL(page.url()).searchParams.get("station"), { timeout: 10_000 })
          .toBe(firstStation);
      }
    }
  });
});
