import { Price, ProductId } from './product';
import {
  ShoppingCartItem,
  ShoppingCartItemInterface,
} from './shoppingCartItem';
import { ProductQuantity } from './productQuantity';

export class ShoppingCartItems {
  private items: ShoppingCartItem[];

  constructor(items?: ShoppingCartItem[]) {
    this.items = items ? items : [];
  }

  static fromPrimitives(
    itemsPrimitives: ShoppingCartItemInterface[],
  ): ShoppingCartItems {
    const shoppingCartItems = new ShoppingCartItems();

    itemsPrimitives.map((item) => {
      const shoppingCartItem = new ShoppingCartItem(
        new ProductId(item.id),
        new Price(item.unitPrice),
        new ProductQuantity(item.quantity),
      );

      shoppingCartItems.addItem(shoppingCartItem);
    });
    return shoppingCartItems;
  }

  addItem(newItem: ShoppingCartItem): void {
    const existingItem = this.items.find(
      (item) =>
        item.getProductId().toString() === newItem.getProductId().toString(),
    );

    if (existingItem) {
      existingItem.addQuantity(newItem.getQuantity());
      return;
    }

    this.items.push(newItem);
  }

  toPrimitives(): ShoppingCartItemInterface[] {
    return this.items.map((item) => {
      return item.toPrimitives();
    });
  }
}