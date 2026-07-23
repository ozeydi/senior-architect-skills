const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const OUTPUT = path.join(__dirname, '..', 'SKILLS_INDEX.md');

function extractFrontMatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { name: path.basename(path.dirname(filePath)), description: '' };

  const frontMatter = {};
  match[1].split('\n').forEach(line => {
    const sep = line.indexOf(':');
    if (sep > 0) {
      const key = line.slice(0, sep).trim();
      const value = line.slice(sep + 1).trim().replace(/^["']|["']$/g, '');
      frontMatter[key] = value;
    }
  });
  return frontMatter;
}

function generate() {
  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skills = entries.filter(e => e.isDirectory()).map(e => {
    const skillPath = path.join(SKILLS_DIR, e.name, 'SKILL.md');
    if (!fs.existsSync(skillPath)) return null;
    const meta = extractFrontMatter(skillPath);
    return { ...meta, dir: e.name };
  }).filter(Boolean);

  const lines = [
    '# Skills Index',
    '',
    `Auto-generated on ${new Date().toISOString().split('T')[0]}`,
    '',
    '## Available Skills',
    '',
  ];

  skills.forEach(s => {
    lines.push(`### ${s.name}`);
    lines.push('');
    lines.push(`**Description:** ${s.description || 'No description'}`);
    lines.push(`**Location:** \`skills/${s.dir}/SKILL.md\``);
    lines.push('');
  });

  lines.push('---');
  lines.push(`*${skills.length} skill(s) indexed.*`);

  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`Generated ${OUTPUT} with ${skills.length} skills.`);
}

generate();
