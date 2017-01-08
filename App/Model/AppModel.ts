import { SkillNode } from '../Data/SkillNode';

export enum DialogType{
  Save = 1,
  Load = 2
}

export interface AppModel {
  // main properties
  name: string;
  rootNode: SkillNode;
  // gui properties
  displayNodes:SkillNode[];
  selectedNode: SkillNode;
  selectedElement: JQuery;
  showOverlay: boolean;
  showSavefileDialog: boolean;
  // save dialog propeties
  modified:boolean;
  savefileDialogType: DialogType;
  saveFiles: string[];
  selectedFilename: string;
}

