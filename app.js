'use strict';

angular.module('prdgFileUploadDemo', [
    'pascalprecht.translate',
    'prodigi.fileupload'
]).controller('AppController', AppController);

function AppController() {
    var vm = this;
    vm.url = "http://homestead.app/api/files/documentation";
    vm.oneFile = [
        {
            name: "foo.bar",
            download_url: "http://foo.bar/foo.bar",
            file_size: 10000,
            mime: 'image/jpeg'
        }
    ];
    vm.manyFiles = [
        {
            name: "foo.bar",
            download_url: "http://foo.bar/foo.bar",
            file_size: 10000,
            mime: 'image/jpeg'
        },
        {
            name: "foo.baz",
            download_url: "http://foo.bar/foo.baz",
            file_size: 10000,
            mime: 'image/jpeg'
        },
        {
            name: "foo.bee",
            download_url: "http://foo.bar/foo.bee",
            file_size: 10000,
            mime: 'image/jpeg'
        }
    ];
    vm.mapping = {
        name: 'name',
        download_url: 'download_url',
        size: 'file_size',
        mime: 'mime'
    };
}

angular.module('prdgFileUploadDemo').config(function($translateProvider) {
    $translateProvider.translations('en', {
        'module.upload.dndNotSupported': 'Drag \'n drop upload is not supported by your browser',
        'modules.attribute.fields.required.caption': 'Required',
        'modules.upload.descriptionSinglefile': 'Drag and drop your file here or click to select a file',
        'modules.upload.descriptionMultifile': 'Drag and drop your file(s) here or click to select file(s)',
        'buttons.add': 'Open file browser',
        'modules.upload.field.filename': 'Filename',
        'modules.upload.field.preview': 'Preview',
        'modules.upload.multiFileUpload': 'Multifile upload',
        'modules.upload.field.progress': 'Progress',
        'buttons.upload': 'Upload'
    });
    $translateProvider.preferredLanguage('en');
});


