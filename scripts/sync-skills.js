const fs = require("fs");
const path = require("path");

const SKILLS_DIR = path.join(__dirname, "..", "skills");
const CONFIG_DIRS = [
  [".cursor", "claude-config.json"],
  [".cursor", "cline-config.json"],
  [".cursor", "rules", "cursor-skills.xml"],
  [".github", "copilot-instructions.md"],
];

function getSkillList() {
  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => ({
      name: e.name,
      path: `skills/${e.name}/SKILL.md`,
    }));
}

function sync() {
  const skills = getSkillList();
  console.log(`Found ${skills.length} skills:\n`);
  skills.forEach((s) => console.log(`  - ${s.name}`));

  console.log("\nSyncing configurations...");

  CONFIG_DIRS.forEach((parts) => {
    const target = path.join(__dirname, "..", ...parts);
    if (fs.existsSync(target)) {
      console.log(`  ✓ ${parts.join("/")} exists`);
    } else {
      console.log(`  ! ${parts.join("/")} not found (optional)`);
    }
  });

  console.log("\nSync complete.");
}

sync();
