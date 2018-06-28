<?php
/**
 * This is used by the Battery Manager module to make an entry in the test_battery inactive
 *
 * PHP Version 5
 *
 * @category Schedule
 * @package  Loris
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */
    $DB = Database::singleton();

    $deactivate_entry = $DB->update(
        "test_battery",
        array(
         "Active" => "N",
        ),
        array(
         "ID" => $_GET["ID"],
        )
    );
    
    $new_entry = $DB->pselectRow(
         " SELECT * FROM test_battery WHERE ID = :batteryID ",
         array("batteryID" => $_GET["ID"],)
    );
    
    if (empty($new_entry)) {
       throw new Exception("Deactivated entry but could not fetch it");
    } else {
       echo json_encode($new_entry);
    }
?>
