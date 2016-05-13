import IUploadService = angular.angularFileUpload.IUploadService;
import IScope = angular.IScope;

// This stores our templates
angular.module('prodigi.fileupload.templates', []);

angular.module('prodigi.fileupload', [
    'prodigi.fileupload.templates',
    'ngFileUpload'
]);

angular.module('prodigi.fileupload').filter('bytes', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});

interface IPrdgFileUploadControllerBindings {
    url:string;
    files:any[];
    multiple:boolean;
}

interface IPrdgFileUploadController extends IPrdgFileUploadControllerBindings {
}

class UploadingFile{
    public file:File;
    public result:any;
    public progress:number;

    constructor(file: File, result?: any, progress?: number) {
        this.file = file;
        this.result = result ? result : null;
        this.progress = progress ? result : null;
    }
}


class PrdgFileUploadController implements IPrdgFileUploadController {

    public url:string;
    public files:any[];
    public multiple:boolean;
    public queue:File[];

    public uploading:UploadingFile[];

    private $scope:IScope;
    private $timeout:ITimeoutService;
    private Upload:IUploadService;

    static $inject = ['$scope', '$timeout', 'Upload'];

    constructor($scope:IScope, $timeout: ITimeoutService, Upload: IUploadService) {
        this.queue = [];
        this.uploading = [];

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.Upload = Upload;

        if (!this.url) {
            console.warn("prodigi.fileupload: No URL provided for file uploads.");
        }

        $scope.$watchCollection('vm.queue', (newVal:File[],oldVal:File[]) => {
            var newFiles = newVal.filter((x) => { return oldVal.indexOf(x) < 0 });
            console.log("got the following new files", newFiles);
            newFiles.forEach((file: File) => {
                this.upload(file);
            });
            this.queue = [];
        });
    }

    public upload(file:File):any {
        if (!this.url) {
            return;
        }
        var UFile = new UploadingFile(file);
        this.uploading.push(UFile);
        this.Upload.upload({
            data: {
                file: UFile.file
            },
            url: this.url,
            method: 'POST'
        }).then((response) => {
            this.$timeout(() => {
                UFile.result = response.data;
                var idx = this.uploading.indexOf(UFile);
                this.uploading.splice(idx, 1);
                if (this.multiple) {
                    this.files = this.files.concat(response.data);
                } else {
                    this.files = response.data;
                }
            })
        }, (response) => {
            if (response.status > 0) {
                console.log(response.status + ': ' + response.data);
            }
        }, (evt) => {
            UFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }
}

class PrdgFileUpload implements ng.IComponentOptions {

    public bindings:any;
    public templateUrl:string;
    public controller:Function;
    public controllerAs:string;

    constructor() {
        this.bindings = {
            files: '=',
            url: '<',
            multiple: '<'
        };
        this.templateUrl = '/prdgFileUpload/prdg-file-upload.html';
        this.controller = PrdgFileUploadController;
        this.controllerAs = 'vm';
    }
}

angular.module('prodigi.fileupload').component('prdgFileUpload', new PrdgFileUpload());



