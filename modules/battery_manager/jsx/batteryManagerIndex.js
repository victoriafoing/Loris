import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import BatteryManagerAddForm from './addEntry';

/**
 * Battery Manager
 *
 * Main module component rendering tab pane with Browse and Add tabs
 *
 * @author Victoria Foing
 */
class BatteryManagerIndex extends React.Component {

  constructor(props) {
    super(props);

    loris.hiddenHeaders = [];

    this.state = {
      isLoaded: false,
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.deactivateEntry = this.deactivateEntry.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by formatColumn
   */
  fetchData() {
    $.ajax(this.props.DataURL, {
      method: "GET",
      dataType: 'json',
      success: function(data) {
        this.setState({
          Data: data,
          isLoaded: true
        });
      }.bind(this),
      error: function(error) {
        console.error(error);
      }
    });
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  resetFilters() {
    this.refs.batteryManagerFilter.clearFilter();
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }

    let addTab;
    let tabList = [
      {id: "browse", label: "Browse"}
    ];

    // Include Add tab if user has permission to edit test battery
    if (loris.userHasPermission('battery_manager_edit')) {
      tabList.push({id: "add", label: "Add"});
      addTab = (
        <TabPane TabId={tabList[1].id}>
          <BatteryManagerAddForm
            DataURL={`${loris.BaseURL}/battery_manager/ajax/get_form_data.php?action=getFormData`}
            checkForDuplicate={`${loris.BaseURL}/battery_manager/ajax/add_entry.php?action=checkForDuplicate`}
            activate={`${loris.BaseURL}/battery_manager/ajax/update_entry.php?action=activate`}
            add={`${loris.BaseURL}/battery_manager/ajax/add_entry.php?action=add`}
          />
        </TabPane>
      );
    }
    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <FilterForm
            Module="battery_manager"
            name="battery_manager_filter"
            id="battery_manager_filter_form"
            ref="batteryManagerFilter"
            columns={3}
            formElements={this.state.Data.form}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
            <br/>
            <ButtonElement label="Clear Filters" type="reset" onUserInput={this.resetFilters}/>
          </FilterForm>
          <StaticDataTable
            Data={this.state.Data.Data}
            Headers={this.state.Data.Headers}
            Filter={this.state.filter}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        {addTab}
      </Tabs>
    );
  }

/** *******************************************************************************
 *                      ******     Helper methods     *******
 *********************************************************************************/
  /**
   * Modify behaviour of specified column cells in the Data Table component
   * Create Deactivate button in Deactivate column if the entry is Active
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
     // If a column if set as hidden, don't display it
    if (loris.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

     // Create the mapping between rowHeaders and rowData in a row object.
    var row = {};
    rowHeaders.forEach(function(header, index) {
      row[header] = rowData[index];
    }, this);

     // create array of classes to be added to td tag
    var classes = [];
    classes = classes.join(" ");

     // create deactivate button if entry is active
    if (column === 'Deactivate') {
      if (row.Active === 'Y') {
        let entryID = row.Deactivate;
        var idObj = new FormData();
        idObj.append("ID", entryID);
         // pass id of row to deactivate function
        return <td className={classes}><button onClick={() => {
          this.deactivateEntry(idObj);
        }}>Deactivate</button></td>;
      }
      return <td className={classes}></td>;
    }

    return <td className={classes}>{cell}</td>;
  }

 /*
  * Display popup so user can confirm deactivation of row
  * Refresh page if entry in Test Battery is successfully deactivated
  */
  deactivateEntry(idObj) {
    swal({
      title: "Are you sure you want to deactivate this entry?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: "Cancel",
      closeOnConfirm: false
    }, function() {
      $.ajax({
        type: 'POST',
        url: this.props.deactivate,
        data: idObj,
        cache: false,
        contentType: false,
        processData: false
      })
                    .done(function(data) {
                      swal({
                        title: "Deactivated!",
                        type: "success"
                      }, function() {
                        location.reload();
                      });
                    })
                    .error(function(data) {
                      swal("Could not deactivate entry", "", "error");
                    });
    }.bind(this));
  }
}

$(function() {
  const batteryManagerIndex = (
    <div className="page-battery-manager">
      <BatteryManagerIndex
        DataURL={`${loris.BaseURL}/battery_manager/?format=json`}
        deactivate={`${loris.BaseURL}/battery_manager/ajax/update_entry.php?action=deactivate`}
      />
    </div>
  );

  ReactDOM.render(batteryManagerIndex, document.getElementById("lorisworkspace"));
});