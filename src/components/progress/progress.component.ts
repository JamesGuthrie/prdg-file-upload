interface IUploadProgressControllerBindings {
  file: UploadingFile;
}

interface IUploadProgressController extends IUploadProgressControllerBindings {
}

class UploadProgressController implements IUploadProgressController {

  public file: UploadingFile;

  constructor() {
    this.file = null;
  }
}

class UploadProgress implements ng.IComponentOptions {

  public bindings:any;
  public templateUrl:string;
  public controller:Function;
  public controllerAs:string;

  constructor() {
    this.bindings = {
      ufile: '<'
    };
    this.templateUrl = '/prdgFileUpload/components/progress/progress.html';
    this.controller = UploadProgressController;
    this.controllerAs = 'vm';
  }

}

angular.module('prodigi.fileupload').component('prdgFileUploadProgress', new UploadProgress());