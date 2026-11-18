import { faker } from "@faker-js/faker";

/**
 * Generate Malaysia TIN (Income Tax Number)
 */
export function generateMalaysiaTIN(type: "individual" | "company" = "company") {
  const prefixMap = {
    individual: "SG",
    company: "C",
  };

  const prefix = prefixMap[type];
  const number = faker.string.numeric(11);

  return `${prefix}${number}`;
}

// Store generated MyKad numbers to ensure uniqueness
const generatedMyKadSet = new Set<string>();

const professionCodes = ['AS', 'BS', 'CH', 'CS', 'DT', 'ODP', 'OR', 'OT', 'PA', 'PH', 'PO', 'RA', 'SL'];

export function generateHCPCNumber() {
  const code = faker.helpers.arrayElement(professionCodes);
  const digits = faker.string.numeric({ length: { min: 1, max: 6 } });
  return `${code}${digits}`;
}



export function generateMyKad(
  gender?: 'male' | 'female',
  hyphen: boolean = false
): string {
  let myKad: string;

  do {
    const date = faker.date.birthdate({ min: 18, max: 70, mode: 'age' });

    const yy = date.getFullYear().toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const pb = faker.number.int({ min: 1, max: 16 }).toString().padStart(2, '0');

    let lastDigit = faker.number.int({ min: 0, max: 9999 });

    // Gender rule: odd = male, even = female
    if (gender === 'male' && lastDigit % 2 === 0) lastDigit += 1;
    if (gender === 'female' && lastDigit % 2 !== 0) lastDigit += 1;

    const last = lastDigit.toString().padStart(4, '0');

    myKad = hyphen
      ? `${yy}${mm}${dd}-${pb}-${last}`
      : `${yy}${mm}${dd}${pb}${last}`;
  } while (generatedMyKadSet.has(myKad)); // Retry if duplicate

  generatedMyKadSet.add(myKad);
  return myKad;
}


export function generateDesignation() {
  const roles = ["Manager", "Executive", "Officer"];
  const prefixes = ["", "Assistant", "Senior"];

  const prefix = faker.helpers.arrayElement(prefixes);
  const role = faker.helpers.arrayElement(roles);

  return prefix ? `${prefix} ${role}` : role;
}

export function generateEPFNumber() {
  return faker.string.numeric(10);
}


export function generateStreetAddressMY() {
  const no = faker.number.int({ min: 1, max: 999 });
  const street = faker.location.street();
  const area = faker.location.city();

  return `${no}, ${street}, ${area}`;
}

/**
 * Full applicant dataset used for MOF registration edit flow
 */
export function generateApplicantData() {
  const localFaker = faker; // isolate usage

  return {
    fullName: localFaker.person.fullName(),
    myKad: generateMyKad(),
    epf: generateEPFNumber(),
    tin: generateMalaysiaTIN(),
    companyName: localFaker.company.name(),
    address:generateStreetAddressMY(),
    designation: generateDesignation(),
    institute: localFaker.company.name(),
    email: localFaker.internet.email(),
    phoneNumber: localFaker.phone.number(),
    professionalBody: generateHCPCNumber(),
  };
}