import fs from 'fs';

const gateMarks = JSON.parse(fs.readFileSync('gate_marks.json', 'utf8'));
const pyqQuestions = JSON.parse(fs.readFileSync('src/data/pyqQuestions.json', 'utf8'));

// Build lookup map by link and id
const marksMap = new Map();
gateMarks.forEach((item) => {
  marksMap.set(item.link, item);
});

const updated = pyqQuestions.map((q) => {
  const match = marksMap.get(q.link);
  return {
    ...q,
    marks: match ? match.marks : 1,
    type_of_question: match ? match.type_of_question : 'MCQ',
  };
});

fs.writeFileSync('src/data/pyqQuestions.json', JSON.stringify(updated, null, 2), 'utf8');
console.log('Successfully synced marks and question types into src/data/pyqQuestions.json!');
