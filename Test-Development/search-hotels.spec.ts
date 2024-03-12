import{ test,expect} from "@playwright/test";



const UI_URL = "http://localhost:5173/";

 // Test Case 1: Sign In
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

  await expect(page.getByText("Total Cost: $900.00")).toBeVisible();

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
  await expect(page.getByText("Hotels found in London")).toBeVisible();
});


// Test Case 017: Search for Hotels with Different Check-out Dates
test("Search for Hotels with Different Check-out Dates", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("Dublin");
  const date = new Date();
  date.setDate(date.getDate() + 5); // Change to a future date
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
});

// Test Case 020: Book Hotel with Different Payment Cards
test("Book Hotel with Different Payment Cards", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("Dublin Getaways").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $357.00")).toBeVisible();

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
  await page.getByPlaceholder("where are you going?").fill("Berlin");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("Berlin Getaways").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await expect(page.getByText("Total Cost: $250.00")).toBeVisible();
  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame.locator('[placeholder="Card number"]').fill("4242424242424242");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("01/20");
  await stripeFrame.locator('[placeholder="CVC"]').fill("123");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("54321");
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page).toHaveText("Your card's expiration year is in the past");
});

// Test Case 022: Attempt to Book Hotel without Filling Required Fields
test("Attempt to Book Hotel without Filling Required Fields", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("where are you going?").fill("Tokyo");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("Tokyo Getaways").click();
  await page.getByRole("button", { name: "Book now" }).click();
  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page).toHaveText("Please fill out this field");
});

