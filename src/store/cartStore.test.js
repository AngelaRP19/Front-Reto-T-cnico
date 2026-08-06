import { describe, it, expect } from "vitest";
import useCartStore from "./cartStore";

describe("cart store", () => {
  it("adds a new item to the cart", () => {
    useCartStore.setState({ items: [] });

    useCartStore.getState().addItem({ id: 1, title: "Pack A", price: "$100.000 COP" });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toMatchObject({ id: 1, quantity: 1 });
  });

  it("increases quantity when the same item is added again", () => {
    useCartStore.setState({ items: [] });

    useCartStore.getState().addItem({ id: 2, title: "Pack B", price: "$100.000 COP" });
    useCartStore.getState().addItem({ id: 2, title: "Pack B", price: "$100.000 COP" });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });
});
