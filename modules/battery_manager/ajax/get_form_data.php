<?php
/**
 * Battery Manager get data
 *
 * Gets data to populate dropdowns in Add tab and Edit page
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */



if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action === "getFormData") {
        if (isset($_GET['ID'])) {
            $entryID = $_GET['ID'];
            echo getAllData($entryID);
        } else {
            echo json_encode(getFormData(null));
        }
    }
}

/**
 * Get both form data and battery data in json form
 *
 * @param $entryID the id of the form
 *
 * @return json object
 */
function getAllData($entryID)
{
    $allData                = getFormData($entryID);
    $allData['batteryData'] = getEntryData($entryID);

    return json_encode($allData);
}

/**
 * Get data from the test_battery
 *
 * @param $entryID the id of the form
 *
 * @return array
 */

function getEntryData($entryID)
{
    $db = \Database::singleton();

    $query = " SELECT
               ID,
               Test_name,
               AgeMinDays,
               AgeMaxDays,
               Active,
               Stage,
               SubprojectID,
               Visit_label,
               CenterID,
               firstVisit,
               instr_order FROM test_battery WHERE id = :id ";
    $entry = $db->pselectRow($query, array( 'id' => $entryID));

    /*$entryData = [
               'id' => $entry['id'],
               'instrument' => $entry['Test_name'],
               'ageMinDays' => $entry['AgeMinDays'],
               'ageMaxDays' => $entry['AgeMaxDays'],
               'stage' => $entry['Stage'],
               'subproject' => $entry['SubprojectID'],
               'visitLabel' => $entry['Visit_label'],
               'forSite' => $entry['CenterID'],
               'firstVisit' => $entry['firstVisit'],
               'instrumentOrder' => $entry['instr_order'],
               'active' => $entry['active']
              ];
    */
    return $entry;
}

/**
 * Return object of fields and their values from database
 *
 * @param   $entryID the id of the form
 *
 * @return  array
 */
function getFormData($entryID)
{
    $formData = [
                 'instruments' => Utility::getAllInstruments(),
                 'stages'      => getStagesList(),
                 'subprojects' => Utility::getSubprojectList(null),
                 'visits'      => Utility::getVisitList(),
                 'sites'       => Utility::getSiteList(false),
                 'firstVisits' => getYesNoList(),
                ]; 
    if (isset($entryID)) {
        $formData['active'] = getYesNoList();
    }
    return $formData;
}

/**
 * Return associate array of stages
 *
 * @return array
 */
function getStagesList()
{
    $stageList = array(
                  'Not Started'   => 'Not Started',
                  'Screening'     => 'Screening',
                  'Visit'         => 'Visit',
                  'Approval'      => 'Approval',
                  'Subject'       => 'Subject',
                  'Recycling Bin' => 'Recycling Bin',
                 );
    return $stageList;
}

/**
 * Return associate array of yes and no values
 *
 * @return array
 */
function getYesNoList()
{
    $yesNoList = array(
                  'Y' => 'Yes',
                  'N' => 'No',
                 );
    return $yesNoList;
}
