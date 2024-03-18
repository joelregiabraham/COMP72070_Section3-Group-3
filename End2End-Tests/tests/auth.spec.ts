import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

async function signIn(page: any, email: string, password: string) {
  await page.goto(UI_URL);
  await page.waitForTimeout(2000); // Adding a small delay after the test case
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.waitForTimeout(1000);
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.locator("[name=email]").fill(email);
  await page.locator("[name=password]").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

async function signOut(page: any) {
  await page.getByRole("button", { name: "Sign Out" }).click();
}



test("TC-001 should allow the user to sign in", async ({ page }) => {
  await signIn(page, "joel@gmail.com", "Joel1234");
  await expect(page.getByText("Sign in Successful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
  await page.waitForTimeout(1000); // Adding a small delay after the test case
});

test("TC-002 password do not match", async ({ page }) => {

  await signIn(page, "joel@gmail.com", "invalidpassword");
  await expect(page.getByText("Invalid Credentials")).toBeVisible();
  await page.waitForTimeout(1000); // Adding a small delay after the test case

});

test("TC-003 invalid email", async ({ page }) => {

  await signIn(page, "invalidEmail@gmail.com", "Joel1234");
  await expect(page.getByText("Invalid Credentials")).toBeVisible();
  await page.waitForTimeout(1000); // Adding a small delay after the test case
});

test("TC-006 Invalid credentials", async ({ page }) => {
  await signIn(page, "invalidEmail@gmail.com", "invalidpassword");
  await expect(page.getByText("Invalid Credentials")).toBeVisible();
  await page.waitForTimeout(1000); // Adding a small delay after the test case
});

test("TC-007 credential required email id ", async ({ page }) => {
  await signIn(page, "", "Joel1234");
  
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  await page.waitForTimeout(1000); // Adding a small delay after the test case
});

test("TC-008 credential required password ", async ({ page }) => {
  await signIn(page, "joel@gmail.com", "");

  await expect(page.getByText("Please enter a valid password")).toBeVisible();
  await page.waitForTimeout(1000); // Adding a small delay after the test case
});

test("TC-009 should allow user to register", async ({ page }) => {
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.waitForTimeout(1000); 
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
  await page.waitForTimeout(1000); // Adding a small delay after the test case
});