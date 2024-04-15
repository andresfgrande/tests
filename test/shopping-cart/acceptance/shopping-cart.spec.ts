import {
  ContentResponseDTO,
  ShoppingCartController,
} from '../../../src/shopping-cart/api/controllers/shopping-cart.controller';
import { ProductAdder } from '../../../src/shopping-cart/context/shopping-cart/services/ProductAdder.service';

describe('ShoppingCart should', () => {
  it('be created', () => {
    const productAdder = new ProductAdder();
    const shoppingCartController = new ShoppingCartController(productAdder);
    const idUser = 'andres';
    const idProduct = '1';
    const quantity = 2;

    shoppingCartController.addProduct({ idUser, idProduct, quantity });

    const expectedShoppingCart = {
      creationDate: new Date(Date.now() + 1000 * 60 * 1000).toString(),
      orders: [
        {
          idProduct: 'the-hobbit',
          name: 'The Hobbit',
          unitPrice: 5,
          total: 10,
          quantity: 2,
        },
      ],
      totalPrice: 10,
    } as ContentResponseDTO;

    expect(shoppingCartController.getContent()).toBe(expectedShoppingCart);
  });
});