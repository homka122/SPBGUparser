import fs from 'fs';
import path from 'path';

const fields = {
  snils: 'СНИЛС/Уникальный код поступающего',
  type: 'Тип конкурса',
  sum: 'Σ ЕГЭ',
  vi1: 'ВИ 1',
  vi2: 'ВИ 2',
  vi3: 'ВИ 3',
  awards: 'Индивидуальные достижения',
};

// Input: student. Output: data of student
const parseStudent = (student) => {
  const snils = student[fields.snils];
  const type = student[fields.type];
  const sum = Number(student[fields.sum].replace(',', '.'));
  const vi1 = Number(student[fields.vi1]);
  const vi2 = Number(student[fields.vi2]);
  const vi3 = Number(student[fields.vi3]);
  const awards = student[fields.awards];

  return { snils, type, sum, vi1, vi2, vi3, awards };
};

const rawStudents = JSON.parse(fs.readFileSync(path.resolve('./src/students.json')));
const students = rawStudents.filter((student, id) => {
  const { type, sum, vi1, vi2, vi3, awards } = parseStudent(student);

  // Я заметил, что у некоторых абитуриентов сумма баллов не совпадает, поэтому произвел проверку
  const isStudentHaveTruePoints = sum === vi1 + vi2 + vi3;
  const isStudentEGE = type === 'По результатам ВИ';
  return isStudentHaveTruePoints && isStudentEGE;
});

let data = '';
// От нуля до 300 баллов без учета ИД
for (let i = 0; i <= 300; i++) {
  let peopleWithGTO = 0;
  let peopleWithAttestat = 0;
  let peopleWithGTOandAttestat = 0;

  const studentsWithPoints = students.filter((student) => {
    const { sum } = parseStudent(student);
    return sum === i;
  });

  const people = studentsWithPoints.length;

  studentsWithPoints.forEach((student) => {
    const { awards } = parseStudent(student);
    const isGTO = awards.indexOf('Значок ГТО (2)');
    const isAttestat = awards.indexOf('Аттестат с отличием (3)');
    if (isGTO >= 0) peopleWithGTO++;
    if (isAttestat >= 0) peopleWithAttestat++;
    if (isGTO >= 0 && isAttestat >= 0) peopleWithGTOandAttestat++;
  });

  if (people > 0) {
    data += `${i},${people},${(peopleWithGTO / people).toFixed(3)},${(peopleWithAttestat / people).toFixed(3)},${(
      peopleWithGTOandAttestat / people
    ).toFixed(3)}\n`;
  }
}

fs.writeFileSync(path.resolve('./src/out.csv'), data);
