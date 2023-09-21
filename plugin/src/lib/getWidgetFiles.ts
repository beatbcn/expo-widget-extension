import * as fs from "fs";
import * as path from "path";

export type WidgetFiles = {
  swiftFiles: string[];
  entitlementFiles: string[];
  plistFiles: string[];
  assetDirectories: string[];
  intentFiles: string[];
  typeDefs: string[];
  otherFiles: string[];
};

export function getWidgetFiles(
  widgetsPath: string,
  targetPath: string,
  moduleFileName: string,
  attributesFileName: string
) {
  const widgetFiles: WidgetFiles = {
    swiftFiles: [],
    entitlementFiles: [],
    plistFiles: [],
    assetDirectories: [],
    intentFiles: [],
    typeDefs: [],
    otherFiles: [],
  };

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  if (fs.lstatSync(widgetsPath).isDirectory()) {
    const files = fs.readdirSync(widgetsPath);

    files.forEach((file) => {
      const fileExtension = file.split(".").pop();

      if (fileExtension === "swift") {
        if (file !== moduleFileName) {
          widgetFiles.swiftFiles.push(file);
        }
      } else if (fileExtension === "entitlements") {
        widgetFiles.entitlementFiles.push(file);
      } else if (fileExtension === "plist") {
        widgetFiles.plistFiles.push(file);
      } else if (fileExtension === "xcassets") {
        widgetFiles.assetDirectories.push(file);
      } else if (fileExtension === "intentdefinition") {
        widgetFiles.intentFiles.push(file);
      } else if (fileExtension === "d.ts") {
        widgetFiles.typeDefs.push(file);
      } else {
        widgetFiles.otherFiles.push(file);
      }
    });
  }
  // Copy Module.swift and Attributes.swift
  const modulePath = path.join(__dirname, "../../../ios");
  copyFileSync(
    path.join(widgetsPath, moduleFileName),
    path.join(modulePath, "Module.swift")
  );
  copyFileSync(
    path.join(widgetsPath, attributesFileName),
    path.join(modulePath, "Attributes.swift")
  );
  widgetFiles.typeDefs.forEach((typeDef) => {
    copyFileSync(
      path.join(widgetsPath, typeDef),
      path.join(modulePath, typeDef)
    );
  });

  return widgetFiles;
}

export function copyFileSync(source: string, target: string) {
  let targetFile = target;

  if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
    targetFile = path.join(target, path.basename(source));
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source: string, target: string) {
  const targetPath = path.join(target, path.basename(source));
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const currentPath = path.join(source, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        copyFolderRecursiveSync(currentPath, targetPath);
      } else {
        copyFileSync(currentPath, targetPath);
      }
    });
  }
}
