import { SaveData } from '../Data/SaveData';

  export interface IDataService {
    GetSaveFileList(): JQueryPromise<string[]>;
    SaveFile(filename:string, data:SaveData): JQueryPromise<any>;
    LoadFile(filename:string): JQueryPromise<SaveData>;
  }

