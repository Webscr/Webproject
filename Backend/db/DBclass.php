<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once '' . $root . '\SS2021\Pr\Backend\config\config.php';

class DB
{
    private $conn;

    public function __construct()
    {
        global $con;
        $this->conn = $con;
    }
    public function Close($con)
    {
        mysqli_close($con);
    }
    
    public function getAppointments(){
        $conn = $this->conn;
        $stmt = $conn->query("SELECT*FROM appointments");
        $row = $stmt->num_rows;
        if ($row > 0) {
            while ($row = $stmt->fetch_assoc()) {
                $data[] = $row;
            }
            return $data;
        }
    }
    public function newAppointment($appObject){
         // Define query to insert values into the users table
         $sql = "INSERT INTO appointments(Titel,Ort,Datum,Ablaufdatum,Kommentar) VALUES(?,?,?,?,?);";
 
         $conn = $this->conn;
         // Prepare the statement
         $query = $conn->prepare($sql);
 
         // Bind parameters
         $query->bind_param("sssss", $appObject->titel, $appObject->ort, $appObject->datum, $appObject->ablaufdatum,$appObject->kommentar);
         // Execute the query
         $query->execute();

         $lastid=$conn->insert_id;
         $query->free_result();

       
        $vote=0;
         foreach ($appObject->option as $x => $date) {
         $terminsql="INSERT INTO terminoption(Datum,Votings,AppointmentID) VALUES(?,?,?);";
         $query2=$conn->prepare($terminsql);
         $query2->bind_param("sii",$date,$vote,$lastid);
         $query2->execute();
         }
         
         
         //$this->Close($conn);
    }
   
    public function terminoption($id){
        $conn = $this->conn;
        $result = $conn->prepare("SELECT*FROM terminoption WHERE AppointmentID=?;");
        $result->bind_param("i", $id);
        $result->execute();
        $stmt = $result->get_result();
        $row = $stmt->fetch_all(MYSQLI_ASSOC);
        return $row;

    }
    public function vote($id,$user,$vote,$cmt){
        $sql = "INSERT INTO userap(Username,APID,Vote,Comment) VALUES(?,?,?,?);";
 
         $conn = $this->conn;
         // Prepare the statement
         $query = $conn->prepare($sql);
         // Bind parameters
         $query->bind_param("siss", $user,$id,$vote,$cmt);
         // Execute the query
         $query->execute();
     
    }
    public function addVote($id){
        $conn = $this->conn;
        $sqlupd="UPDATE terminoption SET Votings=Votings+1 WHERE ID=?";
        $result=$conn->prepare($sqlupd);
        $result->bind_param("i", $id);
        $result->execute();
     
    }
    public function getComments($id){
        $conn = $this->conn;
        $result = $conn->prepare("SELECT Username,Comment FROM userap WHERE APID=?;");
        $result->bind_param("i", $id);
        $result->execute();
        $stmt = $result->get_result();
        $row = $stmt->fetch_all(MYSQLI_ASSOC);
        return $row;
    }

}