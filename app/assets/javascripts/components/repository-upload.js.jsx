var RepositoryUpload = React.createClass({

  getInitialState: function() {

    this.file_id = 0;

    return({
      path: this.props.path,
      files: []
    });
  },

  changePath: function(path){
    this.setState({
      path: path
    })
  },

  refreshFilesState: function(){
    this.setState({files: this.state.files});
  },

  removeFile: function(file){

    var files = this.state.files;
    var fileIndex = files.indexOf(file);
    if (fileIndex > -1) {
      files.splice(fileIndex, 1);
      this.setState({files: files});
    }
  },

  selectFiles: function(e){
    e.preventDefault();

    var self = this;

    var files = _.map(e.target.files, function(file){
      return file;
    })

    this.setState({files: this.state.files.concat(files)});

    for (var i = 0; i < files.length; i++){

      (function(){

        var evaporate = new Evaporate({
          signerUrl: self.props.auth_sign_url,
          aws_key: self.props.s3_options.access_key,
          bucket: self.props.s3_options.bucket,
          aws_url: self.props.s3_options.url,
          logging: self.props.logging
        });

        var file = files[i];
        file.progress = 0;
        file.completed = false;
        file.evaporate = evaporate;
        file.file_id = ++self.file_id;

        var url = (self.props.path_prefix||'') + self.state.path + file.name;

        evaporate.add({
          name: url,
          file: file,
       //    signParams: {
            // foo: 'bar'
       //    },
          complete: function(){
            self.props.onUploadComplete();
            this.file.completed = true;
            self.refreshFilesState();
            // self.removeFile(this.file);
          },
          progress: function(progress){
            this.file.progress = progress;
            this.file.upload = this;
            self.refreshFilesState();
          },
          cancelled: function(){
            self.removeFile(this.file);
          },
          warn: function(){
             // console.log('---warn');
          },
          error: function(){
            file.error = true;
            self.refreshFilesState();
          }
        });

      })();
    }

    $(e.target).val('');

  },

  onStop: function(file, e){
    e.preventDefault();
    if(file.completed || file.error){
      this.removeFile(file);
    }
    else{
      if(file.upload.stop){
        file.upload.stop();
      }
    }
  },

  humanFileSize: function(bytes) {
    var thresh = 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
  },

  render: function(){
    var filesNodes = this.state.files.map(function(file) {

      var percent = Math.round(file.progress * 100);

      pretty_size = this.humanFileSize(file.size);

      var style = {
        width: percent + '%'
      }

      var classes = 'upload-queue-item'

      file.error &&  (classes += ' error');

      return (

        <div className={classes} key={file.file_id}>
          <div className="actions">
              <a href="#" onClick={this.onStop.bind(this, file)} ><i className="fa fa-times"></i></a>
          </div>
          <span >{file.name} ({pretty_size})</span>
          {
              file.completed &&
             <span > - completed</span>
          }
          {
              !file.completed && !file.error &&
              <span > - {percent}%</span>
          }
          {
              !file.completed && !file.error  &&
              <div className="upload-progress">
                  <div className="upload-progress-bar" style={style}></div>
              </div>
          }
          {
              file.error  &&
              <span > - An error occured</span>
          }

        </div>
      )
    }, this);

    return (
      <div>
        <div className="file-input-text">Drag and drop files to upload them (or click)</div>
        <div className="file-input-container">
          <input type="file" multiple onChange={this.selectFiles} />
        </div>

        <br/>
        <div className="upload-queue">
          {filesNodes}
        </div>
      </div>
    )
  }
});


