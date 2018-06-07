<?php
/**
 * This file contains the NDB_Menu_Filter_battery_manager class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Battery Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\battery_manager;

/**
 * Main class for battery manager module corresponding to /battery_manager/ URL
 * Admin section of the LorisMenu.
 *
 * Displays a list of records in the test battery and control panel to search them
 * Allows user to add and remove instruments to and from the test battery  
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Battery Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Battery_Manager extends \NDB_Menu_Filter
{
    public $hasWritePermission = false;
    public $hasHidePermission  = false;
    public $AjaxModule         = true;
    public $skipTemplate       = true;

    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& \User::singleton();

        // Set global permission to control access to different tabs of battery manager module
        $this->hasWritePermission = $user->hasPermission('battery_manager_edit');

        // Set permission to access user-hidden files, currently based on superuser
        $this->hasHidePermission = $user->hasPermission("superuser");

        return $user->hasPermission('battery_manager_view');
    }

    /**
     * Create a form to filter test battery by various criteria
     *
     * @return bool
     */
    function setup()
    {
        parent::setup();

        $user =& \User::singleton();
        $db   = \Database::singleton();

        $instrumentList   = [];
        $instrumentsQuery = $db->pselect(
            "SELECT Test_name, Full_name FROM test_names ORDER BY Test_name",
            []
        );
        foreach ($instrumentsQuery as $instrument) {
            $instrumentList[$instrument['Full_name']] = $instrument['Full_name'];
        }

        $stageList = array(
                      "Not Started"   => 'Not Started',
                      "Screening"     => 'Screening',
                      "Visit"         => 'Visit',
                      "Approval"      => "Approval",
                      "Subject"       => "Subject",
                      "Recycling Bin" => "Recycling Bin"
                     );

        $subprojectList = \Utility::getSubprojectList(null);

        $visitList = \Utility::getVisitList();

        //$siteList = \Utility::getSiteList(false);
        $siteList  = array();
        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')) {
            $siteList = \Utility::getSiteList(false);
            // Index sites using their names (used to filter react tables)
            foreach ($siteList as $key => $site) {
                unset($siteList[$key]);
                $siteList[$site] = $site;
            }
        } else {
            //allow only to view own site data
            $siteIDs = $user->getData('CenterIDs');
            foreach ($siteIDs as $val) {
                $site =& \Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }

        $firstVisitList = array(
                           'Y' => 'Yes',
                           'N' => 'No',
                          );

        // Form Elements
        $this->addSelect('instrument','Instrument',$instrumentList);
        $this->addBasicText('age_min_days','Minimum age');
        $this->addBasicText('age_max_days','Maximum age');
        $this->addSelect('stage','Stage', $stageList);
        $this->addSelect('subproject','Subproject', $subprojectList);
        $this->addSelect('visitLabel','Visit Label',$visitList);
        $this->addSelect('centerID','Site',$siteList);
        $this->addSelect('first_visit','First Visit',$firstVisitList);
        $this->addBasicText('instr_order','Instrument Order');

        // Add hidden files filter is user is admin
       if ($this->hasHidePermission) {
           //  Unable to create checkbox using addCheckbox(), using addSelect for
           //  the time being
           //  select options
            $hiddenOptions = array(
                              ""  => 'Both',
                              "0" => 'Visible only',
                              "1" => 'Hidden only',
                             );
            $this->addSelect('hideRecord', 'Record Visibility', $hiddenOptions);
        }

        $this->tpl_data["hasWritePermission"] = $this->hasWritePermission;
        $this->tpl_data["hasHidePermission"]  = $this->hasHidePermission;

        return true;
    }

    /**
     * Build a list of test battery records to display in Data Table
     *
     * @return bool
     * @throws DatabaseException
     */
    function _setupVariables()
    {
        $user =& \User::singleton();
        // the base query
        $query = " FROM test_battery b
                   LEFT JOIN test_names t ON b.Test_name = t.Test_name
                   LEFT JOIN psc p ON b.CenterID = p.CenterID ";
        $query .= " WHERE 1=1 ";
    
        // set the class variables
        $this->columns
            = [
               't.Full_name',
               'b.AgeMinDays',
               'b.AgeMaxDays',
               'b.Stage',
               'b.SubprojectID',
               'b.Visit_label',
               'p.name',
               'b.firstVisit',
               'b.instr_order',
               'b.Active',
              ];

        $this->query = $query;

        //if (!$user->hasPermission('access_all_profiles')) {
          //  $site_arr     = implode(",", $user->getCenterIDs());
           // $this->query .= " AND c.CenterID IN (" . $site_arr . ")";
        //}

        //if (!$user->hasPermission("superuser")) {
          //  $this->query .= " AND m.hide_record = FALSE";
        //}

        $this->group_by = '';
        $this->order_by = 'Full_name';
        $this->headers  = [
                           'Instrument',
                           'Minimum Age',
                           'Maximum Age',
                           'Stage',
                           'Subproject',
                           'Visit Label',
                           'Site',
                           'First Visit',
                           'Instrument Order',
                           'Active',
                          ];

        // Add Edit field if user has permissions
        if ($this->hasWritePermission) {
            array_push($this->headers, 'Remove');
        }

        $this->validFilters = [
                               'b.AgeMinDays',
                               'b.AgeMaxDays',
                               'b.Stage',
                               'b.SubprojectID',
                               'b.Visit_label',
                               'b.CenterID',
                               'b.firstVisit',
                               'b.instr_order',
                              ];
        $this->formToFilter = [
                               'ageMinDays'    => 'b.AgeMinDays',
                               'ageMaxDays'    => 'b.AgeMaxDays',
                               'stage'         => 'b.Stage',
                               'subprojectid'  => 'b.SubprojectID',
                               'visit_label'   => 'b.Visit_label',
                               'CenterID'      => 'b.CenterID',
                               'firstvisit'    => 'b.firstVisit',
                               'instr_order'   => 'b.instr_order',
                              ];
        return true;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;
        $result['maxUploadSize'] = \Utility::getMaxUploadSize();
        return json_encode($result);
    }

    /**
     * Include additional CSS files:
     *  1. battery_manager.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/battery_manager/css/battery_manager.css"]
        );
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/battery_manager/js/batteryManagerIndex.js",
            )
        );
    }
}

