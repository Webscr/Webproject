<?php
include("db/dataHandler.php");

class SimpleLogic
{

    private $dh;

    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method,$param)
    {
        switch ($method) {
            case "getAppointment":
                $res = $this->dh->queryAppointments();
                break;
            case "gettermin":
                $res=$this->dh->queryTermin($param);
                break;
            case "getComments":
                $res=$this->dh->getComments($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }

    function insertApp($tit,$ort,$dt,$abt,$option){
        $res=$this->dh->insertData($tit,$ort,$dt,$abt,$option);
        return $res;
    }
    function insertVote($id,$user,$vote,$cmt){
        $res=$this->dh->Voting($id,$user,$vote,$cmt);
        return $res;
    }
}
