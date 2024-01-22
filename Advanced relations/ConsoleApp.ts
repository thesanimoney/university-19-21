// Import necessary modules and models
import { BillsPaymentSystemContext, User, PaymentMethod, CreditCard, BankAccount } from './Bank';

// Function to retrieve and print user and payment methods information
async function printUserPaymentMethods(userId: number) {
  // Initialize Sequelize context
  const sequelize = new BillsPaymentSystemContext();

  try {
    // Retrieve user and associated payment methods
    const user = await User.findByPk(userId, {
      include: [
        {
          model: PaymentMethod,
          include: [BankAccount, CreditCard],
        },
      ],
    });

    // Check if the user exists
    if (!user) {
      console.log(`User with ID ${userId} not found!`);
      return;
    }

    // Print user information
    console.log(`User: ${user.firstName} ${user.lastName}`);

    // Print bank accounts
    console.log('Bank Accounts:');
    user.paymentMethods
      .filter((method) => method.bankAccount)
      .forEach((method) => {
        const bankAccount = method.bankAccount!;
        console.log(`- ID: ${bankAccount.bankAccountId}`);
        console.log(`  - Balance: ${bankAccount.balance.toFixed(2)}`);
        console.log(`  - Bank: ${bankAccount.bankName}`);
        console.log(`  - SWIFT: ${bankAccount.swiftCode}`);
      });

    // Print credit cards
    console.log('Credit Cards:');
    user.paymentMethods
      .filter((method) => method.creditCard)
      .forEach((method) => {
        const creditCard = method.creditCard!;
        console.log(`- ID: ${creditCard.creditCardId}`);
        console.log(`  - Limit: ${creditCard.limitLeft.toFixed(2)}`);
        console.log(`  - Money Owed: ${creditCard.moneyOwed.toFixed(2)}`);
        console.log(`  - Limit Left: ${creditCard.limitLeft.toFixed(2)}`);
        console.log(`  - Expiration Date: ${creditCard.expirationDate.toISOString().slice(0, 7)}`);
      });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Uncomment the line below to run the console application with a specific user ID
// printUserPaymentMethods(1);
