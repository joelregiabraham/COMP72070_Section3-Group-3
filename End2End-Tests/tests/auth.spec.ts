import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("joel@gmail.com");
  await page.locator("[name=password]").fill("Joel1234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("TC-002 password do not match", async ({ page }) => {

  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("joel@gmail.com");
  await page.locator("[name=password]").fill("Joel1233");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Invalid Credentials")).toBeVisible();

});

test("TC-003 invalid email", async ({ page }) => {

  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("joel@gmai.com");
  await page.locator("[name=password]").fill("Joel1234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Invalid Credentials")).toBeVisible();
});

test("TC-006 Invalid credentials", async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("jol@gmai.com");
  await page.locator("[name=password]").fill("Joe234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Invalid Credentials")).toBeVisible();
});

test("TC-007 credential required email id ", async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  //await page.locator("[name=email]").fill("jol@gmai.com");
  await page.locator("[name=password]").fill("Joe234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
});

test("TC-008 credential required password ", async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("jol@gmai.com");
  //await page.locator("[name=password]").fill("Joe234");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Please enter a valid password")).toBeVisible();
});

test("should allow user to register", async ({ page }) => {
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Registration Success!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});