import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';

import MediaUploadForm from './uploadForm';
import formatColumn from './columnFormatter';

class BatteryManagerIndex extends React.Component {

  constructor(props) {
    super(props);

    loris.hiddenHeaders = ['Cand ID', 'Session ID', 'Hide File', 'File Type'];

    this.state = {
      isLoaded: false,
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrive data from the provided URL and save it in state
   * Additionaly add hiddenHeaders to global loris vairable
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

    let uploadTab;
    let tabList = [
      {id: "browse", label: "Browse"}
    ];

    if (loris.userHasPermission('media_write')) {
      tabList.push({id: "upload", label: "Add"});
      uploadTab = (
        <TabPane TabId={tabList[1].id}>
          <MediaUploadForm
            DataURL={`${loris.BaseURL}/battery_manager/ajax/FileUpload.php?action=getData`}
            action={`${loris.BaseURL}/battery_manager/ajax/FileUpload.php?action=upload`}
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
            getFormattedCell={formatColumn}
            freezeColumn="File Name"
          />
        </TabPane>
        {uploadTab}
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
