import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import useCartStore, { switchCartScope } from "./cartStore";

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

describe("cart store - per-account isolation", () => {
  let fakeStorage;

  function login(user) {
    fakeStorage.setItem("authUser", JSON.stringify(user));
    return switchCartScope();
  }

  function logout() {
    fakeStorage.removeItem("authUser");
    return switchCartScope();
  }

  beforeEach(() => {
    const store = new Map();
    fakeStorage = {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, value),
      removeItem: (key) => store.delete(key),
    };
    vi.stubGlobal("window", { localStorage: fakeStorage });
    useCartStore.setState({ items: [] });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps carts isolated between different user accounts", async () => {
    await login({ id: "A" });
    useCartStore.getState().addItem({ id: 1, title: "Pack A", price: "$100.000 COP" });
    expect(useCartStore.getState().items).toHaveLength(1);

    await login({ id: "B" });
    expect(useCartStore.getState().items).toHaveLength(0);
    useCartStore.getState().addItem({ id: 2, title: "Pack B", price: "$100.000 COP" });
    expect(useCartStore.getState().items).toHaveLength(1);

    await login({ id: "A" });
    expect(useCartStore.getState().items).toMatchObject([{ id: 1 }]);
  });

  it("keeps the same user's cart across a logout/login cycle", async () => {
    await login({ id: "C" });
    useCartStore.getState().addItem({ id: 3, title: "Pack C", price: "$100.000 COP" });
    expect(useCartStore.getState().items).toHaveLength(1);

    await logout();
    expect(useCartStore.getState().items).toHaveLength(0);

    await login({ id: "C" });
    expect(useCartStore.getState().items).toMatchObject([{ id: 3 }]);
  });
});
