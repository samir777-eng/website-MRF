#!/usr/bin/env node

/**
 * Dependency Analysis Script
 * Analyzes package.json dependencies and suggests optimizations
 */

const fs = require("fs");
const path = require("path");
const { execSync: _execSync } = require("child_process");

const PACKAGE_JSON = path.join(__dirname, "../package.json");
const ANALYSIS_FILE = path.join(__dirname, "../DEPENDENCY-ANALYSIS.md");

// Known heavy dependencies and their lighter alternatives
const HEAVY_DEPS = {
  "framer-motion": {
    size: "~100KB",
    alternatives: [
      "react-spring",
      "CSS animations",
      "custom lightweight animations",
    ],
    impact: "High - Used for animations",
  },
  "lucide-react": {
    size: "~50KB",
    alternatives: [
      "heroicons",
      "react-icons (tree-shakable)",
      "custom SVG components",
    ],
    impact: "Medium - Icon library",
  },
  "@radix-ui/react-dropdown-menu": {
    size: "~30KB",
    alternatives: ["headlessui", "custom dropdown", "native select"],
    impact: "Medium - UI components",
  },
  "next-intl": {
    size: "~40KB",
    alternatives: ["react-i18next", "custom i18n solution"],
    impact: "Medium - Internationalization",
  },
  zustand: {
    size: "~15KB",
    alternatives: ["React Context", "jotai", "valtio"],
    impact: "Low - State management",
  },
};

function loadPackageJson() {
  try {
    return JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8"));
  } catch (error) {
    console.error(`❌ Failed to load package.json: ${error.message}`);
    process.exit(1);
  }
}

function analyzeDependencies(pkg) {
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  const analysis = {
    total: Object.keys(allDeps).length,
    heavy: [],
    unused: [],
    duplicates: [],
    recommendations: [],
  };

  // Check for heavy dependencies
  Object.keys(allDeps).forEach((dep) => {
    if (HEAVY_DEPS[dep]) {
      analysis.heavy.push({
        name: dep,
        version: allDeps[dep],
        ...HEAVY_DEPS[dep],
      });
    }
  });

  // Check for potential duplicates (similar functionality)
  const iconLibs = Object.keys(allDeps).filter(
    (dep) =>
      dep.includes("icon") ||
      dep.includes("lucide") ||
      dep.includes("heroicon"),
  );
  if (iconLibs.length > 1) {
    analysis.duplicates.push({
      type: "Icon Libraries",
      packages: iconLibs,
      recommendation: "Consider using only one icon library",
    });
  }

  const animationLibs = Object.keys(allDeps).filter(
    (dep) =>
      dep.includes("motion") ||
      dep.includes("spring") ||
      dep.includes("animate"),
  );
  if (animationLibs.length > 1) {
    analysis.duplicates.push({
      type: "Animation Libraries",
      packages: animationLibs,
      recommendation: "Consider using only one animation library",
    });
  }

  // Generate recommendations
  if (analysis.heavy.length > 0) {
    analysis.recommendations.push({
      priority: "High",
      action: "Replace heavy dependencies",
      details: "Consider lighter alternatives for animation and UI libraries",
    });
  }

  if (analysis.duplicates.length > 0) {
    analysis.recommendations.push({
      priority: "Medium",
      action: "Remove duplicate functionality",
      details: "Consolidate similar libraries to reduce bundle size",
    });
  }

  return analysis;
}

function generateReport(pkg, analysis) {
  const report = [];

  report.push("# Dependency Analysis Report\n");
  report.push(`Generated: ${new Date().toISOString()}\n`);

  // Summary
  report.push("## Summary\n");
  report.push(`- **Total Dependencies**: ${analysis.total}`);
  report.push(`- **Heavy Dependencies**: ${analysis.heavy.length}`);
  report.push(`- **Potential Duplicates**: ${analysis.duplicates.length}`);
  report.push(`- **Recommendations**: ${analysis.recommendations.length}\n`);

  // Heavy dependencies
  if (analysis.heavy.length > 0) {
    report.push("## 🚨 Heavy Dependencies\n");
    report.push("| Package | Version | Size | Impact | Alternatives |");
    report.push("|---------|---------|------|--------|--------------|");

    analysis.heavy.forEach((dep) => {
      const alternatives = Array.isArray(dep.alternatives)
        ? dep.alternatives.join(", ")
        : dep.alternatives;
      report.push(
        `| ${dep.name} | ${dep.version} | ${dep.size} | ${dep.impact} | ${alternatives} |`,
      );
    });
    report.push("");
  }

  // Duplicates
  if (analysis.duplicates.length > 0) {
    report.push("## 🔄 Potential Duplicates\n");

    analysis.duplicates.forEach((dup) => {
      report.push(`### ${dup.type}`);
      report.push(`**Packages**: ${dup.packages.join(", ")}`);
      report.push(`**Recommendation**: ${dup.recommendation}\n`);
    });
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    report.push("## 🎯 Optimization Recommendations\n");

    analysis.recommendations.forEach((rec, index) => {
      report.push(`### ${index + 1}. ${rec.action} (${rec.priority} Priority)`);
      report.push(`${rec.details}\n`);
    });
  }

  // Specific actions
  report.push("## 🔧 Immediate Actions\n");

  if (analysis.heavy.some((dep) => dep.name === "framer-motion")) {
    report.push("### Replace framer-motion");
    report.push("- [ ] Replace with lightweight CSS animations");
    report.push("- [ ] Use custom animation utilities");
    report.push("- [ ] Implement only necessary animations");
    report.push("- **Estimated savings**: ~100KB\n");
  }

  if (analysis.heavy.some((dep) => dep.name === "lucide-react")) {
    report.push("### Optimize icon usage");
    report.push("- [ ] Use tree-shakable icon imports");
    report.push("- [ ] Replace with smaller icon library");
    report.push("- [ ] Create custom SVG components for frequently used icons");
    report.push("- **Estimated savings**: ~30KB\n");
  }

  report.push("### General optimizations");
  report.push("- [ ] Enable tree shaking for all libraries");
  report.push("- [ ] Use dynamic imports for heavy components");
  report.push("- [ ] Consider code splitting by route");
  report.push("- [ ] Remove unused dependencies");
  report.push("- **Estimated total savings**: ~200KB+\n");

  return report.join("\n");
}

// Main execution
function main() {
  console.log("🔍 Analyzing dependencies...\n");

  const pkg = loadPackageJson();
  const analysis = analyzeDependencies(pkg);
  const report = generateReport(pkg, analysis);

  fs.writeFileSync(ANALYSIS_FILE, report);

  console.log("📊 Dependency Analysis Complete");
  console.log(`- Total dependencies: ${analysis.total}`);
  console.log(`- Heavy dependencies: ${analysis.heavy.length}`);
  console.log(`- Potential duplicates: ${analysis.duplicates.length}`);

  if (analysis.heavy.length > 0) {
    console.log("\n🚨 Heavy Dependencies Found:");
    analysis.heavy.forEach((dep) => {
      console.log(`  - ${dep.name}: ${dep.size} (${dep.impact})`);
    });
  }

  if (analysis.duplicates.length > 0) {
    console.log("\n🔄 Potential Duplicates:");
    analysis.duplicates.forEach((dup) => {
      console.log(`  - ${dup.type}: ${dup.packages.join(", ")}`);
    });
  }

  console.log(
    `\n📄 Detailed report saved to: ${path.relative(process.cwd(), ANALYSIS_FILE)}`,
  );
}

if (require.main === module) {
  main();
}

module.exports = { main, analyzeDependencies };
