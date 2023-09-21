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
      } else if (fileExtension === "ts") {
        widgetFiles.typeDefs.push(file);
      } else {
        widgetFiles.otherFiles.push(file);
      }
    });
  }
  // Copy Module.swift and Attributes.swift
  const iosModulePath = path.join(__dirname, "../../../ios");
  const tsModulePath = path.join(__dirname, "../../../src");
  copyFileSync(
    path.join(widgetsPath, moduleFileName),
    path.join(iosModulePath, "Module.swift")
  );
  copyFileSync(
    path.join(widgetsPath, attributesFileName),
    path.join(iosModulePath, "Attributes.swift")
  );
  widgetFiles.typeDefs.forEach((typeDef) => {
    copyFileSync(
      path.join(widgetsPath, typeDef),
      path.join(tsModulePath, typeDef)
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
