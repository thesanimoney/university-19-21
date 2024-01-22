// Import necessary modules and models
import { BillsPaymentSystemContext, User, CreditCard, BankAccount, PaymentMethod, } from './Bank.ts';

// Seed method to fill the database with sample data
async function seed() {
  // Synchronize models with the database (create tables if not exists)
  await BillsPaymentSystemContext.sync({ force: true });

  // Seed users
  const users = await User.bulkCreate([
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123' },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', password: 'securepass' },
    // Add more users as needed
  ]);

  // Seed credit cards
  const creditCards = await CreditCard.bulkCreate([
    { moneyOwed: 0, expirationDate: new Date('2023-12-31'), limitLeft: 5000 },
    { moneyOwed: 150, expirationDate: new Date('2024-06-30'), limitLeft: 2000 },
    // Add more credit cards as needed
  ]);

  // Seed bank accounts
  const bankAccounts = await BankAccount.bulkCreate([
    { balance: 10000, bankName: 'Bank A', swiftCode: 'SWIFT123' },
    { balance: 5000, bankName: 'Bank B', swiftCode: 'SWIFT456' },
    // Add more bank accounts as needed
  ]);

  // Seed payment methods
  const paymentMethods = await PaymentMethod.bulkCreate([
    { type: PaymentMethodType.CreditCard, userId: users[0].userId, creditCardId: creditCards[0].creditCardId },
    { type: PaymentMethodType.BankAccount, userId: users[1].userId, bankAccountId: bankAccounts[1].bankAccountId },
    // Add more payment methods as needed
  ]);

  console.log('Database seeded successfully!');
}

// Uncomment the line below to run the seed method (fill the database with sample data)
// seed();
