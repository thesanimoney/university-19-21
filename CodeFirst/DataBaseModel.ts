import * as readlineSync from 'readline-sync';

// Represents a visit made by a patient
class Visit {
  constructor(public date: Date, public comments: string) {}
}

// Represents a medical diagnosis for a patient
class Diagnose {
  constructor(public name: string, public comments: string) {}
}

// Represents a prescribed medicament for a patient
class Medicament {
  constructor(public name: string) {}
}

// Represents a patient with personal details and medical history
class Patient {
  private visits: Visit[] = [];           // List of visits made by the patient
  private diagnoses: Diagnose[] = [];     // List of medical diagnoses for the patient
  private prescriptions: Medicament[] = [];  // List of prescribed medicaments for the patient

  constructor(
    public firstName: string,
    public lastName: string,
    public address: string,
    public email: string,
    public hasInsurance: boolean
  ) {}

  // Adds a visit to the patient's medical history
  addVisit(visit: Visit) {
    this.visits.push(visit);
  }

  // Adds a medical diagnosis to the patient's medical history
  addDiagnose(diagnose: Diagnose) {
    this.diagnoses.push(diagnose);
  }

  // Prescribes a medicament to the patient
  prescribeMedicament(medicament: Medicament) {
    this.prescriptions.push(medicament);
  }

  // Displays detailed information about the patient, including medical history
  viewDetails() {
    console.log(
      `${this.firstName} ${this.lastName} - Address: ${this.address}, Email: ${this.email}, Insurance: ${this.hasInsurance}`
    );
    this.visits.forEach((visit) => console.log(`  Visit: ${visit.date} - ${visit.comments}`));
    this.diagnoses.forEach((diagnose) => console.log(`  Diagnose: ${diagnose.name} - ${diagnose.comments}`));
    this.prescriptions.forEach((medicament) => console.log(`  Prescription: ${medicament.name}`));
  }
}

// Represents a hospital with a list of patients
class Hospital {
  private patients: Patient[] = [];

  // Adds a new patient to the hospital
  addPatient(patient: Patient) {
    this.patients.push(patient);
  }

  // Displays details of all patients in the hospital
  viewPatients() {
    this.patients.forEach((patient) => {
      patient.viewDetails();
      console.log();
    });
  }
}

// Main function to run the console-based user interface
function main() {
  const hospital = new Hospital();

  while (true) {
    const choice = readlineSync.keyInSelect(
      ['View Patients', 'Add Patient', 'Exit'],
      'Select an action:'
    );

    switch (choice) {
      case 0:
        hospital.viewPatients();
        break;
      case 1:
        const newPatient = createPatient();
        hospital.addPatient(newPatient);
        break;
      case 2:
        process.exit();
    }
  }
}

// Helper function to create a new patient based on user input
function createPatient(): Patient {
  const firstName = readlineSync.question('Enter first name: ');
  const lastName = readlineSync.question('Enter last name: ');
  const address = readlineSync.question('Enter address: ');
  cons
