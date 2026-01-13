
import { test, expect } from '@playwright/test';

test.describe('Ad Platform Integration Test', () => {

    const testCampaign = {
        brandName: 'Test Corp Auto',
        title: 'Performance Exhaust',
        description: 'Increas HP by 15%',
        ctaText: 'Buy Now',
        active: true
    };

    test('Should render Feed Card Ad correctly', async ({ page }) => {
        // 1. Go to the Ad Manager Simulator
        await page.goto('http://localhost:3000/admin/ads');

        // 2. Click on "Feed Card" tab
        await page.click('button:has-text("Feed Card")');

        // 3. Fill the Form (Simulating User Input)
        await page.fill('input[name="brandName"]', testCampaign.brandName);
        await page.fill('input[name="title"]', testCampaign.title);
        await page.fill('textarea[name="description"]', testCampaign.description);
        await page.fill('input[name="ctaText"]', testCampaign.ctaText);

        // 4. Verify the Preview updates nicely
        const preview = page.locator('h3:has-text("Performance Exhaust")');
        await expect(preview).toBeVisible();

        const brandLabel = page.locator('span:has-text("Test Corp Auto")');
        await expect(brandLabel).toBeVisible();

        console.log('✅ Visual Preview Confirmed');
    });

    test('Should display Real Ads on Main Page', async ({ page }) => {
        // Navigate to Home
        await page.goto('http://localhost:3000');

        // Verify Hero Sponsor (Brembo default)
        await expect(page.locator('text=Presented By')).toBeVisible();

        // Verify Feed Ad Exists
        await expect(page.locator('text=Partner Speedlight')).toBeVisible();

        console.log('✅ Home Page Ad Integration Confirmed');
    });

});
