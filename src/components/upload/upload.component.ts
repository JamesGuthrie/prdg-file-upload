import ITimeoutService = angular.ITimeoutService;
interface IFileSelectControllerBindings {
    queue: File[];
    multiple: boolean;
}


interface IFileSelectController extends IFileSelectControllerBindings {
    enqueue(files: File[]):any;
}

class FileSelectController implements IFileSelectController {

    public queue: File[];
    public multiple: boolean;
    public $timeout: ITimeoutService;

    private Upload: IUploadService;

    static $inject = ['$timeout'];

    constructor($timeout: ITimeoutService) {
        this.queue = [];
        this.$timeout = $timeout;
    }

    public enqueue(files: File[]):void {
        files.forEach((file) => {
            console.log(file);
            this.queue.push(file);
        });
    }
}

class FileSelect implements ng.IComponentOptions {

    public bindings:any;
    public templateUrl:string;
    public controller:Function;
    public controllerAs:string;

    constructor() {
        this.bindings = {
            queue: '=',
            multiple: '<'
        };
        this.templateUrl = '/prdgFileUpload/components/upload/upload.html';
        this.controller = FileSelectController;
        this.controllerAs = 'vm';
    }
}

angular.module('prodigi.fileupload').component('prdgFileSelect', new FileSelect());