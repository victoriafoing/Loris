/**
 * Battery Add Form
 *
 * @author Victoria Foing
 *
 * */
class BatteryManagerAddForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.activateEntry = this.activateEntry.bind(this);
    this.addEntry = this.addEntry.bind(this);
  }

  componentDidMount() {
    var self = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      success: function(data) {
        self.setState({
          Data: data,
          isLoaded: true
        });
      },
      error: function(data, errorCode, errorMsg) {
        console.error(data, errorCode, errorMsg);
        self.setState({
          error: 'An error occurred when loading the form!'
        });
      }
    });
  }

  render() {
    // Data loading error
    if (this.state.error !== undefined) {
      return (
        <div className="alert alert-danger text-center">
          <strong>
            {this.state.error}
          </strong>
        </div>
      );
    }

    // Waiting for data to load
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

    var helpText = (
      <span>
        Add to battery notes
      </span>
    );

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="mediaUpload"
            fileUpload={true}
            onSubmit={this.handleAdd}
            ref="form"
          >
            <h3>Add entry to Test Battery</h3><br/>
            <StaticElement
              label="Note"
              text={helpText}
            />
            <SelectElement
              name="instrument"
              label="Instrument"
              options={this.state.Data.instruments}
              onUserInput={this.setFormData}
              ref="instrument"
              required={true}
              value={this.state.formData.instrument}
            />
            <TextboxElement
              name="ageMinDays"
              label="Minimum age"
              onUserInput={this.setFormData}
              ref="ageMinDays"
              required={true}
              value={this.state.formData.ageMinDays}
            />
            <TextboxElement
              name="ageMaxDays"
              label="Maximum age"
              onUserInput={this.setFormData}
              ref="ageMaxDays"
              required={true}
              value={this.state.formData.ageMaxDays}
            />
            <SelectElement
              name="stage"
              label="Stage"
              options={this.state.Data.stages}
              onUserInput={this.setFormData}
              ref="stage"
              hasError={false}
              required={true}
              value={this.state.formData.stage}
            />
            <SelectElement
              name="subproject"
              label="Subproject"
              options={this.state.Data.subprojects}
              onUserInput={this.setFormData}
              ref="subproject"
              hasError={false}
              required={false}
              value={this.state.formData.subproject}
            />
            <SelectElement
              name="visitLabel"
              label="Visit Label"
              options={this.state.Data.visits}
              onUserInput={this.setFormData}
              ref="visitLabel"
              required={false}
              value={this.state.formData.visitLabel}
            />
            <SearchableDropdown
              name="forSite"
              label="Site"
              placeHolder="Search for site"
              options={this.state.Data.sites}
              strictSearch={true}
              onUserInput={this.setFormData}
              ref="forSite"
              required={false}
              value={this.state.formData.forSite}
            />
            <SelectElement
              name="firstVisit"
              label="First Visit"
              options={this.state.Data.firstVisits}
              onUserInput={this.setFormData}
              ref="firstVisit"
              required={false}
              value={this.state.formData.firstVisit}
            />
            <TextboxElement
              name="instrumentOrder"
              label="Instrument Order"
              onUserInput={this.setFormData}
              ref="instrumentOrder"
              required={false}
              value={this.state.formData.instrumentOrder}
            />
            <ButtonElement label="Add entry"/>
          </FormElement>
        </div>
      </div>
    );
  }

/** *******************************************************************************
 *                      ******     Helper methods     *******
 *********************************************************************************/

  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleAdd(e) {
    e.preventDefault();

    let formData = this.state.formData;
    let formRefs = this.refs;

    // Validate the form
    if (!this.isValidForm(formRefs, formData)) {
      return;
    }

    // Check for duplicate entries
    let isDuplicate = false;
    //let isDuplicate = this.isDuplicate(); // create function for checking duplicates
    if (isDuplicate) {
      swal({
        title: "Are you sure?",
        text: "A deactivated entry with these values already exists!\n Would you like to reactivate this existing entry?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: "Cancel"
      }, function(isConfirm) {
           if (isConfirm) {
             console.log("Reactivating entry");
           } else {
             swal("Cancelled", "The entry with those values is still deactivated", "error");
           }
      }.bind(this));
    } else {
      console.log("Adding entry");
      this.addEntry();
    }
  }

  isDuplicate() {
    return true;
  }

  activateEntry() {
      fetch(
            "/battery_manager/ajax/reactivate_entry.php?ID="+row['Deactivate'],
            {
               credentials : "include",
               method : "PUT",
            }
           ).then((res) => {
               return res.json();
            }).then((data) => {
               console.log(data);
            }
      );

  }

  addEntry() {
    let formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        console.log(key+": "+formData[key]);
        formObj.append(key, formData[key]);
      }
    }

  $.ajax({
      type: 'POST',
      url: this.props.action,
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      success: function() {
        /*this.setState({
          formData: {}, // reset form data after successful entry
        });*/
        swal("Entry Successful!", "", "success");
      }.bind(this),
      error: function(err) {
        console.error(err);
        /*let msg = err.responseJSON ? err.responseJSON.message : "Insert error!";
        this.setState({
          errorMessage: msg,
        });*/
        swal("Could not insert", "", "error");
      }.bind(this)
    });  
  }

  /**
   * Validate the form
   *
   * @param {object} formRefs - Object containing references to React form elements
   * @param {object} formData - Object containing form data inputed by user
   * @return {boolean} - true if all required fields are filled, false otherwise
   */
  isValidForm(formRefs, formData) {
    var isValidForm = true;

    return isValidForm;
  }

  /**
   * Set the form data based on state values of child elements/componenets
   *
   * @param {string} formElement - name of the selected element
   * @param {string} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {

    var formData = this.state.formData;
    formData[formElement] = value;

    this.setState({
      formData: formData
    });
  }
}

BatteryManagerAddForm.propTypes = {
  DataURL: React.PropTypes.string.isRequired,
  action: React.PropTypes.string.isRequired
};

export default BatteryManagerAddForm;
