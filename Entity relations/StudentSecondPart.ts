// Import necessary modules and models
import { StudentSystemContext, Student, Course, Resource, Homework, StudentCourse } from './Student';

// Seed method to fill the database with sample data
async function seed() {
  // Synchronize models with the database (create tables if not exists)
  await StudentSystemContext.sync({ force: true });

  // Seed students
  const students = await Student.bulkCreate([
    { name: 'John Doe', phoneNumber: '1234567890', registeredOn: new Date(), birthday: new Date('1990-01-01') },
    { name: 'Jane Smith', phoneNumber: '9876543210', registeredOn: new Date(), birthday: new Date('1995-05-15') },
    // Add more students as needed
  ]);

  // Seed courses
  const courses = await Course.bulkCreate([
    { name: 'Introduction to Programming', startDate: new Date(), endDate: new Date('2023-03-01'), price: 199.99 },
    { name: 'Web Development Fundamentals', startDate: new Date(), endDate: new Date('2023-04-01'), price: 249.99 },
    // Add more courses as needed
  ]);

  // Seed resources
  const resources = await Resource.bulkCreate([
    { name: 'Programming Basics Video', url: 'http://example.com/video1', resourceType: ResourceType.Video, courseId: courses[0].courseId },
    { name: 'Web Development Slides', url: 'http://example.com/slides', resourceType: ResourceType.Presentation, courseId: courses[1].courseId },
    // Add more resources as needed
  ]);

  // Seed homework submissions
  const homeworkSubmissions = await Homework.bulkCreate([
    {
      content: 'Programming Basics Assignment',
      contentType: ContentType.Application,
      submissionTime: new Date(),
      studentId: students[0].studentId,
      courseId: courses[0].courseId,
    },
    {
      content: 'Web Development Project',
      contentType: ContentType.Zip,
      submissionTime: new Date(),
      studentId: students[1].studentId,
      courseId: courses[1].courseId,
    },
    // Add more homework submissions as needed
  ]);

  // Seed student-course relationships
  await StudentCourse.bulkCreate([
    { studentId: students[0].studentId, courseId: courses[0].courseId },
    { studentId: students[1].studentId, courseId: courses[1].courseId },
    // Add more relationships as needed
  ]);

  console.log('Database seeded successfully!');
}

// Console application to read information about courses and students
async function main() {
  // Initialize Sequelize context
  const sequelize = new StudentSystemContext();

  try {
    // Read all courses from the database
    const allCourses = await Course.findAll();
    console.log('All Courses:', allCourses);

    // Read all students from the database
    const allStudents = await Student.findAll();
    console.log('All Students:', allStudents);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Uncomment the line below to run the seed method (fill the database with sample data)
// seed();

// Uncomment the line below to run the console application (read information about courses and students)
// main();
