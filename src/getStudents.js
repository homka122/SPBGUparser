import fs from 'fs';
import path from 'path';

const SNILS = 'СНИЛС/Уникальный код поступающего';
const countOfTables = 474

let studentsAll = [];
let IDs = [];

for (let i = 0; i <= countOfTables; i++) {
  const students = JSON.parse(fs.readFileSync(path.resolve(`./src/out/output${i}.json`)))[0];
  students.forEach((student) => {
    // Add unique student to the list
    if (!IDs.includes(student[SNILS])) {
      IDs.push(student[SNILS]);
      studentsAll.push(student);
    }
  });
}

fs.writeFileSync(path.resolve('./src/students.json'), JSON.stringify(studentsAll));
