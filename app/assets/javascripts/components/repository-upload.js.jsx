var RepositoryUpload = React.createClass({

  getInitialState: function() {
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
				file.evaporate = evaporate;
      
				evaporate.add({
	        name: self.state.path + '' + files[i].name,
	        file: files[i],
	     //    signParams: {
						// foo: 'bar'
	     //    },
	        complete: function(){
						self.props.onUploadComplete();
						self.removeFile(this.file);
	        },
	        progress: function(progress){
						this.file.progress = progress;
						this.file.upload = this;
						self.setState({files: self.state.files});
	        },
	        cancelled: function(){
						self.removeFile(this.file);
	        },
	        warn: function(){
	           // console.log('---warn');
	        },
	        error: function(){
	           console.log('---error');
	        }
				});

    	})();
    }
      
    $(e.target).val('');

	},

	onCancel: function(file, e){
    e.preventDefault();
    file.upload.stop();
	},

	render: function(){
		var filesNodes = this.state.files.map(function(file) {

			var percent = Math.round(file.progress * 100);

			var style = {
				width: percent + '%'
			}

      return (

      	<div className="upload-queue-item" key={file.name}>
          <div className="actions">
              <a href="#" onClick={this.onCancel.bind(this, file)} ><i className="fa fa-times"></i></a>
              <a href="#"><i className="fa fa-stop"></i></a>
              <a href="#"><i className="fa fa-pause"></i></a>
              <a href="#"><i className="fa fa-play"></i></a>
          </div>
          <span >{file.name}</span>
          <span > - {percent}%</span>
          <div className="upload-progress">
              <div className="upload-progress-bar" style={style}></div>
          </div>
      	</div>
      )
    }, this);

		return (
			<div>
				<div className="file-input-text">Drag and drop files to upload (or click)</div>
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


