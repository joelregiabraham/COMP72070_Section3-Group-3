import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.waitForTimeout(2000);
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("joel@gmail.com");
  await page.locator("[name=password]").fill("Joel1234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

// Show Hotel Search Results
test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("USA");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in USA")).toBeVisible();
  await expect(page.getByText("The Grand Hyatt")).toBeVisible();
});

// show hotel detail
test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("USA");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("The Grand Hyatt").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});

//  Book Hotel
test("should book hotel", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("USA");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();

  await expect(page.getByText("Total Cost: $966.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator('[placeholder="Card number"]')
    .fill("4242424242424242");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
  await stripeFrame.locator('[placeholder="CVC"]').fill("242");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("24225");

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking Saved!")).toBeVisible();

  await page.getByRole("link", { name: "My Bookings" }).click();
  await expect(page.getByText("The Grand Hyatt")).toBeVisible();
});
// Search for Hotels with Invalid Check-out Dates
test("Search for Hotels with Invalid Check-out Dates", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() - 3); // Change to a past date
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Please select a valid check-out date")).toBeVisible();
});

// Attempt to Book Hotel with Insufficient Payment Card Details
test("Attempt to Book Hotel with Insufficient Payment Card Details", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $966.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame.locator('[placeholder="Card number"]').fill("5555"); // Invalid card number
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("12/25");
  await stripeFrame.locator('[placeholder="CVC"]').fill("123");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("12345");
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page).not.toBe('Booking Saved!');
});

//  Attempt to Book Hotel with Non-existent Payment Card
test("Attempt to Book Hotel with Non-existent Payment Card", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $966.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame.locator('[placeholder="Card number"]').fill("4242424242424242"); // Valid but non-existent card number
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("12/25");
  await stripeFrame.locator('[placeholder="CVC"]').fill("123");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("12345");
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page).not.toBe('Booking Saved!');
});

//Attempt to Book Hotel with Past Check-out Date
test("Attempt to Book Hotel with Past Check-out Date", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() - 1); // Change to a past date
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Please select a valid check-out date")).toBeVisible();
});

// Attempt to Book Hotel without Searching
test("Attempt to Book Hotel without Searching", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Please select a destination and search for hotels")).toBeVisible();
});
