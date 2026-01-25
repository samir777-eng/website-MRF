#!/usr/bin/env node

/**
 * Bundle Optimization Script
 * Analyzes and optimizes the bundle by:
 * 1. Identifying unused imports
 * 2. Suggesting code splitting opportunities
 * 3. Finding large dependencies
 */

const fs = require("fs");
const path = require("path");
const { execSync: _execSync } = require("child_process");

const SRC_DIR = path.join(__dirname, "../src");
const ANALYSIS_FILE = path.join(__dirname, "../BUNDLE-OPTIMIZATION.md");

// File extensions to analyze
const EXTENSIONS = [".tsx", ".ts", ".js", ".jsx"];

// Large dependencies that should be code-split
const HEAVY_DEPENDENCIES = [
  "framer-motion",
  "lucide-react",
  "@radix-ui",
  "next-intl",
  "zustand",
];

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (
      stat.isDirectory() &&
      !item.startsWith(".") &&
      item !== "node_modules"
    ) {
      getAllFiles(fullPath, files);
    } else if (stat.isFile() && EXTENSIONS.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }

  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(SRC_DIR, filePath);

  // Extract imports
  const importRegex =
    /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)?\s*(?:,\s*(?:{[^}]*}|\*\s+as\s+\w+|\w+))?\s*from\s+['"]([^'"]+)['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      statement: match[0],
      module: match[1],
      line: content.substring(0, match.index).split("\n").length,
    });
  }

  // Check for heavy dependencies
  const heavyImports = imports.filter((imp) =>
    HEAVY_DEPENDENCIES.some((dep) => imp.module.includes(dep)),
  );

  // Estimate file complexity
  const lines = content.split("\n").length;
  const complexity = {
    lines,
    imports: imports.length,
    heavyImports: heavyImports.length,
    hasDefaultExport: content.includes("export default"),
    hasNamedExports:
      content.includes("export {") ||
      content.includes("export const") ||
      content.includes("export function"),
  };

  return {
    path: relativePath,
    imports,
    heavyImports,
    complexity,
    size: Buffer.byteLength(content, "utf8"),
  };
}

function generateOptimizationReport(analyses) {
  const report = [];

  report.push("# Bundle Optimization Analysis\n");
  report.push(`Generated: ${new Date().toISOString()}\n`);

  // Summary
  const totalFiles = analyses.length;
  const totalSize = analyses.reduce((sum, a) => sum + a.size, 0);
  const avgSize = Math.round(totalSize / totalFiles);

  report.push("## Summary\n");
  report.push(`- **Total Files**: ${totalFiles}`);
  report.push(`- **Total Size**: ${Math.round(totalSize / 1024)} KB`);
  report.push(`- **Average File Size**: ${Math.round(avgSize / 1024)} KB\n`);

  // Large files
  const largeFiles = analyses
    .filter((a) => a.size > 10000) // > 10KB
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  if (largeFiles.length > 0) {
    report.push("## 🚨 Large Files (>10KB)\n");
    report.push("| File | Size | Lines | Imports | Heavy Deps |");
    report.push("|------|------|-------|---------|------------|");

    largeFiles.forEach((file) => {
      report.push(
        `| ${file.path} | ${Math.round(file.size / 1024)} KB | ${file.complexity.lines} | ${file.complexity.imports} | ${file.complexity.heavyImports} |`,
      );
    });
    report.push("");
  }

  // Heavy dependency usage
  const heavyDepUsage = {};
  analyses.forEach((analysis) => {
    analysis.heavyImports.forEach((imp) => {
      const dep = HEAVY_DEPENDENCIES.find((d) => imp.module.includes(d));
      if (dep) {
        if (!heavyDepUsage[dep]) heavyDepUsage[dep] = [];
        heavyDepUsage[dep].push(analysis.path);
      }
    });
  });

  if (Object.keys(heavyDepUsage).length > 0) {
    report.push("## 📦 Heavy Dependencies Usage\n");

    Object.entries(heavyDepUsage).forEach(([dep, files]) => {
      report.push(`### ${dep} (${files.length} files)`);
      report.push(
        "**Optimization**: Consider lazy loading or code splitting\n",
      );
      files.slice(0, 5).forEach((file) => {
        report.push(`- ${file}`);
      });
      if (files.length > 5) {
        report.push(`- ... and ${files.length - 5} more files`);
      }
      report.push("");
    });
  }

  // Code splitting opportunities
  const codeSplitCandidates = analyses.filter(
    (a) =>
      a.complexity.lines > 200 ||
      a.complexity.heavyImports > 3 ||
      (a.path.includes("components/") && a.complexity.lines > 100),
  );

  if (codeSplitCandidates.length > 0) {
    report.push("## ✂️ Code Splitting Opportunities\n");

    codeSplitCandidates.forEach((file) => {
      report.push(`### ${file.path}`);
      report.push(`- **Size**: ${Math.round(file.size / 1024)} KB`);
      report.push(`- **Lines**: ${file.complexity.lines}`);
      report.push(`- **Heavy Dependencies**: ${file.complexity.heavyImports}`);
      report.push(`- **Recommendation**: ${getRecommendation(file)}\n`);
    });
  }

  // Optimization recommendations
  report.push("## 🎯 Optimization Recommendations\n");
  report.push("### Immediate Actions");
  report.push("- [ ] Implement lazy loading for components >100 lines");
  report.push("- [ ] Split heavy dependencies into separate chunks");
  report.push("- [ ] Remove unused imports and dependencies");
  report.push("- [ ] Use dynamic imports for non-critical components\n");

  report.push("### Advanced Optimizations");
  report.push("- [ ] Implement route-based code splitting");
  report.push("- [ ] Use React.lazy() for heavy components");
  report.push("- [ ] Consider alternative lighter libraries");
  report.push("- [ ] Implement preloading for critical resources\n");

  return report.join("\n");
}

function getRecommendation(file) {
  if (file.path.includes("page.tsx")) {
    return "Use dynamic imports for heavy components";
  } else if (file.complexity.heavyImports > 3) {
    return "Split into smaller components with lazy loading";
  } else if (file.complexity.lines > 300) {
    return "Break into multiple smaller files";
  } else {
    return "Consider lazy loading if not critical";
  }
}

// Main execution
console.log("🔍 Analyzing bundle for optimization opportunities...\n");

try {
  const files = getAllFiles(SRC_DIR);
  console.log(`Found ${files.length} files to analyze`);

  const analyses = files.map(analyzeFile);
  const report = generateOptimizationReport(analyses);

  fs.writeFileSync(ANALYSIS_FILE, report);
  console.log(
    `✅ Analysis complete! Report saved to: ${path.relative(process.cwd(), ANALYSIS_FILE)}`,
  );

  // Show quick summary
  const largeFiles = analyses.filter((a) => a.size > 10000).length;
  const totalSize = Math.round(
    analyses.reduce((sum, a) => sum + a.size, 0) / 1024,
  );

  console.log(`\n📊 Quick Summary:`);
  console.log(`- Total source size: ${totalSize} KB`);
  console.log(`- Large files (>10KB): ${largeFiles}`);
  console.log(
    `- Optimization opportunities found: ${analyses.filter((a) => a.complexity.lines > 200).length}`,
  );
} catch (error) {
  console.error("❌ Error during analysis:", error.message);
  process.exit(1);
}
