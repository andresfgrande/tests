import { ProductAdder } from '../../../src/shopping-cart/context/shopping-cart/services/productAdder.service';
import { ShoppingCart } from '../../../src/shopping-cart/context/shopping-cart/domain/shopping.cart';
import { InMemoryShoppingCartRepository } from '../../../src/shopping-cart/context/shopping-cart/infrastructure/inMemoryShoppingCartRepository';
import { mock } from 'jest-mock-extended';
import { DateGenerator } from '../../../src/shopping-cart/context/shopping-cart/infrastructure/dateGenerator';

describe('ProductAdder', () => {
  it('Should add product', () => {
    const dateGenerator = mock<DateGenerator>();
    const shoppingCartRepository = mock<InMemoryShoppingCartRepository>();
    const productAdder = new ProductAdder(
      shoppingCartRepository,
      dateGenerator,
    );

    const expectedDate = new Date().toISOString();
    dateGenerator.getDate.mockReturnValue(expectedDate);

    productAdder.execute({
      idUser: 'andres',
      idProduct: 'the-hobbit',
      quantity: 2,
    });

    const expectedShoppingCart: ShoppingCart = ShoppingCart.fromPrimitives({
      creationDate: expectedDate,
      idUser: 'andres',
      products: [{ id: 'the-hobbit', quantity: 2 }],
    });

    expect(shoppingCartRepository.save).toHaveBeenCalledWith(
      expectedShoppingCart,
    );
  });

  it('Should add 1 product to existing shopping cart', () => {
    const dateGenerator = mock<DateGenerator>();
    const shoppingCartRepository = mock<InMemoryShoppingCartRepository>();
    const productAdder = new ProductAdder(
      shoppingCartRepository,
      dateGenerator,
    );

    const expectedDate = new Date().toISOString();
    dateGenerator.getDate.mockReturnValue(expectedDate);

    shoppingCartRepository.getByUserId.mockReturnValue(
      ShoppingCart.fromPrimitives({
        creationDate: expectedDate,
        idUser: 'andres',
        products: [{ id: '10002', quantity: 2 }],
      }),
    );

    productAdder.execute({
      idUser: 'andres',
      idProduct: '20110',
      quantity: 5,
    });

    const expectedShoppingCart: ShoppingCart = ShoppingCart.fromPrimitives({
      creationDate: expectedDate,
      idUser: 'andres',
      products: [
        { id: '10002', quantity: 2 },
        { id: '20110', quantity: 5 },
      ],
    });

    expect(shoppingCartRepository.save).toHaveBeenCalledWith(
      expectedShoppingCart,
    );
  });

  it('Should sum quantities in case product exists in cart', () => {
    const dateGenerator = mock<DateGenerator>();
    const shoppingCartRepository = mock<InMemoryShoppingCartRepository>();
    const productAdder = new ProductAdder(
      shoppingCartRepository,
      dateGenerator,
    );

    const expectedDate = new Date().toISOString();
    dateGenerator.getDate.mockReturnValue(expectedDate);

    shoppingCartRepository.getByUserId.mockReturnValue(
      ShoppingCart.fromPrimitives({
        creationDate: expectedDate,
        idUser: 'andres',
        products: [{ id: '10002', quantity: 2 }],
      }),
    );

    productAdder.execute({
      idUser: 'andres',
      idProduct: '10002',
      quantity: 5,
    });

    const expectedShoppingCart: ShoppingCart = ShoppingCart.fromPrimitives({
      creationDate: expectedDate,
      idUser: 'andres',
      products: [{ id: '10002', quantity: 7 }],
    });

    expect(shoppingCartRepository.save).toHaveBeenCalledWith(
      expectedShoppingCart,
    );
  });

  it('Should throw error in case product does not exist', () => {
    //expect(productAdder.execute({})).rejects.toThrowError('error text')
  });

  it('Should throw error in case product does not exist', () => {
    const dateGenerator = mock<DateGenerator>();
    const shoppingCartRepository = mock<InMemoryShoppingCartRepository>();
    const productAdder = new ProductAdder(
      shoppingCartRepository,
      dateGenerator,
    );

    const expectedDate = new Date().toISOString();
    dateGenerator.getDate.mockReturnValue(expectedDate);

    productAdder.execute({
      idUser: 'andres',
      idProduct: 'the-hobbit',
      quantity: 2,
    });

    const expectedShoppingCart: ShoppingCart = ShoppingCart.fromPrimitives({
      creationDate: expectedDate,
      idUser: 'andres',
      products: [{ id: 'the-hobbit', quantity: 2 }],
    });

    expect(shoppingCartRepository.save).toHaveBeenCalledWith(
      expectedShoppingCart,
    );
  });
});

//add product de producto que ya existe en la shopping cart y se tengan que sumar cantidades
//comprobar que cuando se hace add product que el producto existe, si no existe devolver error