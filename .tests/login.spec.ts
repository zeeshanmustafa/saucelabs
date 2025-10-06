import { test, expect } from '../fixtures/pom-fixture';

/**
 * Sauce Demo provides these built-in usernames and a common password.
 * Password for all users: secret_sauce
 * Users: standard_user, locked_out_user, problem_user, performance_glitch_user
 */
const PASSWORD = process.env.PASSWORD ??'';
const acceptedUsers: Array<{ username: string; type: 'ok' | 'locked' }> = [
  { username: 'standard_user', type: 'ok' },
  { username: 'locked_out_user', type: 'locked' },
  { username: 'problem_user', type: 'ok' },
  { username: 'performance_glitch_user', type: 'ok' },
];

test.describe('Sauce Demo Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // Test Case 1: Successful login for all non-locked users; locked user shows specific error.
  for (const u of acceptedUsers) {
    const name =
      u.type === 'locked'
        ? `Locked-out user should see locked message: ${u.username}`
        : `Successful login should land on inventory: ${u.username}`;

    test(name, async ({ loginPage, inventoryPage }) => {
      await loginPage.login(u.username, PASSWORD);

      if (u.type === 'locked') {
        // Verify locked error banner
        await loginPage.assertLockedOutError();
      } else {
        // Verify inventory loaded and user can log out to return to login
        await inventoryPage.assertLoaded();
        await inventoryPage.logout();
        await expect(loginPage.appLogo).toBeVisible();
      }
    });
  }

  // Test Case 2: Invalid credentials show appropriate error
  test('Invalid credentials should show mismatch error', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_pass');
    await loginPage.assertInvalidCredsError();
  });

  // Test Case 3: Required field errors for missing username and missing password
  test('Missing username should show required error', async ({ loginPage }) => {
    await loginPage.login('', PASSWORD);
    await loginPage.assertRequiredFieldError();
  });

  test('Missing password should show required error', async ({ loginPage }) => {
    await loginPage.login('standard_user', '');
    await loginPage.assertRequiredFieldError();
  });
});
