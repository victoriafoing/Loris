import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';

import BatteryManagerAddForm from './addEntry';

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
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
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

  /**
   * Modify behaviour of specified column cells in the Data Table component
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

     if (column === 'Deactivate') {
       if (row["Active"]=='Y') {
         return <td className={classes}><button onClick={() => {
            if (confirm("Deactivate this entry?")) {
                fetch(
                        "/battery_manager/ajax/deactivate_entry.php?ID="+row['Deactivate'],
                        {
                                credentials : "include",
                                method : "PUT",
                        }
                ).then((res) => {
                        return res.json();
                }).then((data) => {
                        console.log(data);
                        location.reload();
                });
            }
        }}>Deactivate</button></td>;
       } else {
           return <td className={classes}></td>;
       }
     }

    return <td className={classes}>{cell}</td>;
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

    if (loris.userHasPermission('media_write')) {
      tabList.push({id: "add", label: "Add"});
      addTab = (
        <TabPane TabId={tabList[1].id}>
          <BatteryManagerAddForm
            DataURL={`${loris.BaseURL}/battery_manager/ajax/FileUpload.php?action=getData`}
            action={`${loris.BaseURL}/battery_manager/ajax/FileUpload.php?action=add`}
            maxUploadSize={this.state.Data.maxUploadSize}
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
}

$(function() {
  const batteryManagerIndex = (
    <div className="page-battery-manager">
      <BatteryManagerIndex DataURL={`${loris.BaseURL}/battery_manager/?format=json`} />
    </div>
  );

  ReactDOM.render(batteryManagerIndex, document.getElementById("lorisworkspace"));
});
