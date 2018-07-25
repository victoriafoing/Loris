<?php
/**
 * Battery Manager adder
 *
 * Checks Test Battery for duplicates and handles insertions into Test Battery
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */


// Determine which action is called
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action == "checkForDuplicate") {
        echo checkForDuplicate();
    } else if ($action == "add") {
        addEntry();
    }
}

/**
 * Return duplicate of entry if it exists and null otherwise
 *
 * @return Object or null
 */
function checkForDuplicate()
{
    $db =& Database::singleton();

    // Retrieve values entered by user
    $form_data = getFormData();

    // Build SQL query based on values entered by user
    $query     = " SELECT * FROM test_battery ";
    $i         = 0;
    $connector = "WHERE ";
    foreach ($form_data as $key => $value) {
        if ($i > 0) {
            $connector = "AND ";
        }
        if (isset($value)) {
            $query .= $connector . $key . " = :" . $key . " ";
        } else {
            $query .= $connector . $key . " IS NULL ";
            unset($form_data[$key]);
        }
        $i++;
    }

    // Select duplicate entry from Test Battery
    $entry = $db->pselectRow(
        $query,
        $form_data
    );

    // Return JSON representation of duplicate entry if it exists, null otherwise
    if ($entry) {
        return json_encode($entry);
    } else {
        return null;
    }
}

/**
 * Handle insertions into the test battery
 *
 * @throws DatabaseException
 *
 * @return void
 */
function addEntry()
{
    $db   =& Database::singleton();
    $user =& User::singleton();
    if (!$user->hasPermission('battery_manager_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    // Retrieve values entered by user
    $form_data = getFormData();

    // Make sure new entry is active
    $form_data['Active'] = 'Y';

    // Add entry to Test Battery
    try {
        $db->insert('test_battery', $form_data);
    } catch (DatabaseException $e) {
        showError("Could not add entry to the test battery. Please try again!");
    }
}

/**
 * Retrieve values entered by user
 *
 * @return array
 */
function getFormData()
{

     $instrument = isset($_POST['instrument']) ? $_POST['instrument'] : null;
     $ageMinDays = isset($_POST['ageMinDays']) ? $_POST['ageMinDays'] : null;
     $ageMaxDays = isset($_POST['ageMaxDays']) ? $_POST['ageMaxDays'] : null;
     $stage      = isset($_POST['stage']) ? $_POST['stage'] : null;
     $subproject = isset($_POST['subproject']) ? $_POST['subproject'] : null;
     $visitLabel = isset($_POST['visitLabel']) ? $_POST['visitLabel'] : null;
     $forSite    = isset($_POST['forSite']) ? $_POST['forSite'] : null;
     $firstVisit = isset($_POST['firstVisit']) ? $_POST['firstVisit'] : null;
     $order      = $_POST['instrumentOrder'];
     $instrOrder = isset($_POST['instrumentOrder']) ? $order : null;

     $form_data = array(
                   'Test_name'    => $instrument,
                   'AgeMinDays'   => $ageMinDays,
                   'AgeMaxDays'   => $ageMaxDays,
                   'Stage'        => $stage,
                   'SubprojectID' => $subproject,
                   'Visit_label'  => $visitLabel,
                   'CenterID'     => $forSite,
                   'firstVisit'   => $firstVisit,
                   'instr_order'  => $order,
                  );

     return $form_data;
}

/**
 * Utility function to return errors from the server
 *
 * @param string $message error message to display
 *
 * @return void
 */
function showError($message)
{
    if (!isset($message)) {
        $message = 'An unknown error occurred!';
    }
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode(['message' => $message]));
}