import { XcodeProject } from "@expo/config-plugins";

import { WidgetFiles } from "../lib/getWidgetFiles";

export function addPbxGroup(
  xcodeProject: XcodeProject,
  {
    targetName,
    widgetFiles,
    widgetsFolder,
  }: {
    targetName: string;
    widgetFiles: WidgetFiles;
    widgetsFolder: string;
  }
) {
  const {
    swiftFiles,
    intentFiles,
    otherFiles,
    assetDirectories,
    entitlementFiles,
    plistFiles,
  } = widgetFiles;

  // Add PBX group
  const { uuid: pbxGroupUuid } = xcodeProject.addPbxGroup(
    [
      ...swiftFiles,
      ...intentFiles,
      ...otherFiles,
      ...entitlementFiles,
      ...plistFiles,
      ...assetDirectories,
    ],
    targetName,
    `../${widgetsFolder}`
  );

  // Add PBXGroup to top level group
  const groups = xcodeProject.hash.project.objects["PBXGroup"];
  if (pbxGroupUuid) {
    Object.keys(groups).forEach(function (key) {
      if (groups[key].name === undefined && groups[key].path === undefined) {
        xcodeProject.addToPbxGroup(pbxGroupUuid, key);
      }
    });
  }
}
