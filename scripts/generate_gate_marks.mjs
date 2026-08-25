import fs from 'fs';

// Read clean_extracted.json
const rawData = fs.readFileSync('clean_extracted.json', 'utf8');
const questions = JSON.parse(rawData);

function extractYear(yStr) {
  const m = (yStr || '').match(/\b(19\d{2}|20\d{2})\b/);
  return m ? parseInt(m[1], 10) : 2000;
}

function parseQNum(qNumStr) {
  if (typeof qNumStr === 'number') return qNumStr;
  const s = String(qNumStr).trim();
  // Check sectional: 1.x or 2.x or 3.x
  if (s.startsWith('1.') || s.startsWith('01.') || s.startsWith('1-') || s === '1') return 1;
  if (s.startsWith('2.') || s.startsWith('02.') || s.startsWith('2-') || s === '2') return 2;
  if (s.startsWith('3.') || s.startsWith('03.') || s.startsWith('3-') || s === '3') return 3;
  const num = parseFloat(s.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 1 : num;
}

function computeMarks(q) {
  const year = extractYear(q.year);
  const qNumRaw = String(q.question_number || '').trim();
  const isGA = (q.year || '').includes('| GA') || (q.subject || '').includes('Aptitude');

  // 1. General Aptitude (2010 - 2026)
  if (isGA) {
    const num = parseQNum(qNumRaw);
    if (num >= 56 && num <= 60) return 1;
    if (num >= 61 && num <= 65) return 2;
    if (num <= 5) return 1;
    if (num <= 10) return 2;
    return 1;
  }

  // 2. Sectional format (e.g. 1.3, 2.15, 01-iv, 02-iii)
  if (qNumRaw.startsWith('1.') || qNumRaw.startsWith('01.') || qNumRaw.startsWith('1-')) return 1;
  if (qNumRaw.startsWith('2.') || qNumRaw.startsWith('02.') || qNumRaw.startsWith('2-')) return 2;
  if (qNumRaw.startsWith('3.') || qNumRaw.startsWith('03.') || qNumRaw.startsWith('3-') || qNumRaw.startsWith('4.') || qNumRaw.startsWith('5.')) {
    if (year <= 1995) return 5;
    return 2;
  }

  const num = parseQNum(qNumRaw);

  // 3. GATE 2010 to 2026 (Standard 65 Questions)
  if (year >= 2010) {
    if (num >= 56 && num <= 60) return 1;
    if (num >= 61 && num <= 65) return 2;
    if (num <= 25) return 1;
    return 2;
  }

  // 4. GATE 2007 to 2009 (85 Questions: Q1-Q20: 1 mark, Q21-Q85: 2 marks)
  if (year >= 2007 && year <= 2009) {
    if (num <= 20) return 1;
    return 2;
  }

  // 5. GATE 2003 to 2006 (85-90 Questions: Q1-Q30: 1 mark, Q31+: 2 marks)
  if (year >= 2003 && year <= 2006) {
    if (num <= 30) return 1;
    return 2;
  }

  // 6. GATE 1996 to 2002 (Q1-Q30: 1 mark, Q31-Q80: 2 marks)
  if (year >= 1996 && year <= 2002) {
    if (num <= 30) return 1;
    if (num <= 80) return 2;
    return 5;
  }

  // 7. Early Era (1987 - 1995)
  if (num === 1) return 1;
  if (num === 2) return 2;
  if (num <= 20) return 1;
  if (num <= 30) return 2;
  return 5;
}

function computeQuestionType(q) {
  const year = extractYear(q.year);
  const qNumRaw = String(q.question_number || '').trim();
  const link = (q.link || '').toLowerCase();
  const text = (q.text || '').toLowerCase();

  // Descriptive check for 1987-1995 large subjective questions
  if (year <= 1995 && (qNumRaw.startsWith('3') || qNumRaw.startsWith('4') || qNumRaw.startsWith('5') || parseQNum(qNumRaw) > 20)) {
    return 'Descriptive';
  }

  // Before 2014, all objective GATE questions are MCQ
  if (year < 2014) {
    return 'MCQ';
  }

  // Check URL / text hints for MSQ / NAT
  if (link.includes('msq') || text.includes('msq') || link.includes('multiple-select') || text.includes('multiple select')) {
    return 'MSQ';
  }

  if (link.includes('nat') || text.includes('nat') || link.includes('numerical') || text.includes('numerical answer')) {
    return 'NAT';
  }

  // In 2014-2026, default to MCQ unless specified
  return 'MCQ';
}

const enrichedQuestions = questions.map((q) => {
  const marks = computeMarks(q);
  const type_of_question = computeQuestionType(q);

  return {
    subject: q.subject,
    topic: q.topic,
    link: q.link,
    year: q.year,
    question_number: q.question_number,
    text: q.text,
    marks,
    type_of_question,
  };
});

fs.writeFileSync('gate_marks.json', JSON.stringify(enrichedQuestions, null, 2), 'utf8');

console.log('Successfully generated gate_marks.json!');
console.log('Total questions:', enrichedQuestions.length);
console.log('Sample item 0:', enrichedQuestions[0]);
console.log('Sample item 100:', enrichedQuestions[100]);
console.log('Sample item 2000:', enrichedQuestions[2000]);

// Stats summary
const marksStats = {};
const typeStats = {};
enrichedQuestions.forEach((q) => {
  marksStats[`${q.marks} Mark(s)`] = (marksStats[`${q.marks} Mark(s)`] || 0) + 1;
  typeStats[q.type_of_question] = (typeStats[q.type_of_question] || 0) + 1;
});
console.log('Marks breakdown:', marksStats);
console.log('Question type breakdown:', typeStats);
