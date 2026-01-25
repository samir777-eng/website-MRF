#!/usr/bin/env node

/**
 * Comprehensive Code Quality Check Script
 * Runs all quality checks and generates a report
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

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

function runCommand(command, description) {
  log(`\n🔍 ${description}...`, "blue");
  try {
    const output = execSync(command, {
      encoding: "utf8",
      stdio: "pipe",
      cwd: process.cwd(),
    });
    log(`✅ ${description} passed`, "green");
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} failed`, "red");
    return { success: false, output: error.stdout || error.message };
  }
}

function generateQualityReport(results) {
  const report = [];
  const timestamp = new Date().toISOString();

  report.push("# Code Quality Report\n");
  report.push(`Generated: ${timestamp}\n`);

  // Summary
  const passed = results.filter((r) => r.success).length;
  const total = results.length;
  const score = Math.round((passed / total) * 100);

  report.push("## Summary\n");
  report.push(`- **Quality Score**: ${score}%`);
  report.push(`- **Checks Passed**: ${passed}/${total}`);
  report.push(
    `- **Status**: ${score >= 80 ? "✅ Good" : score >= 60 ? "⚠️ Needs Improvement" : "❌ Poor"}\n`,
  );

  // Detailed results
  report.push("## Detailed Results\n");

  results.forEach((result) => {
    const status = result.success ? "✅" : "❌";
    report.push(`### ${status} ${result.name}`);

    if (!result.success && result.output) {
      report.push("```");
      report.push(result.output.slice(0, 1000)); // Limit output length
      if (result.output.length > 1000) {
        report.push("... (truncated)");
      }
      report.push("```");
    }
    report.push("");
  });

  // Recommendations
  report.push("## 🎯 Recommendations\n");

  const failedChecks = results.filter((r) => !r.success);
  if (failedChecks.length === 0) {
    report.push(
      "🎉 All quality checks passed! Your code is in excellent shape.\n",
    );
  } else {
    report.push("### Priority Actions\n");
    failedChecks.forEach((check) => {
      report.push(`- **${check.name}**: ${getRecommendation(check.name)}`);
    });
    report.push("");
  }

  return report.join("\n");
}

function getRecommendation(checkName) {
  const recommendations = {
    "TypeScript Check": "Fix type errors to ensure type safety",
    ESLint: "Address linting issues for code consistency",
    Prettier: "Format code according to project standards",
    Tests: "Fix failing tests or add missing test coverage",
    Build: "Resolve build errors to ensure deployability",
    "Security Audit": "Update dependencies with security vulnerabilities",
  };

  return recommendations[checkName] || "Review and fix the reported issues";
}

// Main execution
async function main() {
  log("🚀 Starting comprehensive code quality check...", "blue");

  const checks = [
    {
      name: "TypeScript Check",
      command: "npm run type-check",
      description: "Checking TypeScript types",
    },
    {
      name: "ESLint",
      command: "npx eslint src --ext .ts,.tsx --max-warnings 0",
      description: "Running ESLint",
    },
    {
      name: "Prettier",
      command: "npm run format:check",
      description: "Checking code formatting",
    },
    {
      name: "Tests",
      command: "npm run test -- --run --reporter=verbose",
      description: "Running tests",
    },
    {
      name: "Build",
      command: "npm run build",
      description: "Testing production build",
    },
    {
      name: "Security Audit",
      command: "npm audit --audit-level moderate",
      description: "Checking for security vulnerabilities",
    },
  ];

  const results = [];

  for (const check of checks) {
    const result = runCommand(check.command, check.description);
    results.push({
      name: check.name,
      success: result.success,
      output: result.output,
    });
  }

  // Generate report
  const report = generateQualityReport(results);
  const reportPath = path.join(process.cwd(), "QUALITY-REPORT.md");
  fs.writeFileSync(reportPath, report);

  // Summary
  const passed = results.filter((r) => r.success).length;
  const total = results.length;
  const score = Math.round((passed / total) * 100);

  log(`\n📊 Quality Check Complete`, "blue");
  log(
    `Score: ${score}% (${passed}/${total} checks passed)`,
    score >= 80 ? "green" : score >= 60 ? "yellow" : "red",
  );
  log(`Report saved to: ${path.relative(process.cwd(), reportPath)}`, "blue");

  // Exit with appropriate code
  if (score < 60) {
    log("\n❌ Quality check failed. Please address the issues above.", "red");
    process.exit(1);
  } else if (score < 80) {
    log(
      "\n⚠️ Quality check passed with warnings. Consider addressing the issues.",
      "yellow",
    );
  } else {
    log("\n✅ Quality check passed! Code is in good shape.", "green");
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Quality check failed:", error);
    process.exit(1);
  });
}

module.exports = { main };
