interface IManageControllerBindings {
    files: File[];
}

interface IManageController extends IManageControllerBindings {
    removeFile(file:File):void;
}

class ManageController implements IManageController {

    public files: File[];

    constructor() {
       //this.files = [];
    }

    removeFile(file:File):void {
        var idx = this.files.indexOf(file);
        this.files.splice(idx, 1);
    }
}

class FileManage implements ng.IComponentOptions {

  public bindings:any;
  public templateUrl:string;
  public controller:Function;
  public controllerAs:string;

  constructor() {
    this.bindings = {
        files: '='
    };
    this.templateUrl = '/prdgFileUpload/components/manage/manage.html';
    this.controller = ManageController;
    this.controllerAs = 'vm';
  }

}

angular.module('prodigi.fileupload').component('prdgFileManage', new FileManage());