<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'vendor/autoload.php';

$config['displayErrorDetails'] = true;

$app = new \Slim\App(['settings' => $config]);

require('app/container.php');
$app->get('/',\App\Controller::class . ':map')->setName('map');
$app->get('/aboutUs', \App\Controller::class . ':aboutUs')->setName('aboutUs');
$app->get('/analyse', \App\Controller::class . ':analyse')->setName('analyse');


$app->run();
