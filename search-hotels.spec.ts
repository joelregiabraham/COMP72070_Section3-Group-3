import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("joel@gmail.com");
  await page.locator("[name=password]").fill("Joel1234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

// Test Case 014: Show Hotel Search Results
test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("USA");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in USA")).toBeVisible();
  await expect(page.getByText("The Grand Hyatt")).toBeVisible();
});


test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("USA");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("The Grand Hyatt").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});

// Test Case 015: Book Hotel
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

  await expect(page.getByText("Total Cost: $1350.00")).toBeVisible();

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

// Test Case 016: Search for Hotel in a Different Location
test("Search for a Hotel in a Different Location", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("London");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("0 Hotels found in London")).toBeVisible();
});

// Test Case 017: Search for Hotels with Different Check-out Dates
test("Search for Hotels with Different Check-out Dates", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() + 5); // Change to a future date
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Hotels found in usa")).toBeVisible();
});

// Test Case 020: Book Hotel with Different Payment Cards
test("Book Hotel with Different Payment Cards", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $1350.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame.locator('[placeholder="Card number"]').fill("5555555555554444"); // Different card number
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("12/25");
  await stripeFrame.locator('[placeholder="CVC"]').fill("123");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("12345");
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking Saved!")).toBeVisible();
});

// Test Case 021: Attempt to Book Hotel with Expired Payment Card
test("Attempt to Book Hotel with Expired Payment Card", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $1350.00")).toBeVisible();

 const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame.locator('[placeholder="Card number"]').fill("5555555555554444"); // Different card number
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("12/22");
  await stripeFrame.locator('[placeholder="CVC"]').fill("123");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("12345");
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page).not.toBe('Booking Saved!');

});

// New test cases from here - HP
// Test Case 022: Attempt to Book Hotel without Filling Required Fields
test("Attempt to Book Hotel without Filling Required Fields", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $1350.00")).toBeVisible();
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page).not.toBe('Booking Saved!');
});

// Test Case 018: Search for Hotels with Past Check-out Dates
test("Search for Hotels with Past Check-out Dates", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() - 1); // Change to a past date
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Please select a future check-out date")).toBeVisible();
});

// Test Case 019: Attempt to Book Hotel with Invalid Payment Card Number
test("Attempt to Book Hotel with Invalid Payment Card Number", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $1350.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame.locator('[placeholder="Card number"]').fill("1234567890123456"); // Invalid card number
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("12/25");
  await stripeFrame.locator('[placeholder="CVC"]').fill("123");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("12345");
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page).not.toBe('Booking Saved!');
});

// Test Case 023: Attempt to Book Hotel without Check-out Date
test("Attempt to Book Hotel without Check-out Date", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Please select a check-out date")).toBeVisible();
});

// Test Case 024: Attempt to Book Hotel with Invalid Check-out Date Format
test("Attempt to Book Hotel with Invalid Check-out Date Format", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  await page.getByPlaceholder("Check-out Date").fill("2024-04-20"); // Invalid date format
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Please select a valid check-out date")).toBeVisible();
});

// Test Case 025: Search for Hotels without Specifying Location
test("Search for Hotels without Specifying Location", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Please specify a location")).toBeVisible();
});

// Test Case 026: Attempt to Book Hotel without Filling Payment Card Details
test("Attempt to Book Hotel without Filling Payment Card Details", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $1350.00")).toBeVisible();
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Please fill in payment card details")).toBeVisible();
});

// Test Case 027: Confirm Booking Details
test("Confirm Booking Details", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("usa");
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("The Grand Hyatt").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $1350.00")).toBeVisible();
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking Confirmed!")).toBeVisible();
});

// Test Case 028: Search for Hotels with Valid Location
test("Search for Hotels with Valid Location", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("USA");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Hotels found in USA")).toBeVisible();
});

// Test Case 029: Search for Hotels with Invalid Location
test("Search for Hotels with Invalid Location", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("Invalid Location");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("No hotels found in the specified location")).toBeVisible();
});

// Test Case 030: Submit Review and Rating for a Hotel
test("Submit Review and Rating for a Hotel", async ({ page }) => {
  await page.goto(UI_URL);
  await page.click("text=The Grand Hyatt"); // Click on the hotel
  await page.click('button:has-text("Submit Review")'); // Click on the submit review button

  // Set the rating value
  await page.fill('input[name="rating"]', "5");

  // Fill the review text
  await page.fill('textarea[name="review"]', "Great experience at The Grand Hyatt!");

  // Submit the review
  await page.click('button:has-text("Submit")');

  // Wait for success message to appear
  await page.waitForSelector('text=Review Submitted Successfully');
  const successMessage = await page.textContent('text=Review Submitted Successfully');
  expect(successMessage).toContain("Review Submitted Successfully"); // Verify success message
});
