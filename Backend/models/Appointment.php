<?php
class Appointment {
    public $titel;
    public $ort;
    public $datum;
    public $ablaufdatum;
    public $kommentar;
    public $option;

    function __construct($tit, $ort, $dt, $adt, $cmt,$option) {
        $this->titel = $tit;
        $this->ort = $ort;
        $this->datum=$dt;
        $this->ablaufdatum=$adt;
        $this->kommentar=$cmt;
        $this->option=$option;
      }
}
