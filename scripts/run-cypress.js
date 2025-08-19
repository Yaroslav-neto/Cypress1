const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const secretsPath = path.resolve(__dirname, '../secrets.json');

let key;
try {
  const data = fs.readFileSync(secretsPath, 'utf8');
  const json = JSON.parse(data);
  key = json.cypressRecordKey;
} catch (e) {
  console.error('Не удалось прочитать ключ', e.message);
  process.exit(1);
}

if (!key) {
  console.error('Ключ для Cypress не найден.');
  process.exit(1);
}

const cmd = `npx cypress run --record --key ${key}`;
console.log('Запуск команды:', cmd);
try {
  execSync(cmd, { stdio: 'inherit' });
} catch (e) {
  process.exit(e.status || 1);
}