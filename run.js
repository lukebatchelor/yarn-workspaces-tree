const printTree = require("print-tree");
const chalk = require("chalk").default;
const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const findYarnWorkspaceRoot = require("find-yarn-workspace-root");

const DEP_TYPES = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];

function getWorkspaces(dir) {
  const cwd = dir || process.cwd();
  const workspacesInfoStr = cp.execSync("yarn -s workspaces info", { cwd }).toString();
  const workspaces = JSON.parse(workspacesInfoStr);

  return workspaces;
}

function getExpandedWorkspaces(cwd, workspacesInfo) {
  const wsInfoClone = JSON.parse(JSON.stringify(workspacesInfo));
  const wsRoot = findYarnWorkspaceRoot(fakeWorkspacesPath);

  Object.entries(wsInfoClone).forEach(([wsName, wsInfo]) => {
    const workspacePackageJsonPath = path.join(wsRoot, wsInfo.location, "package.json");
    const workspaceNodeModulesPath = path.join(wsRoot, wsInfo.location, "node_modules");
    const pkgJsonStr = fs.readFileSync(workspacePkgJsonPath, "utf-8");
    const pkgJson = JSON.parse(pkgJsonStr);

    // We will calculate the workspace deps using the package.json
    const nonWorkspaceDeps = new Set();

    DEP_TYPES.forEach(depType => {
      if (!pkgJson[depType]) continue;
      Object.keys.(pkgJson[depType]).forEach(depName => nonWorkspaceDeps.add(depName));
    });

    wsInfoClone.nonWorkspaceDeps = Array.from(nonWorkspaceDeps);

    // And we'll calculate the mismatchedNonWorkspaceDeps using the file system. Otherwise we'd have
    // no way to know the actually resolved versions of the packages. This means our algorithm can't
    // ever not match yarn itself, but means users will need to do a clean and install before using
    // this info

    const mismatchedNonWorkspaceDeps = new Set();
    const workspaceNames = Object.keys(wsInfoClone);

    if (!fs.existsSync(workspaceNodeModulesPath)) continue;
    const nodeModulesPackages = fs.readdirSync(workspaceNodeModulesPath)
      .filter(dir => dir !== '.bin')
      .filter(dir => !workspaceNames.some(wsName => {

      }))

  });
}

const fakeWorkspacesPath = path.join(__dirname, "test-workspaces-repo", "packages", "foo");

const ws = getWorkspaces(fakeWorkspacesPath);
console.log(ws);

const customTree = {
  name: chalk.green("head"),
  children: [
    {
      name: "branchA",
      children: [{ name: "branchC" }]
    },
    { name: "branchB" }
  ]
};

printTree(customTree, node => node.name, node => node.children);
