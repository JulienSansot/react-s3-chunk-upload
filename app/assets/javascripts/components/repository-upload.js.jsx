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

	selectFiles: function(e){		
    event.preventDefault();

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
      
				evaporate.add({
	        name: self.state.path + '' + files[i].name,
	        file: files[i],
	     //    signParams: {
						// foo: 'bar'
	     //    },
	        complete: function(){
						// console.log('complete................yay!');
						self.props.onUploadComplete();

						var files = self.state.files;
						var fileIndex = files.indexOf(this.file);
						if (fileIndex > -1) {
						  files.splice(fileIndex, 1);
							self.setState({files: files});
						}

	           // console.log(arguments);
	        },
	        progress: function(progress){
						// console.log('making progress: ' + progress);
						this.file.progress = progress;
						self.setState({files: self.state.files});
	        },
	        cancelled: function(){
	           console.log('---cancelled');
	           console.log(arguments);
	        },
	        // info: function(){
	        //    console.log('---info');
	        //    console.log(JSON.stringify(arguments,null,2));
	        // },
	        warn: function(){
	           console.log('---warn');
	           console.log(arguments);
	        },
	        error: function(){
	           console.log('---error');
	           console.log(arguments);
	        }
				});

    	})();
    }
      
    $(e.target).val('');

	},

	render: function(){

		var filesNodes = this.state.files.map(function(file) {

			var style = {
				width: (file.progress * 100) + '%'
			}

      return (
      	<div key={file.name}>
					<span className="label-progress-bar">{file.name}</span>
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

