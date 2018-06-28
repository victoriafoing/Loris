<?php
/**
 * Test battery adder
 *
 * Handle insertions into test battery and update actions received from a front-end ajax call
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Battery Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */

if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action == "getData") {
        echo json_encode(getAddFields());
    } else if ($action == "add") {
        addEntry();
    }
}

/**
 * Handles insertions into the test battery
 *
 * @throws DatabaseException
 *
 * @return void
 */
function addEntry()
{
    $db     =& Database::singleton();
    $user   =& User::singleton();
    if (!$user->hasPermission('battery_manager_edit')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    // Process posted data
    $instrument      = isset($_POST['instrument']) ? $_POST['instrument'] : null;
    $ageMinDays      = isset($_POST['ageMinDays']) ? $_POST['ageMinDays'] : null;
    $ageMaxDays      = isset($_POST['ageMaxDays']) ? $_POST['ageMaxDays'] : null;
    $stage           = isset($_POST['stage']) ? $_POST['stage'] : null;
    $subproject      = isset($_POST['subproject']) ? $_POST['subproject'] : null;
    $visitLabel      = isset($_POST['visitLabel']) ? $_POST['visitLabel'] : null;
    $forSite            = isset($_POST['forSite']) ? $_POST['forSite'] : null;
    $firstVisit      = isset($_POST['firstVisit']) ? $_POST['firstVisit'] : null;
    $instrumentOrder = isset($_POST['instrumentOrder']) ? $_POST['instrumentOrder'] : null;
    $active          = 'Y';

    // Build insert query
    $query = array(
              'Test_name'       => $instrument,
              'AgeMinDays'      => $ageMinDays,
              'AgeMaxDays'      => $ageMaxDays,
              'Active'          => $active,
              'Stage'           => $stage,
              'SubprojectID'    => $subproject,
              'Visit_label'     => $visitLabel,
              'CenterID'        => $forSite,
              'firstVisit'      => $firstVisit,
              'instr_order'     => $instrumentOrder,
             );
    
    try {
        $db->insert('test_battery', $query);
    } catch (DatabaseException $e) {
        showError("Could not add entry to the test battery. Please try again!");
    }
       /*$entry = $db->pselectRow(
       " SELECT * FROM test_battery WHERE ID = :entryID ",
       array(
         "entryID" => $db->getLastInsertId(),
       )
     );*/

     echo json_encode($entry);
}

/**
 * Returns a list of fields from database
 *
 * @return array
 * @throws DatabaseException
 */
function getAddFields()
{

    $db   =& Database::singleton();
    $user =& User::singleton();
      
    //$instruments = $db->pselect(
      //  "SELECT Test_name FROM test_names ORDER BY Test_name",
      //  []
    //);
    
    $instrumentList  = Utility::getAllInstruments();
    $stageList       = array(
                        'Not Started'   => 'Not Started',
                        'Screening'     => 'Screening',
                        'Visit'         => 'Visit',
                        'Approval'      => 'Approval',
                        'Subject'       => 'Subject',
                        'Recycling Bin' => 'Recycling Bin',
                       );

    $subprojectList  = Utility::getSubprojectList(null);
    $visitList       = Utility::getVisitList();
    if ($user->hasPermission('access_all_profiles')) {
        $siteList = \Utility::getSiteList(false);
        // Index sites using their names (used to filter react tables)
        /*foreach ($siteList as $key => $site) {
            unset($siteList[$key]);
            $siteList[$site] = $site;
        }*/
    } else {
        // allow only to view own site data
        $siteList = $user->getData('CenterIDs');
       /* foreach ($siteIDs as $val) {
            $site =& \Site::singleton($val);
            if ($site->isStudySite()) {
                $siteList[$site->getCenterName()] = $site->getCenterName();
            }
        }*/
    }
    foreach ($siteIDs as $val) {
        $site =& \Site::singleton($val);
        if ($site->isStudySite()) {
            $siteList[$site->getCenterName()] = $site->getCenterName();
        }
    }

    $firstVisitList  = array(
                           'Y' => 'Yes',
                           'N' => 'No',
                          );
    $result = [
               'instruments' => $instrumentList,
               'stages'      => $stageList,
               'subprojects' => $subprojectList,
               'visits'      => $visitList,
               'sites'       => $siteList,
               'firstVisits' => $firstVisitList
              ];

    return $result;
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

/**
 * Utility function to convert data from database to a
 * (select) dropdown friendly format
 *
 * @param array  $options array of options
 * @param string $item    key
 * @param string $item2   value
 *
 * @return array
 */
function toSelect($options, $item, $item2)
{
    $selectOptions = [];

    $optionsValue = $item;
    if (isset($item2)) {
        $optionsValue = $item2;
    }

    foreach ($options as $key => $value) {
        $selectOptions[$options[$key][$optionsValue]] = $options[$key][$item];
    }

    return $selectOptions;
}

/**
 * Returns an array of (id, file_name) pairs from test_battery table
 *
 * @return array
 * @throws DatabaseException
 */
function isDuplicateEntry()
{
          $instrument = 'radiology_review';
          $ageMinDays = 0;
          $ageMaxDays = 99999;
          $stage = 'Visit';
          $subproject = 1;
          $visitLabel = 'V1';
          $site = 1;
          $firstVisit = "NULL";
          $instrumentOrder = "NULL";
          $active = 'Y';

    $db        =& Database::singleton();
    $entryList = $db->pselect(
        "SELECT * FROM test_battery WHERE
         Test_name = :instrument AND
         AgeMinDays = :minimumAge AND
         AgeMaxDays = :maximumAge AND
         Stage = :stage AND
         SubprojectID = :subproject AND
         Visit_label = :visitLabel AND
         CenterID = :site AND
         firstVisit = :firstVisit AND
         instr_oder = :instrumentOrder AND
         active = :active",
        [
           ':instrument'      => $instrument,
           ':minimumAge'      => $ageMinDays,
           ':maximumAge'      => $ageMaxDays,
           ':stage'           => $stage,
           ':subproject'      => $subproject,
           ':visitLabel'      => $visitLabel,
           ':site'            => $site,
           ':firstVisit'      => $firstVisit,
           ':instrumentOrder' => $instrumentOrder,
           ':active'          => $active,
        ]
    );
    return $entryList;
}
