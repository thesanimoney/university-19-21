// Import necessary modules from Sequelize
import { Model, DataTypes, Sequelize } from 'sequelize';

// Define enums for ContentType and ResourceType
enum ContentType {
  Application = 'Application',
  Pdf = 'Pdf',
  Zip = 'Zip',
}

enum ResourceType {
  Video = 'Video',
  Presentation = 'Presentation',
  Document = 'Document',
  Other = 'Other',
}

// Define the Student model
class Student extends Model {
  public studentId!: number;
  public name!: string;
  public phoneNumber!: string | null;
  public registeredOn!: Date;
  public birthday!: Date | null;
}

// Define the Course model
class Course extends Model {
  public courseId!: number;
  public name!: string;
  public description!: string | null;
  public startDate!: Date;
  public endDate!: Date;
  public price!: number;
}

// Define the Resource model
class Resource extends Model {
  public resourceId!: number;
  public name!: string;
  public url!: string;
  public resourceType!: ResourceType;
}

// Define the Homework model
class Homework extends Model {
  public homeworkId!: number;
  public content!: string;
  public contentType!: ContentType;
  public submissionTime!: Date;
}

// Define the StudentCourse model (mapping class between Students and Courses)
class StudentCourse extends Model {
  public studentId!: number;
  public courseId!: number;
}

// Define the Sequelize database context
class StudentSystemContext extends Sequelize {
  public students!: typeof Student;
  public courses!: typeof Course;
  public resources!: typeof Resource;
  public homeworkSubmissions!: typeof Homework;
  public studentCourses!: typeof StudentCourse;
}

// Initialize Sequelize context with connection information
const sequelize = new StudentSystemContext();

// Define model associations
Student.init(
  {
    studentId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    phoneNumber: { type: DataTypes.STRING(10), allowNull: true },
    registeredOn: { type: DataTypes.DATE, allowNull: false },
    birthday: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Student' }
);

Course.init(
  {
    courseId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(80), allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
  },
  { sequelize, modelName: 'Course' }
);

Resource.init(
  {
    resourceId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    resourceType: { type: DataTypes.ENUM(...Object.values(ResourceType)), allowNull: false },
  },
  { sequelize, modelName: 'Resource' }
);

Homework.init(
  {
    homeworkId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.STRING, allowNull: false },
    contentType: { type: DataTypes.ENUM(...Object.values(ContentType)), allowNull: false },
    submissionTime: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, modelName: 'Homework' }
);

StudentCourse.init(
  {
    studentId: { type: DataTypes.INTEGER, primaryKey: true },
    courseId: { type: DataTypes.INTEGER, primaryKey: true },
  },
  { sequelize, modelName: 'StudentCourse' }
);

// Define associations
Student.belongsToMany(Course, { through: StudentCourse, foreignKey: 'studentId' });
Course.belongsToMany(Student, { through: StudentCourse, foreignKey: 'courseId' });

Course.hasMany(Resource, { foreignKey: 'courseId' });
Resource.belongsTo(Course, { foreignKey: 'courseId' });

Course.hasMany(Homework, { foreignKey: 'courseId' });
Homework.belongsTo(Course, { foreignKey: 'courseId' });

Student.hasMany(Homework, { foreignKey: 'studentId' });
Homework.belongsTo(Student, { foreignKey: 'studentId' });

// Export the Sequelize context and models
export { StudentSystemContext, Student, Course, Resource, Homework, StudentCourse };
