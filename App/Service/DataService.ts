import { SaveData } from '../Data/SaveData';
import { IDataService } from './IDataService';

export class DataService implements IDataService {

  constructor() { }                                                        

  public GetSaveFileList(): JQueryPromise<string[]>{
    return jsonQuery("./GetSavefileList.php", null);
  }

  public SaveFile(filename:string, saveData:SaveData): JQueryPromise<any>{
    return jsonQuery("./SaveFile.php?filename=" + filename, null, saveData);
  }

  public LoadFile(filename:string): JQueryPromise<SaveData>{
    return jsonQuery("./LoadFile.php?filename=" + filename, null);
  }

}

