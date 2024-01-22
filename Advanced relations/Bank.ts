// Import necessary modules from Sequelize ORM
import { Model, DataTypes, Sequelize } from 'sequelize';

// Define an enumeration for different types of payment methods
enum PaymentMethodType {
  BankAccount = 'BankAccount',
  CreditCard = 'CreditCard',
}

// Create a subclass of Sequelize to represent the database context for the bill payment system
class BillsPaymentSystemContext extends Sequelize {
  public users!: typeof User;
  public creditCards!: typeof CreditCard;
  public bankAccounts!: typeof BankAccount;
  public paymentMethods!: typeof PaymentMethod;
}

// Define the User model extending from Sequelize Model
class User extends Model {
  public userId!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string; // Note: storing passwords in plain text is not secure
}

// Define the CreditCard model
class CreditCard extends Model {
  public creditCardId!: number;
  public moneyOwed!: number;
  public expirationDate!: Date;
  public limitLeft!: number; // Calculated property, not stored in the database
}

// Define the BankAccount model
class BankAccount extends Model {
  public bankAccountId!: number;
  public balance!: number;
  public bankName!: string;
  public swiftCode!: string; // SWIFT code for international bank identification
}

// Define the PaymentMethod model
class PaymentMethod extends Model {
  public paymentMethodId!: number;
  public type!: PaymentMethodType; // Type of the payment method (BankAccount or CreditCard)
  public userId!: number; // Associate a payment method with a user
  public bankAccountId!: number | null; // Optional link to a bank account
  public creditCardId!: number | null; // Optional link to a credit card
}

// Define model associations
User.hasMany(PaymentMethod, { foreignKey: 'userId' });
CreditCard.hasOne(PaymentMethod, { foreignKey: 'creditCardId' });
BankAccount.hasOne(PaymentMethod, { foreignKey: 'bankAccountId' });

// Initialize Sequelize database context for the application
const sequelize = new BillsPaymentSystemContext({
  dialect: 'sqlite',
  storage: 'bills_payment_system.db',
});

// Initialize User model and define its schema
User.init(
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING(50), allowNull: false },
    lastName: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(80), allowNull: false },
    password: { type: DataTypes.STRING(25), allowNull: false },
  },
  { sequelize, modelName: 'User' }
);

// Initialize CreditCard model and define its schema
CreditCard.init(
  {
    creditCardId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    moneyOwed: { type: DataTypes.NUMBER, allowNull: false },
    expirationDate: { type: DataTypes.DATE, allowNull: false },
    limitLeft: { type: DataTypes.VIRTUAL(DataTypes.NUMBER, ['moneyOwed'], function () {
      return this.getDataValue('moneyOwed') > 0 ? 0 : this.getDataValue('limitLeft');
    }) },
  },
  { sequelize, modelName: 'CreditCard' }
);

// Initialize BankAccount model and define its schema
BankAccount.init(
  {
    bankAccountId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    balance: { type: DataTypes.NUMBER, allowNull: false },
    bankName: { type: DataTypes.STRING(50), allowNull: false },
    swiftCode: { type: DataTypes.STRING(20), allowNull: false },
  },
  { sequelize, modelName: 'BankAccount' }
);

// Initialize PaymentMethod model and define its schema
PaymentMethod.init(
  {
    paymentMethodId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.ENUM(...Object.values(PaymentMethodType)), allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    bankAccountId: { type: DataTypes.INTEGER, allowNull: true },
    creditCardId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, modelName: 'PaymentMethod' }
);

// Add a database-level CHECK constraint to ensure either bankAccountId or creditCardId is set, but not both
sequelize.query(`
  ALTER TABLE PaymentMethods
  ADD CONSTRAINT CheckPaymentMethods CHECK (
    (BankAccountId IS NOT NULL AND CreditCardId IS NULL) OR
    (CreditCardId IS NOT NULL AND BankAccountId IS NULL)
  )
`);

// Add a unique constraint to prevent duplicate entries of the same combination of userId, bankAccountId, and creditCardId
sequelize.query(`
  CREATE UNIQUE INDEX UQ_PaymentMethods_User_Bank_Credit
  ON PaymentMethods (UserId, BankAccountId, CreditCardId)
  WHERE BankAccountId IS NOT NULL AND CreditCardId IS NOT NULL
`);

// Export the classes for use in other parts of the application
export { BillsPaymentSystemContext, User, CreditCard, BankAccount, PaymentMethod };
