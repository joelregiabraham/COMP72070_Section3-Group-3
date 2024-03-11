
// test case 3 - Note: Info should be changed accordingly
test ("should display hotels",async ({page})=>{
    await page.goto (${UI_URL}my-hotels);
    await expect(page.getByText("Hotel Name")).toBeVisible();   // change the hotel name accordingly
    await expect(page.getByText("Hotel Description")).toBeVisible();     // change the description accordingly
    await expect(page.getByText("Hotel Location")).toBeVisible();   // change the hotel location accordingly \
    await expect(page.getByText("Hotel type")).toBeVisible();   // change the hotel type accordingly 
    await expect(page.getByText("Hotel Name")).toBeVisible();   // change the hotel name accordingly
    await expect(page.getByText("Hotel Price")).toBeVisible();   // change the hotel price accordingly
    await expect(page.getByText("Hotel Rating")).toBeVisible();   // change the hotel rating accordingly

    await expect
    (page.getByRole("link",{name: "View Details"}).first()).toBeVisible(); 
    await page.getByRole("link",{name: "Add Hotel"}) .toBeVisible(); 

}
// test case 4
test )"should edit hotel", asynch({page})=>{
    await page.goto('${UI_URL}my-hotels');
    await page.getByRole("link", {name:"View Details"}).first().click();
    await page.waitForSelector ('[name= "name]', {state:"attached "})
    await expect(page.locator ('[name= "name"]').fill("Hotel Name UPDATED")
    await page.getByRole("button", {name:"Save"}).click();
    await ecpect (page.getByText("Hotel saved")).toBeVisible();

    await page.reload();

    await expect (page.locator('[name= "name"]')).toHaveValue("Hotel Info UPDATED")
    await page.locator('[name= "name"]').fill("Initial Hotel Name")
    await page.getByRole("button",{name:"Save"}).click();
}

