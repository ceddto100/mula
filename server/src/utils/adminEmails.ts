/**
 * Hard-coded list of admin email addresses.
 * Users with these emails automatically receive admin role.
 */
const ADMIN_EMAILS = [
  'cartercedrick35@gmail.com',
  'cualquiercosano9.world@gmail.com',
];

/**
 * Check if an email address belongs to an admin user.
 * @param email - The email address to check
 * @returns 'admin' if the email is in the admin list, otherwise 'customer'
 */
export const getUserRole = (email: string | undefined): 'admin' | 'customer' => {
  if (!email) return 'customer';

  const normalizedEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(normalizedEmail) ? 'admin' : 'customer';
};

/**
 * Check if an email address is an admin.
 * @param email - The email address to check
 * @returns true if the email is in the admin list
 */
export const isAdminEmail = (email: string | undefined): boolean => {
  return getUserRole(email) === 'admin';
};
