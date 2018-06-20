import ProgressBar from 'ProgressBar';

/**
 * Imaging Upload Form
 *
 * Form component allowing to upload MRI images to LORIS
 *
 * @author Alex Ilea
 * @version 1.0.0
 * @since 2017/04/01
 *
 */
class UploadForm extends React.Component {

  constructor(props) {
    super(props);

    const form = JSON.parse(JSON.stringify(this.props.form));
    console.log(form);
    //form.IsPhantom.required = true;
    //form.candID.required = true;
    //form.pSCID.required = true;
    //form.visitLabel.required = true;
    //form.mri_file.required = true;

    this.state = {
      formData: {},
      form: form,
      phantomScans: null,
      hasError: {},
      errorMessage: {},
      uploadProgress: -1
    };

    this.onFormChange = this.onFormChange.bind(this);
    this.getDisabledStatus = this.getDisabledStatus.bind(this);
    this.submitForm   = this.submitForm.bind(this);
    this.uploadFile   = this.uploadFile.bind(this);
  }

  componentDidMount() {
    // Disable fields on initial load
    this.onFormChange(this.state.form.IsPhantom.name, null);
  }

  onFormChange(field, value) {
    if (!field) return;

    const form = JSON.parse(JSON.stringify(this.state.form));
    const formData = Object.assign({}, this.state.formData);

    if (field === 'IsPhantom') {
      if (value === 'N') {
        console.log("IsPhantom is no");
        //form.candID.disabled = false;
        //form.pSCID.disabled = false;
        //form.visitLabel.disabled = false;
      } else {
        console.log("IsPhantom is yes");
        //form.candID.disabled = true;
        //form.pSCID.disabled = true;
        //form.visitLabel.disabled = true;
        delete formData.candID;
        delete formData.pSCID;
        delete formData.visitLabel;
      }
    }

    formData[field] = value;

    this.setState({
      form: form,
      formData: formData
    });
  }

  getDisabledStatus(phantomScans) {;
      if (phantomScans === 'N') {
         console.log("not disabled");
         return false;
      } else {
         console.log("disabled");
         return true;
      }
  }

  submitForm() {
    // Validate required fields
    const data = this.state.formData;
    if (!data.mri_file || !data.IsPhantom) {
      return;
    }

    if (data.IsPhantom === 'N' && (!data.candID || !data.pSCID || !data.visitLabel)) {
      return;
    }

    // Checks if a file with a given fileName has already been uploaded
    const fileName = data.mri_file.name;
    const mriFile = this.props.mriList.find(
      mriFile => mriFile.fileName.indexOf(fileName) > -1
    );

    // New File
    if (!mriFile) {
      this.uploadFile();
      return;
    }

    // File uploaded and completed mri pipeline
    if (mriFile.status === "Success") {
      swal({
        title: "File already exists!",
        text: "A file with this name has already successfully passed the MRI pipeline!\n",
        type: "error",
        confirmButtonText: 'OK'
      });
      return;
    }

    // File in the middle of insertion pipeline
    if (mriFile.status === "In Progress...") {
      swal({
        title: "File is currently processing!",
        text: "A file with this name is currently going through the MRI pipeline!\n",
        type: "error",
        confirmButtonText: 'OK'
      });
      return;
    }

    // File uploaded but failed during mri pipeline
    if (mriFile.status === "Failure") {
      swal({
        title: "Are you sure?",
        text: "A file with this name already exists!\n Would you like to override existing file?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!"
      }, function(isConfirm) {
        if (isConfirm) {
          this.uploadFile(true);
        } else {
          swal("Cancelled", "Your imaginary file is safe :)", "error");
        }
      }.bind(this));
    }

    // Pipeline has not been triggered yet
    if (mriFile.status === "Not Started") {
      swal({
        title: "Are you sure?",
        text: "A file with this name has been uploaded but has not yet started the MRI pipeline." +
          "\n Would you like to override the existing file?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: 'No, cancel it!'
      }, function(isConfirm) {
        if (isConfirm) {
          this.uploadFile(true);
        } else {
          swal("Cancelled", "Your upload has been cancelled.", "error");
        }
      }.bind(this));
    }

    return;
  }

  /*
   Uploads file to the server, listening to the progress
   in order to get the percentage uploaded as value for the progress bar
   */
  uploadFile(overwriteFile) {
    const formData = this.state.formData;
    let formObj = new FormData();
    for (let key in formData) {
      if (formData[key] !== "") {
        formObj.append(key, formData[key]);
      }
    }
    formObj.append("fire_away", "Upload");
    if (overwriteFile) {
      formObj.append("overwrite", true);
    }

    $.ajax({
      type: 'POST',
      url: loris.BaseURL + "/imaging_uploader/",
      data: formObj,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function() {
        const xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            const percentage = Math.round((evt.loaded / evt.total) * 100);
            this.setState({uploadProgress: percentage});
          }
        }.bind(this), false);
        return xhr;
      }.bind(this),
      success: (data) => {
        let errorMessage = this.state.errorMessage;
        let hasError = this.state.hasError;
        for (let i in errorMessage) {
            errorMessage[i] = "";
            hasError[i] = false;
        }
        this.setState({errorMessage: errorMessage, hasError: hasError});
        console.log(hasError);
        console.log(errorMessage);
        swal({
          title: "Upload Successful!",
          type: "success"
        }, function() {
          window.location.assign(loris.BaseURL + "/imaging_uploader/");
        });
      },
      error: (error, textStatus, errorThrown) => {
        let errorMessage = this.state.errorMessage;
        let hasError = this.state.hasError;
        errorMessage = (error.responseJSON || {}).errors || 'Submission error!';
        console.log(errorMessage);
        for (let i in errorMessage) {
            errorMessage[i] = errorMessage[i].toString();
            if (errorMessage[i].length != 0) {
               hasError[i] = true;
               console.log(i+" has error");
            } else {
               hasError[i] = false;
            }
        }
       // const renderedErrorList = errors.map(err =>
         //   `<li style="padding: 8px 35px 8px 0;">${err}</li>`);
        //const renderedErrors = `<ul style="text-align:left; font-size:15px;">
          //       ${renderedErrorList.join('')}</ul>`;
       // console.error(error, textStatus, errorThrown);
       
        swal({
          title: "Submission error!",
          text: "Please fix the errors on the Upload form",
          html: true,
          type: "error"
        });
        this.setState({uploadProgress: -1, errorMessage: errorMessage, hasError: hasError});
        console.log(hasError);
        console.log(errorMessage);
      }
    });
  }

  render() {
    // Bind form elements to formData
    const form = this.state.form;
    form.IsPhantom.value = this.state.formData.IsPhantom;
    form.candID.value = this.state.formData.candID;
    form.pSCID.value = this.state.formData.pSCID;
    form.visitLabel.value = this.state.formData.visitLabel;
    form.mri_file.value = this.state.formData.mri_file;

    // Hide button when progress bar is shown
    const btnClass = (
      (this.state.uploadProgress > -1) ? "btn btn-primary hide" : undefined
    );

    const notes = "File name must be of type .tgz or tar.gz or .zip. " +
      "Uploads cannot exceed " + this.props.maxUploadSize;
    return (
      <div className="row">
        <div className="col-md-7">
          <h3>Upload an imaging scan</h3>
          <br/>
          <FormElement
            name="upload_form"
            fileUpload={true}
            //onUserInput={this.onFormChange}
            //onSubmit={this.handleSubmit}
            ref="form"
          >
            <SelectElement
              name="IsPhantom"
              label="Phantom Scans"
              options={this.props.form["IsPhantom"]["options"]}
              onUserInput={this.onFormChange}
              ref="IsPhantom"
              required={true}
              hasError={this.state.hasError.IsPhantom}
              errorMessage={this.state.errorMessage.IsPhantom}
              value={this.state.formData.IsPhantom}
            />
            <TextboxElement
              name="candID"
              label="CandID"
              onUserInput={this.onFormChange}
              ref="candID"
              disabled={this.getDisabledStatus(this.state.formData.IsPhantom)}
              required={!this.getDisabledStatus(this.state.formData.IsPhantom)}
              hasError={this.state.hasError.candID}
              errorMessage={this.state.errorMessage.candID}
              value={this.state.formData.candID}
            />
            <TextboxElement
              name="pSCID"
              label="PSCID"
              onUserInput={this.onFormChange}
              ref="pSCID"
              disabled={this.getDisabledStatus(this.state.formData.IsPhantom)}
              required={!this.getDisabledStatus(this.state.formData.IsPhantom)}
              hasError={this.state.hasError.pSCID}
              errorMessage={this.state.errorMessage.pSCID}
              value={this.state.formData.pSCID}
            />
            <SelectElement
              name="visitLabel"
              label="Visit Label"
              options={this.props.form["visitLabel"]["options"]}
              onUserInput={this.onFormChange}
              ref="visitLabel"
              disabled={this.getDisabledStatus(this.state.formData.IsPhantom)}
              required={!this.getDisabledStatus(this.state.formData.IsPhantom)}
              hasError={this.state.hasError.visitLabel}
              errorMessage={this.state.errorMessage.visitLabel}
              value={this.state.formData.visitLabel}
            />
            <FileElement
              name="mri_file"
              label="File to Upload"
              onUserInput={this.onFormChange}
              ref="IsPhantom"
              required={true}
              hasError={this.state.hasError.mri_file}
              errorMessage={this.state.errorMessage.mri_file}
              value={this.state.formData.mri_file}
            />
            <StaticElement
              label="Notes"
              text={notes}
            />
            <div className="row">
              <div className="col-sm-9 col-sm-offset-3">
                <ProgressBar value={this.state.uploadProgress}/>
              </div>
            </div>
            <ButtonElement
              onUserInput={this.submitForm}
              buttonClass={btnClass}
            />
          </FormElement>
        </div>
      </div>
    );
  }
}

UploadForm.propTypes = {};
UploadForm.defaultProps = {};

export default UploadForm;
