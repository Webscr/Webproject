<?php
include("businesslogic/simpleLogic.php");

$param = "";
$method = "";
$user = "";
$tit = "";
$ort = "";
$dt = "";
$adt = "";
$cmt = "";
$option="";

isset($_GET["method"]) ? $method = $_GET["method"] : false;
isset($_GET["user"]) ? $param = $_GET["user"] : false;
isset($_GET["param"]) ? $param = $_GET["param"] : false;

isset($_POST["Name"]) ? $tit = $_POST["Name"] : false;
isset($_POST["Place"]) ? $ort = $_POST["Place"] : false;
isset($_POST["Date"]) ? $dt = $_POST["Date"] : false;
isset($_POST["Till"]) ? $adt = $_POST["Till"] : false;
isset($_POST["comment"]) ? $cmt = $_POST["comment"] : false;
isset($_POST["option"]) ? $option= $_POST["option"] : false;


$logic = new SimpleLogic();
if (isset($_GET['method'])) {
    $result = $logic->handleRequest($method, $param);
    if ($result == null) {
        response("GET", 400, null);
    } else {
        response("GET", 200, $result);
    }
} else if (isset($_POST['Name'])) {
    $result = $logic->insertApp($tit, $ort, $dt, $adt,$option);
} else if (isset($_POST['user'])) {
    if (!empty($_POST['vote'])) {
        foreach ($_POST['vote'] as $sKey => $iQty) {
            $result = $logic->insertVote($sKey, $_POST['user'], $iQty, $cmt);
            
        }
    }
}




function response($method, $httpStatus, $data)
{
    header('Content-Type: application/json');
    switch ($method) {
        case "GET":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        case "POST":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        default:
            http_response_code(405);
            echo ("Method not supported yet!");
    }
}
