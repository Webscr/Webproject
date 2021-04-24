<?php
// Datenbankinformationen:
$host     =   "localhost";           // Name, Adresse oder IP des MySQL Servers. Standardm��ig: localhost
$user     =   "root";// Username zum einloggen am MySQL Server
$pass     =   "";	         // Passwort zum einloggen am MySQL Server
$dbname   =   "doodle";    	     // Name der Datenbank

// Verbindung zur Datenbank herstellen:
$con=@mysqli_connect($host, $user,   $pass, $dbname) OR die(mysqli_connect_error());
?>