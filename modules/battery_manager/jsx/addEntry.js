import ProgressBar from 'ProgressBar';

/**
 * Battery Manager Add Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to add an entry to the Test Battery
 *
 * @author Victoria Foing
 * @version 1.0.0
 *
 * */
class BatteryManagerAddForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Data: {},
      formData: {},
      uploadResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
      uploadProgress: -1
    };

    //this.getValidFileName = this.getValidFileName.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    //this.isValidFileName = this.isValidFileName.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
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
          Instructions
      </span>
    );

    var stages = {'Not Started': 'Not Started',
                  'Screening': 'Screening',
                  'Visit': 'Visit',
                  'Approval': 'Approval',
                  'Subject': 'Subject',
                  'Recycling Bin': 'Recycling Bin'};

    var firstVisit = {'Y': 'Yes', 'N': 'No'};

    return (
      <div className="row">
        <div className="col-md-8 col-lg-7">
          <FormElement
            name="batteryManagerAdd"
            fileUpload={true}
            onSubmit={this.handleAdd}
            ref="form"
          >
            <h3>Add an entry to Test Battery</h3><br/>
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
              hasError={false}
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
              options={stages}
              onUserInput={this.setFormData}
              ref="stage"
              required={true}
              value={this.state.formData.stage}
            />
            <SelectElement
              name="subproject"
              label="Suproject"
              options={this.state.Data.subprojects}
              onUserInput={this.setFormData}
              ref="subproject"
              required={true}
              value={this.state.formData.subproject}
            />
            <SelectElement
              name="visitLabel"
              label="Visit Label"
              options={this.state.Data.visits}
              onUserInput={this.setFormData}
              ref="visitLabel"
              required={true}
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
              required={true}
              value={this.state.formData.forSite}
            />
            <SelectElement
              name="firstVisit"
              label="First Visit"
              options={firstVisit}
              onUserInput={this.setFormData}
              ref="firstVisit"
              required={false}
              value={this.state.formData.firstVisit}
            />
            <TextboxElement
              name="instr_order"
              label="Instrument Order"
              onUserInput={this.setFormData}
              ref="instr_order"
              required={false}
              value={this.state.formData.instr_order}
            />
            <ButtonElement label="Add"/>
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
          </FormElement>
        </div>
      </div>
    );
  }

/** *******************************************************************************
 *                      ******     Helper methods     *******
 *********************************************************************************/

  /**
   * Returns a valid name for the file to be uploaded
   *
   * @param {string} pscid - PSCID selected from the dropdown
   * @param {string} visitLabel - Visit label selected from the dropdown
   * @param {string} instrument - Instrument selected from the dropdown
   * @return {string} - Generated valid filename for the current selection
   */
  //getValidFileName(pscid, visitLabel, instrument) {
    //var fileName = pscid + "_" + visitLabel;
    //if (instrument) fileName += "_" + instrument;

    //return fileName;
  //}

  /**
   * Handle form submission
   * @param {object} e - Form submission event
   */
  handleAdd(e) {
    e.preventDefault();

    let formData = this.state.formData;
    let formRefs = this.refs;
    let batteryEntries = this.state.Data.mediaFiles ? this.state.Data.mediaFiles : [];

    // Validate the form
    if (!this.isValidForm(formRefs, formData)) {
      return;
    }

    // Validate uploaded file name
    //let instrument = formData.instrument ? formData.instrument : null;
    //let fileName = formData.file ? formData.file.name.replace(/\s+/g, '_') : null;
    //let requiredFileName = this.getValidFileName(
      //formData.pscid, formData.visitLabel, instrument
    //);
    //if (!this.isValidFileName(requiredFileName, fileName)) {
      //swal(
        //"Invalid file name!",
        //"File name should begin with: " + requiredFileName,
        //"error"
      //);
      //return;
    //}

    // Check for duplicate file names
    let isDuplicate = mediaFiles.indexOf(fileName);
    if (isDuplicate >= 0) {
      swal({
        title: "Are you sure?",
        text: "A deactivated entry with these values already exists!\n Would you like to reactivate this entry?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!"
      }, function(isConfirm) {
        if (isConfirm) {
          this.addEntry();
        } else {
          swal("Cancelled", "The entry in the database remains deactivated", "error");
        }
      }.bind(this));
    } else {
      this.addEntry();
    }
  }

  /*
   * Uploads the file to the server
   */
  addEntry() {
    // Set form data and upload the media file
    let formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
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
      xhr: function() {
        let xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            let percentage = Math.round((evt.loaded / evt.total) * 100);
            this.setState({uploadProgress: percentage});
          }
        }.bind(this), false);
        return xhr;
      }.bind(this),
      success: function() {
        // Add git pfile to the list of exiting files
        //let mediaFiles = JSON.parse(JSON.stringify(this.state.Data.mediaFiles));
        //mediaFiles.push(formData.file.name);

        // Trigger an update event to update all observers (i.e DataTable)
        let event = new CustomEvent('update-datatable');
        window.dispatchEvent(event);

        this.setState({
          //mediaFiles: mediaFiles,
          formData: {}, // reset form data after successful file upload
          uploadProgress: -1
        });
        swal("Upload Successful!", "", "success");
      }.bind(this),
      error: function(err) {
        console.error(err);
        let msg = err.responseJSON ? err.responseJSON.message : "Upload error!";
        this.setState({
          errorMessage: msg,
          uploadProgress: -1
        });
        swal(msg, "", "error");
      }.bind(this)
    });
  }

  /**
   * Checks if the inputted file name is valid
   *
   * @param {string} requiredFileName - Required file name
   * @param {string} fileName - Provided file name
   * @return {boolean} - true if fileName starts with requiredFileName, false
   *   otherwise
   */
  //isValidFileName(requiredFileName, fileName) {
    //if (fileName === null || requiredFileName === null) {
      //return false;
    //}

    //return (fileName.indexOf(requiredFileName) === 0);
  //}

  /**
   * Validate the form
   *
   * @param {object} formRefs - Object containing references to React form elements
   * @param {object} formData - Object containing form data inputed by user
   * @return {boolean} - true if all required fields are filled, false otherwise
   */
  isValidForm(formRefs, formData) {
    var isValidForm = true;

    var requiredFields = {
      pscid: null,
      visitLabel: null,
      file: null
    };

    Object.keys(requiredFields).map(function(field) {
      if (formData[field]) {
        requiredFields[field] = formData[field];
      } else if (formRefs[field]) {
        formRefs[field].props.hasError = true;
        isValidForm = false;
      }
    });
    this.forceUpdate();

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
