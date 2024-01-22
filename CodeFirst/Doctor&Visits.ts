// Import necessary classes and functions
import * as readlineSync from 'readline-sync';

// Interface representing a database record for Medicament
interface MedicamentRecord {
  name: string;
}

// Interface representing a database record for Patient
interface PatientRecord {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  hasInsurance: boolean;
  visitations: VisitationRecord[];
  diagnoses: DiagnoseRecord[];
  prescriptions: MedicamentRecord[];
}

// Interface representing a database record for Visitation
interface VisitationRecord {
  date: Date;
  comments: string;
  doctor: DoctorRecord;  // Reference to the doctor associated with the visitation
}

// Interface representing a database record for Diagnose
interface DiagnoseRecord {
  name: string;
  comments: string;
}

// Interface representing a database record for Doctor
interface DoctorRecord {
  name: string;
  specialty: string;
}

// Class representing a visit made by a patient
class Visitation {
  constructor(public date: Date, public comments: string, public doctor: Doctor) {}
}

// Class representing a patient with personal details and medical history
class Patient {
  private visitations: Visitation[] = [];
  private diagnoses: Diagnose[] = [];
  private prescriptions: Medicament[] = [];

  constructor(
    public firstName: string,
    public lastName: string,
    public address: string,
    public email: string,
    public hasInsurance: boolean
  ) {}

  addVisitation(visitation: Visitation) {
    this.visitations.push(visitation);
  }

  addDiagnose(diagnose: Diagnose) {
    this.diagnoses.push(diagnose);
  }

  prescribeMedicament(medicament: Medicament) {
    this.prescriptions.push(medicament);
  }

  viewDetails() {
    console.log(
      `${this.firstName} ${this.lastName} - Address: ${this.address}, Email: ${this.email}, Insurance: ${this.hasInsurance}`
    );
    this.visitations.forEach((visit) => {
      console.log(`  Visitation: ${visit.date} - ${visit.comments} by Dr. ${visit.doctor.name}`);
    });
    this.diagnoses.forEach((diagnose) => console.log(`  Diagnose: ${diagnose.name} - ${diagnose.comments}`));
    this.prescriptions.forEach((medicament) => console.log(`  Prescription: ${medicament.name}`));
  }
}

// Class representing a hospital with a list of patients
class Hospital {
  private patients: Patient[] = [];

  addPatient(patient: Patient) {
    this.patients.push(patient);
  }

  viewPatients() {
    this.patients.forEach((patient) => {
      patient.viewDetails();
      console.log();
    });
  }
}

// Class representing a medical diagnosis for a patient
class Diagnose {
  constructor(public name: string, public comments: string) {}
}

// Class representing a prescribed medicament for a patient
class Medicament {
  constructor(public name: string) {}
}

// Class representing a doctor with a name and specialty
class Doctor {
  constructor(public name: string, public specialty: string) {}
}

// Main function to run the console-based user interface
function main() {
  const hospital = new Hospital();

  while (true) {
    const choice = readlineSync.keyInSelect(
      ['View Patients', 'Add Patient', 'Exit'],
      'Select an action:'
    );

    handleChoice(choice);
  }
}

// Handle user choice
function handleChoice(choice: number) {
  switch (choice) {
    case 0:
      hospital.viewPatients();
      break;
    case 1:
      const newPatient = createPatient();
      hospital.addPatient(newPatient);
      break;
    case 2:
      exitProgram();
  }
}

// Helper function to create a new patient based on user input
function createPatient(): Patient {
  const firstName = readlineSync.question('Enter first name: ');
  const lastName = readlineSync.question('Enter last name: ');
  const address = readlineSync.question('Enter address: ');
  const email = readlineSync.question('Enter email: ');
  const hasInsurance = readlineSync.keyInYNStrict('Has insurance?');

  return new Patient(firstName, lastName, address, email, hasInsurance);
}

// Helper function to exit the program
function exitProgram() {
  console.log('Exiting the program.');
  process.exit();
}

main();
