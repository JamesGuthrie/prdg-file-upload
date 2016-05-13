// This stores our templates
angular.module('prodigi.fileupload.templates', []);
angular.module('prodigi.fileupload', [
    'prodigi.fileupload.templates',
    'ngFileUpload'
]);
angular.module('prodigi.fileupload').filter('bytes', function () {
    return function (bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes))
            return '-';
        if (typeof precision === 'undefined')
            precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'], number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };
});
var UploadingFile = (function () {
    function UploadingFile(file, result, progress) {
        this.file = file;
        this.result = result ? result : null;
        this.progress = progress ? result : null;
    }
    return UploadingFile;
}());
var PrdgFileUploadController = (function () {
    function PrdgFileUploadController($scope, $timeout, Upload) {
        var _this = this;
        this.queue = [];
        this.uploading = [];
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.Upload = Upload;
        if (!this.url) {
            console.warn("prodigi.fileupload: No URL provided for file uploads.");
        }
        $scope.$watchCollection('vm.queue', function (newVal, oldVal) {
            var newFiles = newVal.filter(function (x) { return oldVal.indexOf(x) < 0; });
            console.log("got the following new files", newFiles);
            newFiles.forEach(function (file) {
                _this.upload(file);
            });
            _this.queue = [];
        });
    }
    PrdgFileUploadController.prototype.upload = function (file) {
        var _this = this;
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
        }).then(function (response) {
            _this.$timeout(function () {
                UFile.result = response.data;
                var idx = _this.uploading.indexOf(UFile);
                _this.uploading.splice(idx, 1);
                if (_this.multiple) {
                    _this.files = _this.files.concat(response.data);
                }
                else {
                    _this.files = response.data;
                }
            });
        }, function (response) {
            if (response.status > 0) {
                console.log(response.status + ': ' + response.data);
            }
        }, function (evt) {
            UFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };
    PrdgFileUploadController.$inject = ['$scope', '$timeout', 'Upload'];
    return PrdgFileUploadController;
}());
var PrdgFileUpload = (function () {
    function PrdgFileUpload() {
        this.bindings = {
            files: '=',
            url: '<',
            multiple: '<'
        };
        this.templateUrl = '/prdgFileUpload/prdg-file-upload.html';
        this.controller = PrdgFileUploadController;
        this.controllerAs = 'vm';
    }
    return PrdgFileUpload;
}());
angular.module('prodigi.fileupload').component('prdgFileUpload', new PrdgFileUpload());
//# sourceMappingURL=prdg-file-upload.js.map
var ManageController = (function () {
    function ManageController() {
        //this.files = [];
    }
    ManageController.prototype.removeFile = function (file) {
        var idx = this.files.indexOf(file);
        this.files.splice(idx, 1);
    };
    return ManageController;
}());
var FileManage = (function () {
    function FileManage() {
        this.bindings = {
            files: '='
        };
        this.templateUrl = '/prdgFileUpload/components/manage/manage.html';
        this.controller = ManageController;
        this.controllerAs = 'vm';
    }
    return FileManage;
}());
angular.module('prodigi.fileupload').component('prdgFileManage', new FileManage());
//# sourceMappingURL=manage.component.js.map
var UploadProgressController = (function () {
    function UploadProgressController() {
        this.file = null;
    }
    return UploadProgressController;
}());
var UploadProgress = (function () {
    function UploadProgress() {
        this.bindings = {
            ufile: '<'
        };
        this.templateUrl = '/prdgFileUpload/components/progress/progress.html';
        this.controller = UploadProgressController;
        this.controllerAs = 'vm';
    }
    return UploadProgress;
}());
angular.module('prodigi.fileupload').component('prdgFileUploadProgress', new UploadProgress());
//# sourceMappingURL=progress.component.js.map
var FileSelectController = (function () {
    function FileSelectController($timeout) {
        this.queue = [];
        this.$timeout = $timeout;
    }
    FileSelectController.prototype.enqueue = function (files) {
        var _this = this;
        files.forEach(function (file) {
            console.log(file);
            _this.queue.push(file);
        });
    };
    FileSelectController.$inject = ['$timeout'];
    return FileSelectController;
}());
var FileSelect = (function () {
    function FileSelect() {
        this.bindings = {
            queue: '=',
            multiple: '<'
        };
        this.templateUrl = '/prdgFileUpload/components/upload/upload.html';
        this.controller = FileSelectController;
        this.controllerAs = 'vm';
    }
    return FileSelect;
}());
angular.module('prodigi.fileupload').component('prdgFileSelect', new FileSelect());
//# sourceMappingURL=upload.component.js.map
angular.module("prodigi.fileupload.templates").run(["$templateCache", function($templateCache) {$templateCache.put("/prdgFileUpload/prdg-file-upload.html","<div>\n    <prdg-file-manage files=\"vm.files\"></prdg-file-manage>\n    <div ng-repeat=\"file in vm.uploading\">\n        <prdg-file-upload-progress ufile=\"file\"></prdg-file-upload-progress>\n    </div>\n    <prdg-file-select queue=\"vm.queue\" multiple=\"vm.multiple\"></prdg-file-select>\n</div>");
$templateCache.put("/prdgFileUpload/components/manage/manage.html","<table class=\"table\">\n    <thead>\n    <tr><th>File Name</th><th>File Size</th><th class=\"text-right\">Action</th></tr>\n    </thead>\n    <tbody>\n    <tr ng-repeat=\"file in vm.files\">\n        <td><a href=\"{{file.download_url}}\">{{file.name}}</a></td>\n        <td>{{file.file_size | bytes}}</td>\n        <td class=\"text-right\">\n            <a class=\"btn btn-sm btn-primary\" href=\"{{file.download_url}}\" target=\"_blank\"><i class=\"glyphicon glyphicon-save\"></i> Download</a>\n            <a class=\"btn btn-sm btn-danger\" ng-click=\"vm.removeFile(file)\"><i class=\"glyphicon glyphicon-remove\"></i> Remove</a>\n        </td>\n    </tr>\n    </tbody>\n</table>\n<div class=\"row\" >\n    <div class=\"col-sm-8\"></div>\n    <div class=\"col-sm-4\"></div>\n</div>\n");
$templateCache.put("/prdgFileUpload/components/progress/progress.html","<div class=\"row mb\">\n    <!--\n    <div class=\"col-sm-4 mb-sm\">\n        <label title=\"{{ \'modules.upload.field.preview\' | translate }}\" class=\"text-info\">\n            {{\'modules.upload.field.preview\' | translate }}\n        </label>\n        <img ngf-src=\"vm.ufile.file\" class=\"img-thumbnail img-responsive\">\n        <div class=\"img-placeholder\"\n             ng-if=\"vm.ufile.file.$invalid && !vm.ufile.file.blobUrl\">\n            No preview available\n        </div>\n    </div>\n    -->\n\n    <div class=\"col-sm-8\">\n        <div class=\"filename\" title=\"{{ vm.ufile.file.name }}\">{{ vm.ufile.file.name }}</div>\n    </div>\n    <div class=\"col-sm-4\">\n        <div class=\"progress-bar\" role=\"progressbar\"\n             ng-class=\"{\'progress-bar-success\': vm.ufile.progress == 100}\"\n             ng-style=\"{width: vm.ufile.progress + \'%\'}\">\n            {{ vm.ufile.progress }} %\n        </div>\n    </div>\n\n</div>\n<!--\n<div ng-messages=\"uploadForm.$error\" ng-messages-multiple=\"\">\n    <div class=\"text-danger errorMsg\" ng-message=\"maxSize\">{{ form.schema[file.$error].validationMessage | translate }} <strong>{{file.$errorParam}}</strong>. ({{ form.schema[file.$error].validationMessage2 | translate }} <strong>{{file.size / 1000000|number:1}}MB</strong>)</div>\n    <div class=\"text-danger errorMsg\" ng-message=\"pattern\">{{ form.schema[file.$error].validationMessage | translate }} <strong>{{file.$errorParam}}</strong></div>\n    <div class=\"text-danger errorMsg\" ng-message=\"maxItems\">{{ form.schema[file.$error].validationMessage | translate }} <strong>{{file.$errorParam}}</strong></div>\n    <div class=\"text-danger errorMsg\" ng-message=\"minItems\">{{ form.schema[file.$error].validationMessage | translate }} <strong>{{file.$errorParam}}</strong></div>\n    <div class=\"text-danger errorMsg\" ng-show=\"errorMsg\">{{errorMsg}}</div>\n</div>\n-->\n");
$templateCache.put("/prdgFileUpload/components/upload/upload.html","<div class=\"bg-white mb\" ng-class=\"{\'has-error border-danger\': (uploadForm.$error.required) || (hasError() && errorMessage(schemaError()))}\">\n    <small class=\"text-muted\" ng-show=\"form.description\" ng-bind-html=\"form.description\"></small>\n    <div ngf-drop=\"vm.enqueue($files)\" ngf-select=\"vm.enqueue($files)\" type=\"file\" ngf-multiple=\"vm.multiple\"\n         name=\"file\"  ng-required=\"vm.required\"\n         ngf-drag-over-class=\"dragover\" class=\"drop-box dragAndDropDescription\">\n        <p class=\"text-center\" ng-if=\"!vm.multiple\">{{ \'modules.upload.descriptionSinglefile\' | translate }}</p>\n        <p class=\"text-center\" ng-if=\"vm.multiple\">{{ \'modules.upload.descriptionMultifile\' | translate }}</p>\n    </div>\n    <div ngf-no-file-drop>{{ \'modules.upload.dndNotSupported\' | translate}}</div>\n</div>\n");}]);