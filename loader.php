<?php
// Set your return content type
header('Content-type: application/xml');

$q = $_GET['url']; // url
// then get website's content
$handle = fopen($q, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>