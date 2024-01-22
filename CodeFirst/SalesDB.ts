import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { createConnection, Connection, Repository } from 'typeorm';

// Entities representing database tables

/**
 * Represents a product in the database.
 */
@Entity()
class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  ProductId: number;

  @Column({ length: 50, nullable: false })
  Name: string;

  @Column('real', { nullable: false })
  Quantity: number;

  @OneToMany(() => Sale, (sale) => sale.Product)
  Sales: Sale[];
}

/**
 * Represents a customer in the database.
 */
@Entity()
class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  CustomerId: number;

  @Column({ length: 10, nullable: false })
  Name: string;

  @Column({ length: 80, nullable: false })
  Email: string;

  @Column({ nullable: false })
  CreditCardNumber: string;

  @OneToMany(() => Sale, (sale) => sale.Customer)
  Sales: Sale[];
}

/**
 * Represents a store in the database.
 */
@Entity()
class Store extends BaseEntity {
  @PrimaryGeneratedColumn()
  StoreId: number;

  @Column({ length: 80, nullable: false })
  Name: string;

  @OneToMany(() => Sale, (sale) => sale.Store)
  Sales: Sale[];
}

/**
 * Represents a sale in the database.
 */
@Entity()
class Sale extends BaseEntity {
  @PrimaryGeneratedColumn()
  SaleId: number;

  @CreateDateColumn()
  Date: Date;

  @ManyToOne(() => Product, (product) => product.Sales)
  Product: Product;

  @ManyToOne(() => Customer, (customer) => customer.Sales)
  Customer: Customer;

  @ManyToOne(() => Store, (store) => store.Sales)
  Store: Store;
}

// Connection and repository setup

/**
 * Manages the database connection and provides repositories for CRUD operations.
 */
class SalesContext {
  private connection: Connection;

  ProductRepository: Repository<Product>;
  CustomerRepository: Repository<Customer>;
  StoreRepository: Repository<Store>;
  SaleRepository: Repository<Sale>;

  /**
   * Creates a new instance of SalesContext.
   */
  constructor() {
    this.connection = createConnection({
      type: 'sqlite',
      database: ':memory:',
      entities: [Product, Customer, Store, Sale],
      synchronize: true,
      logging: true,
    });

    this.connection.then(async () => {
      this.ProductRepository = this.connection.getRepository(Product);
      this.CustomerRepository = this.connection.getRepository(Customer);
      this.StoreRepository = this.connection.getRepository(Store);
      this.SaleRepository = this.connection.getRepository(Sale);

      // Seed the database with sample data
      await this.seedDatabase();
    });
  }

  /**
   * Seeds the database with sample data.
   */
  private async seedDatabase() {
    const products = await this.ProductRepository.save([
      { Name: 'Product 1', Quantity: 10 },
      { Name: 'Product 2', Quantity: 20 },
      // Add more products as needed
    ]);

    const customers = await this.CustomerRepository.save([
      { Name: 'Customer 1', Email: 'customer1@example.com', CreditCardNumber: '1111-1111-1111-1111' },
      { Name: 'Customer 2', Email: 'customer2@example.com', CreditCardNumber: '2222-2222-2222-2222' },
      // Add more customers as needed
    ]);

    const stores = await this.StoreRepository.save([
      { Name: 'Store A' },
      { Name: 'Store B' },
      // Add more stores as needed
    ]);

    // Generate random sales
    for (let i = 0; i < 20; i++) {
      const product = this.getRandomItem(products);
      const customer = this.getRandomItem(customers);
      const store = this.getRandomItem(stores);

      await this.SaleRepository.save({
        Date: new Date(),
        Product: product,
        Customer: customer,
        Store: store,
      });
    }
  }

  /**
   * Gets a random item from an array.
   * @param array The array to pick a random item from.
   * @returns A random item from the array.
   */
  private getRandomItem<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
}

// Example usage

const salesContext = new SalesContext();

salesContext.connection.then(async () => {
  // Query the database
  const sales = await salesContext.SaleRepository.find({ relations: ['Product', 'Customer', 'Store'] });
  console.log('Sales:', sales);

  // Perform other queries or operations as needed
});
