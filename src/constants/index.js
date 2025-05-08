import path from 'node:path';

export const sortList = ['asc', 'desc'];

export const TEMPLATES_DIR = path.resolve('src', 'templates'); // шлях до папки з шаблоном для листа підтвердження реєстрації юзера

export const TEMPORARY_FILE_DIR = path.resolve('temp'); // шлях до тимчасової папки для збереження зображення/файла

export const UPLOAD_FILE_DIR = path.resolve('upload'); // шлях до постійної папки для перенесення в локально зображення/файла
