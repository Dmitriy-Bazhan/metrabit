<?php
ini_set('display_errors', true);
error_reporting(E_ALL);

$ds = DIRECTORY_SEPARATOR;
require_once(__DIR__ . $ds . 'api.php');


$uri = $_SERVER['REQUEST_URI'];

switch ($uri) {
    case '/' :
        require_once(__DIR__ . $ds . 'index.html');
        break;
    case '/api' :
        $api = new Api;
        $api->show();
        break;
    case '/save_data' :
        $api = new Api;
        $api->saveData();
        break;
    default :
        require_once(__DIR__ . $ds . '404.html');
        break;
}

