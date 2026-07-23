const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

let exitCode = 0;

function validateSkill(dir) {
  const skillDir = path.join(SKILLS_DIR, dir);
  const skillFile = path.join(skillDir, 'SKILL.md');

  if (!fs.existsSync(skillFile)) {
    console.error(`  ✗ Missing SKILL.md in ${dir}`);
    exitCode = 1;
    return;
  }

  const content = fs.readFileSync(skillFile, 'utf8');

  if (!content.startsWith('---\n')) {
    console.error(`  ✗ ${dir}/SKILL.md missing frontmatter (---)`);
    exitCode = 1;
  }

  const hasName = /^name:\s*\S+/m.test(content);
  if (!hasName) {
    console.error(`  ✗ ${dir}/SKILL.md missing 'name' in frontmatter`);
    exitCode = 1;
  }

  const hasDescription = /^description:\s*\S+/m.test(content);
  if (!hasDescription) {
    console.error(`  ✗ ${dir}/SKILL.md missing 'description' in frontmatter`);
    exitCode = 1;
  }

  if (content.trim().length < 100) {
    console.error(`  ✗ ${dir}/SKILL.md is too short (< 100 chars)`);
    exitCode = 1;
  }

  console.log(`  ✓ ${dir}/SKILL.md`);
}

function validate() {
  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);

  if (dirs.length === 0) {
    console.error('No skill directories found.');
    exitCode = 1;
  }

  console.log(`Validating ${dirs.length} skill(s)...\n`);
  dirs.forEach(validateSkill);

  if (exitCode === 0) {
    console.log('\nAll skills valid.');
  } else {
    console.log('\nSome skills failed validation.');
  }

  process.exit(exitCode);
}

validate();
