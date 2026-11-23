/** Expected UI copy, kept here so specs never contain it as magic strings. */
export const messages = {
  invalidCredentials: "Epic sadface: Username and password do not match any user in this service",
  lockedOutUser: "Epic sadface: Sorry, this user has been locked out.",
} as const;

export const pageTitles = {
  inventory: "Products",
  cart: "Your Cart",
} as const;
