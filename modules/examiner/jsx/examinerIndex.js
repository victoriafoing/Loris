import FilterForm from 'FilterForm';
import formatColumn from './columnFormatter';

/**
 * DICOM Archive Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders DICOM Archive main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
class Examiner extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.pickElements = this.pickElements.bind(this);
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
        loris.hiddenHeaders = data.hiddenHeaders ? data.hiddenHeaders : [];
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

  pickElements(json, keys) {
    var subset = {}
    keys.forEach(function (key) {
      if (json.hasOwnProperty(key)) {
        subset[key] = json[key];
      }
    });
    return subset;
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  resetFilters() {
    this.refs.examinerFilter.clearFilter();
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

    return (
      <div>
        <div class="forms">
        <div class="filter">
        <FilterForm
          Module="examiner"
          name="examiner_filter"
          id="examiner_filter"
          ref="examinerFilter"
          columns={2}
          formElements={this.pickElements(this.state.Data.form,['examiner','site','radiologist'])}
          onUpdate={this.updateFilter}
          filter={this.state.filter}
        >
          <ButtonElement
            label="Clear Filters"
            type="reset"
            onUserInput={this.resetFilters}
          />
        </FilterForm>
        </div>
        <div class="add">
        <FilterForm
          Module="examiner"
          name="examiner_filter"
          id="examiner_filter"
          ref="examinerFilter"
          columns={2}
          formElements={this.pickElements(this.state.Data.form,['addName','addRadiologist','addSite'])}
          onUpdate={this.updateFilter}
          filter={this.state.filter}
        >
          <ButtonElement
            label="+ Add"
            type="reset"
            onUserInput={this.resetFilters}
          />
        </FilterForm>
        </div>
        </div>
        <StaticDataTable
          Data={this.state.Data.Data}
          Headers={this.state.Data.Headers}
          Filter={this.state.filter}
          getFormattedCell={formatColumn}
        />
      </div>
    );
  }
}

Examiner.propTypes = {
  Module: React.PropTypes.string.isRequired,
  DataURL: React.PropTypes.string.isRequired
};

/**
 * Render dicom_page on page load
 */
window.onload = function() {
  var dataURL = loris.BaseURL + "/examiner/?format=json";
  var examiner = (
    <Examiner
      Module="examiner"
      DataURL={dataURL}
    />
  );

  // Create a wrapper div in which react component will be loaded
  const examinerDOM = document.createElement('div');
  examinerDOM.id = 'page-examiner';

  // Append wrapper div to page content
  const rootDOM = document.getElementById("lorisworkspace");
  rootDOM.appendChild(examinerDOM);

  ReactDOM.render(examiner, document.getElementById("page-examiner"));
};
