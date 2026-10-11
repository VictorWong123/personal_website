import { expect, test } from '@playwright/test';

const useReducedMotion = async page => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
};

const openGuide = async page => {
    const guide = page.locator('.secrets-field-guide');
    if (await guide.getAttribute('open') === null) await guide.locator('summary').click();
    return guide;
};

test('loads the scene and supports object, keyboard and project discovery', async ({ page }, testInfo) => {
    await useReducedMotion(page);
    await page.goto('/secrets');
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.getByText('Loading 3D scene…', { exact: true })).toHaveCount(0, { timeout: 20000 });
    await expect(page.getByText(/3D scene unavailable/)).toHaveCount(0);

    const robotLabel = page.locator('.secrets-world-label').filter({ hasText: 'Robot dossier' });
    await robotLabel.click();
    await expect(page.getByRole('dialog').getByRole('heading', { level: 1, name: 'Victor Wong' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(robotLabel).toBeFocused();

    const guide = await openGuide(page);
    await guide.getByRole('button', { name: /Project archive/ }).focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { level: 1, name: 'Project archive' })).toBeVisible();
    await dialog.getByRole('button', { name: /ShopNSplit/ }).click();
    await expect(dialog.getByRole('heading', { level: 2, name: 'ShopNSplit' })).toBeVisible();

    if (testInfo.project.name.startsWith('ipad-')) {
        const exit = page.getByRole('link', { name: 'Exit' });
        const box = await exit.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
    }
});

test('overview does not eagerly request unused project captures', async ({ page }) => {
    await useReducedMotion(page);
    await page.goto('/secrets');
    await expect(page.getByText('Loading 3D scene…', { exact: true })).toHaveCount(0, { timeout: 20000 });
    const captureRequests = await page.evaluate(() => performance.getEntriesByType('resource')
        .map(entry => entry.name)
        .filter(url => url.includes('/secrets/project-captures/')));
    expect(captureRequests.some(url => /orbits|shopnsplit|strengthos/.test(url))).toBe(false);
});

test('model failure exposes the same discoveries through HTML controls', async ({ page }) => {
    await page.route('**/hooded-robot.glb', route => route.abort());
    await page.goto('/secrets');
    await expect(page.getByText(/3D scene unavailable/)).toBeVisible();
    await expect(page.getByRole('button', { name: /skip intro/i })).toHaveCount(0);

    const guide = await openGuide(page);
    await guide.getByRole('button', { name: /Robot dossier/ }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Victor Wong' })).toBeVisible();
    await dialog.getByText('Experience', { exact: true }).click();
    await expect(dialog.locator('.secrets-records article').first()).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Full work history' })).toHaveAttribute('href', '/work');
});

test('Escape closes discoveries and rapid travel reveals only the latest target', async ({ page }, testInfo) => {
    test.setTimeout(60000);
    test.skip(testInfo.project.name !== 'desktop-chromium', 'One motion-enabled browser covers this state path.');
    await page.goto('/secrets');
    await expect(page.getByRole('button', { name: /skip intro/i })).toBeVisible({ timeout: 20000 });
    await page.keyboard.press('Escape');
    await expect(page.locator('.secrets-field-guide summary')).toBeFocused();

    const guide = await openGuide(page);
    await guide.getByRole('button', { name: /Project archive/ }).click();
    await guide.getByRole('button', { name: /Contact beacon/ }).click();
    await expect(page.getByText('Traveling to Contact beacon', { exact: true })).toBeVisible();
    await useReducedMotion(page);
    await expect(page.getByRole('dialog').getByRole('heading', { name: 'Contact beacon' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(guide.getByRole('button', { name: /Contact beacon/ })).toBeFocused();
});
