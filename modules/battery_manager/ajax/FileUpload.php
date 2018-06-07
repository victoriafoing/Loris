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
    } else if ($action == "edit") {
        editFile();
    }
}

/**
 * Handles the media update/edit process
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editFile()
{
    $db   =& Database::singleton();
    $user =& User::singleton();
    if (!$user->hasPermission('media_write')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    // Read JSON from STDIN
    $stdin       = file_get_contents('php://input');
    $req         = json_decode($stdin, true);
    $idMediaFile = $req['idMediaFile'];

    if (!$idMediaFile) {
        showError("Error! Invalid media file ID!");
    }

    $updateValues = [
                     'date_taken' => $req['dateTaken'],
                     'comments'   => $req['comments'],
                     'hide_record'  => $req['hideRecord'] ? $req['hideRecord'] : 0,
                    ];

    try {
        $db->update('media', $updateValues, ['id' => $idMediaFile]);
    } catch (DatabaseException $e) {
        showError("Could not update the file. Please try again!");
    }

}


/**
 * Handles the battery add process
 *
 * @throws DatabaseException
 *
 * @return void
 */
function addEntry()
{
    $uploadNotifier = new NDB_Notifier(
        "media",
        "upload"
    );

    $db     =& Database::singleton();
    $config = NDB_Config::singleton();
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
    $site            = isset($_POST['site']) ? $_POST['site'] : null;
    $firstVisit      = isset($_POST['firstVisit']) ? $_POST['firstVisit'] : null;
    $instrumentOrder = isset($_POST['instrumentOrder']) ? $_POST['instrumentOrder'] : null;
    $active          = 'Y';

    // If required fields are not set, show an error
    if (!isset($instrument) || !isset($ageMinDays) || !isset($ageMaxDays)) {
        showError("Please fill in all required fields!");
        return;
    }

    $userID = $user->getData('UserID');

    $sessionID = $db->pselectOne(
        "SELECT s.ID as session_id FROM candidate c " .
        "LEFT JOIN session s USING(CandID) WHERE c.PSCID = :v_pscid AND " .
        "s.Visit_label = :v_visit_label AND s.CenterID = :v_center_id",
        [
         'v_pscid'       => $pscid,
         'v_visit_label' => $visit,
         'v_center_id'   => $site,
        ]
    );

    if (!isset($sessionID) || count($sessionID) < 1) {
        showError(
            "Error! A session does not exist for candidate '$pscid'' " .
            "and visit label '$visit'."
        );

        return;
    }

    // Build insert query
    $query = [
              'session_id'    => $sessionID,
              'instrument'    => $instrument,
              'date_taken'    => $dateTaken,
              'comments'      => $comments,
              'file_name'     => $fileName,
              'file_type'     => $fileType,
              'data_dir'      => $mediaPath,
              'uploaded_by'   => $userID,
              'hide_file'     => 0,
              'date_uploaded' => date("Y-m-d H:i:s"),
              'language_id'   => $language,
             ];

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $mediaPath . $fileName)) {
        $existingFiles = getFilesList();
        $idMediaFile   = array_search($fileName, $existingFiles);
        try {
            // Override db record if file_name already exists
            if ($idMediaFile) {
                $db->update('media', $query, ['id' => $idMediaFile]);
            } else {
                $db->insert('media', $query);
            }
            $uploadNotifier->notify(array("file" => $fileName));
        } catch (DatabaseException $e) {
            showError("Could not upload the file. Please try again!");
        }
    } else {
        showError("Could not upload the file. Please try again!");
    }
}

/**
 * Returns a list of fields from database
 *
 * @return array
 * @throws DatabaseException
 */
function getAddFields()
{

    $db =& Database::singleton();

    $instruments = $db->pselect(
        "SELECT Test_name FROM test_names ORDER BY Test_name",
        []
    );
    
    $instrumentsList = Utility::getAllInstruments();
    $subprojectsList = Utility::getSubprojectList(null);
    $visitList       = Utility::getVisitList();
    $siteList        = Utility::getSiteList(false);

    $result = [
               'instruments' => $instrumentsList,
               'subprojects' => $subprojectsList,
               'visits'      => $visitList,
               'sites'       => $siteList,
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
 * Returns an array of (id, file_name) pairs from media table
 *
 * @return array
 * @throws DatabaseException
 */
//function getFilesList()
//{
   // $db       =& Database::singleton();
   // $fileList = $db->pselect("SELECT id, file_name FROM media", []);

  //  $mediaFiles = [];
  //  foreach ($fileList as $row) {
  //      $mediaFiles[$row['id']] = $row['file_name'];
   // }

  //  return $mediaFiles;
//}
