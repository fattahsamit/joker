export interface Product {
  name: string;
}

export const products = {
  backpack: { name: "Sauce Labs Backpack" },
  bikeLight: { name: "Sauce Labs Bike Light" },
} satisfies Record<string, Product>;
