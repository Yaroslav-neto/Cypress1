const { spawn } = require('child_process');

let secrets;
try {
  secrets = require('../secrets.json');
} catch (e) {
  console.error('Не удалось загрузить secrets.json:', e);
  process.exit(1);
}
const key = secrets && secrets.cypressRecordKey;
if (!key) {
  console.error('Key не найден. Завершение.');
  process.exit(1);
}

// Генерация числового id (линейно растущего)
const baseId = Date.now(); // текущее время в миллисекундах
// При желании можно добавить немного рандома, но оставим как есть для повторяемости
const commonBuildId = baseId;

// Команды запуска
const cmd1 = `npx cypress run --browser chrome --spec 'cypress/e2e/tests.spec.cy.js' --group testSpec --ci-build-id ${commonBuildId} --record --key ${key}`;
const cmd2 = `npx cypress run --browser chrome --spec 'cypress/e2e/tests1.spec.cy.js' --group test1Spec --ci-build-id ${commonBuildId} --record --key ${key}`;

console.log('Запуск обоих тестов параллельно с одинаковым ci-build-id:', commonBuildId);

const p1 = spawn(cmd1, { shell: true, stdio: 'inherit' });
const p2 = spawn(cmd2, { shell: true, stdio: 'inherit' });

p1.on('close', (code) => {
  console.log(`Поток 1 завершён с кодом ${code}`);
});
p2.on('close', (code) => {
  console.log(`Поток 2 завершён с кодом ${code}`);
});

// Ожидание завершения обоих процессов
Promise.all([
  new Promise(res => p1.on('exit', res)),
  new Promise(res => p2.on('exit', res)),
]).then(() => {
  console.log('Оба теста завершены');
});