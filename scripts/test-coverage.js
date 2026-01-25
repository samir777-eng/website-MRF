#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🧪 Running comprehensive test coverage analysis...\n");

// Test coverage thresholds
const COVERAGE_THRESHOLDS = {
  statements: 80,
  branches: 75,
  functions: 80,
  lines: 80,
};

// Run different types of tests
const testCommands = [
  {
    name: "Unit Tests",
    command: "npm run test:unit -- --coverage",
    description: "Testing individual components and utilities",
  },
  {
    name: "Integration Tests",
    command: "npm run test:integration -- --coverage",
    description: "Testing component interactions and API endpoints",
  },
  {
    name: "Accessibility Tests",
    command: "npm run test:accessibility -- --coverage",
    description: "Testing accessibility compliance and WCAG standards",
  },
];

// E2E tests (separate from coverage as they test the full app)
const e2eCommands = [
  {
    name: "E2E Tests",
    command: "npm run test:e2e",
    description: "End-to-end user journey testing",
  },
  {
    name: "Visual Regression Tests",
    command: "npm run test:visual",
    description: "Visual regression testing across devices",
  },
];

function runCommand(command, name) {
  console.log(`\n📋 Running ${name}...`);
  console.log(`Command: ${command}\n`);

  try {
    const output = execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
      timeout: 300000, // 5 minutes timeout
    });

    console.log(`✅ ${name} completed successfully\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} failed:`);
    console.error(error.message);
    return false;
  }
}

function analyzeCoverage() {
  console.log("\n📊 Analyzing test coverage...\n");

  const coverageDir = path.join(process.cwd(), "coverage");
  const coverageFile = path.join(coverageDir, "coverage-summary.json");

  if (!fs.existsSync(coverageFile)) {
    console.log(
      "⚠️  Coverage summary not found. Make sure tests ran with --coverage flag.",
    );
    return;
  }

  try {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, "utf8"));
    const total = coverage.total;

    console.log("📈 Coverage Summary:");
    console.log("==================");
    console.log(
      `Statements: ${total.statements.pct}% (${total.statements.covered}/${total.statements.total})`,
    );
    console.log(
      `Branches: ${total.branches.pct}% (${total.branches.covered}/${total.branches.total})`,
    );
    console.log(
      `Functions: ${total.functions.pct}% (${total.functions.covered}/${total.functions.total})`,
    );
    console.log(
      `Lines: ${total.lines.pct}% (${total.lines.covered}/${total.lines.total})\n`,
    );

    // Check against thresholds
    const results = {
      statements: total.statements.pct >= COVERAGE_THRESHOLDS.statements,
      branches: total.branches.pct >= COVERAGE_THRESHOLDS.branches,
      functions: total.functions.pct >= COVERAGE_THRESHOLDS.functions,
      lines: total.lines.pct >= COVERAGE_THRESHOLDS.lines,
    };

    console.log("🎯 Threshold Analysis:");
    console.log("=====================");

    Object.entries(results).forEach(([metric, passed]) => {
      const actual = total[metric].pct;
      const threshold = COVERAGE_THRESHOLDS[metric];
      const status = passed ? "✅" : "❌";
      const diff = actual - threshold;

      console.log(
        `${status} ${metric}: ${actual}% (threshold: ${threshold}%, ${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%)`,
      );
    });

    const allPassed = Object.values(results).every(Boolean);

    if (allPassed) {
      console.log("\n🎉 All coverage thresholds met!");
    } else {
      console.log(
        "\n⚠️  Some coverage thresholds not met. Consider adding more tests.",
      );
    }

    return allPassed;
  } catch (error) {
    console.error("❌ Error analyzing coverage:", error.message);
    return false;
  }
}

function generateCoverageReport() {
  console.log("\n📄 Generating detailed coverage report...");

  try {
    // Generate HTML coverage report
    execSync("npx c8 report --reporter=html", { stdio: "inherit" });

    const reportPath = path.join(process.cwd(), "coverage", "index.html");
    if (fs.existsSync(reportPath)) {
      console.log(`✅ HTML coverage report generated: ${reportPath}`);
      console.log(
        "   Open this file in your browser to view detailed coverage information.",
      );
    }

    // Generate LCOV report for CI/CD
    execSync("npx c8 report --reporter=lcov", { stdio: "inherit" });
    console.log("✅ LCOV coverage report generated for CI/CD integration.");
  } catch (error) {
    console.error("❌ Error generating coverage report:", error.message);
  }
}

function findUncoveredFiles() {
  console.log("\n🔍 Identifying uncovered files...\n");

  const srcDir = path.join(process.cwd(), "src");
  const coverageDir = path.join(process.cwd(), "coverage");

  if (!fs.existsSync(coverageDir)) {
    console.log("⚠️  Coverage directory not found.");
    return;
  }

  // This is a simplified version - in practice, you'd parse the coverage data
  console.log("📝 Recommendations for improving coverage:");
  console.log("=========================================");
  console.log("1. Add tests for utility functions in src/lib/");
  console.log("2. Test error handling in API routes");
  console.log("3. Add integration tests for complex user flows");
  console.log("4. Test edge cases and error states");
  console.log("5. Add tests for accessibility features");
  console.log("6. Test responsive design breakpoints");
}

async function main() {
  console.log("🚀 MRF Educational Platform - Comprehensive Test Suite");
  console.log("=====================================================\n");

  let allTestsPassed = true;

  // Run unit and integration tests with coverage
  for (const test of testCommands) {
    console.log(`📝 ${test.description}`);
    const success = runCommand(test.command, test.name);
    if (!success) {
      allTestsPassed = false;
    }
  }

  // Analyze coverage
  const coverageThresholdsMet = analyzeCoverage();

  // Generate detailed reports
  generateCoverageReport();

  // Find areas for improvement
  findUncoveredFiles();

  // Run E2E tests (without coverage as they test the full application)
  console.log("\n🌐 Running End-to-End Tests...");
  console.log("==============================");

  for (const test of e2eCommands) {
    console.log(`📝 ${test.description}`);
    const success = runCommand(test.command, test.name);
    if (!success) {
      allTestsPassed = false;
    }
  }

  // Final summary
  console.log("\n📋 Test Suite Summary");
  console.log("====================");

  if (allTestsPassed && coverageThresholdsMet) {
    console.log("🎉 All tests passed and coverage thresholds met!");
    console.log("✅ The application is ready for deployment.");
    process.exit(0);
  } else {
    console.log("⚠️  Some tests failed or coverage thresholds not met.");
    console.log(
      "❌ Please review the results and fix issues before deployment.",
    );
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Test suite execution failed:", error);
    process.exit(1);
  });
}

module.exports = {
  runCommand,
  analyzeCoverage,
  generateCoverageReport,
  COVERAGE_THRESHOLDS,
};
