#!/usr/bin/env node

/**
 * Performance Budget Monitor
 * Checks bundle sizes against defined budgets and reports violations
 */

const fs = require("fs");
const path = require("path");
const { execSync: _execSync } = require("child_process");

const BUDGET_FILE = path.join(__dirname, "../performance.budget.json");
const BUILD_DIR = path.join(__dirname, "../.next");
const REPORT_FILE = path.join(__dirname, "../PERFORMANCE-REPORT.md");

// Colors for console output
const colors = {
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadBudget() {
  try {
    return JSON.parse(fs.readFileSync(BUDGET_FILE, "utf8"));
  } catch (error) {
    log(`❌ Failed to load performance budget: ${error.message}`, "red");
    process.exit(1);
  }
}

function parseSize(sizeStr) {
  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(kb|mb|gb)?$/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = (match[2] || "b").toLowerCase();

  switch (unit) {
    case "gb":
      return value * 1024 * 1024 * 1024;
    case "mb":
      return value * 1024 * 1024;
    case "kb":
      return value * 1024;
    default:
      return value;
  }
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${bytes} B`;
  }
}

function getBuildStats() {
  const buildManifest = path.join(BUILD_DIR, "build-manifest.json");
  const appBuildManifest = path.join(BUILD_DIR, "app-build-manifest.json");

  if (!fs.existsSync(buildManifest)) {
    log(
      '❌ Build manifest not found. Please run "npm run build" first.',
      "red",
    );
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(buildManifest, "utf8"));
  const appManifest = fs.existsSync(appBuildManifest)
    ? JSON.parse(fs.readFileSync(appBuildManifest, "utf8"))
    : {};

  return { manifest, appManifest };
}

function analyzeChunks() {
  const staticDir = path.join(BUILD_DIR, "static");
  const chunks = [];

  if (!fs.existsSync(staticDir)) {
    return chunks;
  }

  function scanDirectory(dir, prefix = "") {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath, `${prefix}${item}/`);
      } else if (item.endsWith(".js") || item.endsWith(".css")) {
        chunks.push({
          name: `${prefix}${item}`,
          size: stat.size,
          type: item.endsWith(".js") ? "script" : "style",
        });
      }
    }
  }

  scanDirectory(staticDir);
  return chunks;
}

function checkBudgets(budget, chunks) {
  const violations = [];
  const warnings = [];

  // Calculate totals
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const scriptSize = chunks
    .filter((chunk) => chunk.type === "script")
    .reduce((sum, chunk) => sum + chunk.size, 0);

  // Check budget violations
  for (const budgetItem of budget.budgets) {
    let actualSize = 0;

    switch (budgetItem.type) {
      case "all":
        actualSize = totalSize;
        break;
      case "allScript":
        actualSize = scriptSize;
        break;
      case "initial":
        // Approximate initial bundle size (main chunks)
        actualSize = chunks
          .filter(
            (chunk) =>
              chunk.name.includes("main") || chunk.name.includes("runtime"),
          )
          .reduce((sum, chunk) => sum + chunk.size, 0);
        break;
    }

    const warningThreshold = parseSize(budgetItem.maximumWarning);
    const errorThreshold = parseSize(budgetItem.maximumError);

    if (actualSize > errorThreshold) {
      violations.push({
        type: budgetItem.type,
        actual: actualSize,
        threshold: errorThreshold,
        level: "error",
      });
    } else if (actualSize > warningThreshold) {
      warnings.push({
        type: budgetItem.type,
        actual: actualSize,
        threshold: warningThreshold,
        level: "warning",
      });
    }
  }

  return { violations, warnings, totalSize, scriptSize };
}

function generateReport(budget, chunks, analysis) {
  const report = [];
  const timestamp = new Date().toISOString();

  report.push("# Performance Budget Report\n");
  report.push(`Generated: ${timestamp}\n`);

  // Summary
  report.push("## Summary\n");
  report.push(`- **Total Bundle Size**: ${formatSize(analysis.totalSize)}`);
  report.push(`- **Script Size**: ${formatSize(analysis.scriptSize)}`);
  report.push(`- **Violations**: ${analysis.violations.length}`);
  report.push(`- **Warnings**: ${analysis.warnings.length}\n`);

  // Violations
  if (analysis.violations.length > 0) {
    report.push("## 🚨 Budget Violations\n");
    analysis.violations.forEach((violation) => {
      report.push(
        `- **${violation.type}**: ${formatSize(violation.actual)} (limit: ${formatSize(violation.threshold)})`,
      );
    });
    report.push("");
  }

  // Warnings
  if (analysis.warnings.length > 0) {
    report.push("## ⚠️ Budget Warnings\n");
    analysis.warnings.forEach((warning) => {
      report.push(
        `- **${warning.type}**: ${formatSize(warning.actual)} (warning: ${formatSize(warning.threshold)})`,
      );
    });
    report.push("");
  }

  // Largest chunks
  const largestChunks = chunks.sort((a, b) => b.size - a.size).slice(0, 10);

  if (largestChunks.length > 0) {
    report.push("## 📦 Largest Chunks\n");
    report.push("| File | Size | Type |");
    report.push("|------|------|------|");
    largestChunks.forEach((chunk) => {
      report.push(
        `| ${chunk.name} | ${formatSize(chunk.size)} | ${chunk.type} |`,
      );
    });
    report.push("");
  }

  // Recommendations
  report.push("## 🎯 Recommendations\n");

  if (analysis.violations.length > 0) {
    report.push("### Critical Actions Required");
    report.push("- [ ] Implement aggressive code splitting");
    report.push("- [ ] Remove unused dependencies");
    report.push("- [ ] Optimize heavy libraries");
    report.push("- [ ] Consider lazy loading for non-critical features\n");
  }

  if (analysis.warnings.length > 0) {
    report.push("### Optimization Opportunities");
    report.push("- [ ] Review and optimize large chunks");
    report.push("- [ ] Implement dynamic imports");
    report.push("- [ ] Consider tree shaking improvements");
    report.push("- [ ] Optimize asset loading strategy\n");
  }

  return report.join("\n");
}

// Main execution
function main() {
  log("🔍 Analyzing performance budget...", "blue");

  const budget = loadBudget();
  const chunks = analyzeChunks();
  const analysis = checkBudgets(budget, chunks);

  // Generate report
  const report = generateReport(budget, chunks, analysis);
  fs.writeFileSync(REPORT_FILE, report);

  // Console output
  log(`\n📊 Performance Analysis Complete`, "green");
  log(`- Total Bundle Size: ${formatSize(analysis.totalSize)}`);
  log(`- Script Size: ${formatSize(analysis.scriptSize)}`);

  if (analysis.violations.length > 0) {
    log(`\n🚨 ${analysis.violations.length} Budget Violations Found:`, "red");
    analysis.violations.forEach((violation) => {
      log(
        `  - ${violation.type}: ${formatSize(violation.actual)} (limit: ${formatSize(violation.threshold)})`,
        "red",
      );
    });
  }

  if (analysis.warnings.length > 0) {
    log(`\n⚠️  ${analysis.warnings.length} Budget Warnings:`, "yellow");
    analysis.warnings.forEach((warning) => {
      log(
        `  - ${warning.type}: ${formatSize(warning.actual)} (warning: ${formatSize(warning.threshold)})`,
        "yellow",
      );
    });
  }

  if (analysis.violations.length === 0 && analysis.warnings.length === 0) {
    log("\n✅ All performance budgets are within limits!", "green");
  }

  log(
    `\n📄 Detailed report saved to: ${path.relative(process.cwd(), REPORT_FILE)}`,
    "blue",
  );

  // Exit with error code if violations found
  if (analysis.violations.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, checkBudgets, analyzeChunks };
