const fs = require('fs');
const path = require('path');

function parseCSV(content) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentField);
            currentField = '';
        } else if (char === '\n' && !inQuotes) {
            currentRow.push(currentField);
            rows.push(currentRow);
            currentRow = [];
            currentField = '';
        } else if (char === '\r' && !inQuotes) {
        } else {
            currentField += char;
        }
    }

    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }

    return rows;
}

const csvContent = fs.readFileSync(path.join(__dirname, '..', '사례집_데이터_전체.csv'), 'utf8');
const data = parseCSV(csvContent);

const cases = data.slice(1).map(row => ({
    id: parseInt(row[0]),
    category: row[1],
    title: row[2],
    situation: row[3],
    result: row[4],
    legalBasis: row[5],
    explanation: row[6],
    isProper: row[7] === '정당',
    story: row[8] || '',
    enemyName: row[9] || '',
    weaknessCard: row[10] || ''
}));

const jsContent = `// 105개 부적정집행 사례 데이터
// 자동 생성됨

export const cases = ${JSON.stringify(cases, null, 2)};

export const categories = [
  '인건비',
  '학생인건비',
  '연구시설장비비',
  '연구재료비',
  '연구활동비',
  '연구수당',
  '위탁연구개발비',
  '국제공동연구개발비',
  '간접비',
  '기타'
];

export const getCasesByCategory = (category) => {
  if (!category || category === '전체') return cases;
  return cases.filter(c => c.category === category);
};

export const getCaseById = (id) => cases.find(c => c.id === id);

export const searchCases = (query) => {
  const q = query.toLowerCase();
  return cases.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.situation.toLowerCase().includes(q) ||
    c.result.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q)
  );
};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'cases105.js'), jsContent, 'utf8');
console.log('cases105.js 생성 완료 - 총', cases.length, '개 사례');
