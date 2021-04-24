<?php
include("./models/Appointment.php");
require "DBclass.php";

class DataHandler
{

    private $db;
    public $newapp;

    public function queryAppointments()
    {
        $res =  $this->getData();
        return $res;
    }
    public function queryTermin($id)
    {
        $res = $this->db->terminoption($id);
        return $res;
    }

    public function __construct()
    {
        $this->db = new DB();
    }

    public function getData()
    {
        $demodata = $this->db->getAppointments();
        return $demodata;
    }
    public function getComments($id){
        $comments=$this->db->getComments($id);
        return $comments;
    }
    public function insertData($tit, $ort, $dt, $adt,$option)
    {
        $newapp = new Appointment($tit, $ort, $dt, $adt," ",$option);
        $this->db->newAppointment($newapp);
    }
    public function Voting($id,$vote,$user,$cmt){
        $this->db->addVote($id);
        $this->db->vote($id,$vote,$user,$cmt);
    }
}
