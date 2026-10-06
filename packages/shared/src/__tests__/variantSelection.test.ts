import {
  clampQuantity,
  initialSelection,
  missingOption,
  priceFor,
  selectedVariant,
  stockFor,
  valueState,
} from "../domain/variantSelection";
import { product } from "./helpers";

describe("variant selection (req §16.2)", () => {
  const shirt = product("urbano-classic-oxford-shirt");

  it("does not preselect multi-value options and asks for them in order", () => {
    expect(initialSelection(shirt)).toEqual({});
    expect(missingOption(shirt, {})).toBe("Color");
    expect(missingOption(shirt, { Color: "White" })).toBe("Size");
  });

  it("marks sold-out combinations unavailable", () => {
    expect(valueState(shirt, { Color: "White" }, "Size", "XXL").inStock).toBe(false);
    expect(valueState(shirt, { Color: "Sky Blue" }, "Size", "XXL").inStock).toBe(true);
  });

  it("resolves a full selection to its variant and stock", () => {
    const selection = { Color: "Sky Blue", Size: "S" };
    expect(stockFor(shirt, selection)).toBe(2);
    expect(selectedVariant(shirt, selection)?.id).toBe("urbano-classic-oxford-shirt-sky-blue-s");
  });

  it("preselects single-value options", () => {
    expect(initialSelection(product("saanjh-printed-kaftan")).Size).toBe("Free Size");
  });

  it("treats combinations that don't exist as unavailable", () => {
    const oneplus = product("oneplus-12r");
    const missing = valueState(oneplus, { RAM: "8 GB" }, "Storage", "256 GB");
    expect(missing.exists).toBe(false);
    expect(missing.inStock).toBe(false);
    expect(valueState(oneplus, { RAM: "16 GB" }, "Storage", "256 GB").inStock).toBe(true);
  });

  it("shows a From price until the price-changing option is chosen", () => {
    const s24 = product("samsung-galaxy-s24-ultra");
    expect(priceFor(s24, {})).toMatchObject({ price: 129999, isRange: true });
    expect(
      priceFor(s24, { Color: "Titanium Gray", RAM: "12 GB", Storage: "512 GB" }),
    ).toMatchObject({
      price: 139999,
      isRange: false,
    });
  });

  it("reports zero stock for a sold-out product and honours live adjustments", () => {
    const realme = product("realme-narzo-70-pro-5g");
    expect(stockFor(realme, initialSelection(realme))).toBe(0);
    const adjustments = { "urbano-classic-oxford-shirt-sky-blue-m": -25 };
    expect(valueState(shirt, { Color: "Sky Blue" }, "Size", "M", adjustments).inStock).toBe(false);
  });

  it("clamps the quantity to 1…stock", () => {
    expect(clampQuantity(5, 2)).toBe(2);
    expect(clampQuantity(0, 10)).toBe(1);
    expect(clampQuantity(3, 0)).toBe(1);
  });
});
