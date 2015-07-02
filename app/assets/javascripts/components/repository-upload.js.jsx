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

			var style = {
				width: (file.progress * 100) + '%'
			}

      return (
      	<div key={file.name}>
					<span className="label-progress-bar">
					{file.name}
					&nbsp;
					<button type="button"
						onClick={this.onCancel.bind(this, file)}
						className="btn btn-danger btn-xs">
						cancel
					</button>
					&nbsp;

					</span>

					<div className="progress">
					  <div className="progress-bar progress-bar-striped active" style={style}></div>
					</div>

      	</div>
      )
    }, this);

		return (
			<div>
				<input type="file" multiple onChange={this.selectFiles} />
				<br/>
				{filesNodes}
      </div>
    )
	}
});

