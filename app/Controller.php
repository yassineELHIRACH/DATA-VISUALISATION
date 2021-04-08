<?php

namespace App;
use \Psr\Http\Message\RequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class Controller{

    private $container;

    public function __construct($container){
        $this->container = $container;
    }
    //on assigne la vue en fonction du request
    public function map(Request $request, Response $response){
        $this->container->view->render($response,'map.twig');
    }

    public function analyse(Request $request, Response $response){
        $this->container->view->render($response,'analyse.twig');
    }
}