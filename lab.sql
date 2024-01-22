-- Drop tables if they exist (use with caution in a real database)
DROP TABLE IF EXISTS DepartmentExpenseType;
DROP TABLE IF EXISTS BudgetLimits;
DROP TABLE IF EXISTS Expenses;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS ExpenseTypes;
DROP TABLE IF EXISTS Departments;

-- Create Departments table
CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    NumberOfEmployees INT NOT NULL
);

-- Create ExpenseTypes table
CREATE TABLE ExpenseTypes (
    ExpenseTypeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    ExpenseLimit DECIMAL(10, 2) NOT NULL
);

-- Create Employees table
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

-- Create Expenses table
CREATE TABLE Expenses (
    ExpenseID INT PRIMARY KEY AUTO_INCREMENT,
    Amount DECIMAL(10, 2) NOT NULL,
    Date DATE NOT NULL,
    DepartmentID INT,
    ExpenseTypeID INT,
    EmployeeID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID),
    FOREIGN KEY (ExpenseTypeID) REFERENCES ExpenseTypes(ExpenseTypeID),
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);

-- Create BudgetLimits table
CREATE TABLE BudgetLimits (
    BudgetLimitID INT PRIMARY KEY AUTO_INCREMENT,
    LimitAmount DECIMAL(10, 2) NOT NULL,
    Month INT NOT NULL,
    Year INT NOT NULL,
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

-- Set up relationship between Departments and BudgetLimits
ALTER TABLE BudgetLimits
ADD FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID);

-- Set up relationship between Departments and Expenses
ALTER TABLE Expenses
ADD FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID);

-- Set up relationship between Expenses and ExpenseTypes
ALTER TABLE Expenses
ADD FOREIGN KEY (ExpenseTypeID) REFERENCES ExpenseTypes(ExpenseTypeID);

-- Set up relationship between Employees and Expenses
ALTER TABLE Expenses
ADD FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID);

-- Set up relationship between Departments and ExpenseTypes (Many-to-Many)
CREATE TABLE DepartmentExpenseType (
    DepartmentID INT,
    ExpenseTypeID INT,
    PRIMARY KEY (DepartmentID, ExpenseTypeID),
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID),
    FOREIGN KEY (ExpenseTypeID) REFERENCES ExpenseTypes(ExpenseTypeID)
);
