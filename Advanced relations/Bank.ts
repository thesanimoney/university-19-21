// Import necessary modules from Sequelize
import { Model, DataTypes, Sequelize } from 'sequelize';

enum PaymentMethodType {
  BankAccount = 'BankAccount',
  CreditCard = 'CreditCard',
}

class BillsPaymentSystemContext extends Sequelize {
  public users!: typeof User;
  public creditCards!: typeof CreditCard;
  public bankAccounts!: typeof BankAccount;
  public paymentMethods!: typeof PaymentMethod;
}

class User extends Model {
  public userId!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
}

class CreditCard extends Model {
  public creditCardId!: number;
  public moneyOwed!: number;
  public expirationDate!: Date;
  public limitLeft!: number; // Calculated property, not included in the database
}

class BankAccount extends Model {
  public bankAccountId!: number;
  public balance!: number;
  public bankName!: string;
  public swiftCode!: string;
}

class PaymentMethod extends Model {
  public paymentMethodId!: number;
  public type!: PaymentMethodType;
  public userId!: number;
  public bankAccountId!: number | null;
  public creditCardId!: number | null;
}

// Define model associations
User.hasMany(PaymentMethod, { foreignKey: 'userId' });
CreditCard.hasOne(PaymentMethod, { foreignKey: 'creditCardId' });
BankAccount.hasOne(PaymentMethod, { foreignKey: 'bankAccountId' });

// Define Sequelize database context
const sequelize = new BillsPaymentSystemContext({
  dialect: 'sqlite',
  storage: 'bills_payment_system.db',
});

// Define models and their associations
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

BankAccount.init(
  {
    bankAccountId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    balance: { type: DataTypes.NUMBER, allowNull: false },
    bankName: { type: DataTypes.STRING(50), allowNull: false },
    swiftCode: { type: DataTypes.STRING(20), allowNull: false },
  },
  { sequelize, modelName: 'BankAccount' }
);

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

// Add a CHECK constraint for nullable columns
sequelize.query(`
  ALTER TABLE PaymentMethods
  ADD CONSTRAINT CheckPaymentMethods CHECK (
    (BankAccountId IS NOT NULL AND CreditCardId IS NULL) OR
    (CreditCardId IS NOT NULL AND BankAccountId IS NULL)
  )
`);

// Add a unique constraint for the combination of Userld, BankAccountId, and CreditCardId
sequelize.query(`
  CREATE UNIQUE INDEX UQ_PaymentMethods_User_Bank_Credit
  ON PaymentMethods (UserId, BankAccountId, CreditCardId)
  WHERE BankAccountId IS NOT NULL AND CreditCardId IS NOT NULL
`);

export { BillsPaymentSystemContext, User, CreditCard, BankAccount, PaymentMethod };
