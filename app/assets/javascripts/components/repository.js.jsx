var Repository = React.createClass({

  getInitialState: function() {

    var hash_params = $.parseParams((location.hash||'#').split('#')[1]);

    var path = hash_params.path || '';

    return({
      path: path
    });
  },

	uploadComplete: function(){
		this.refs.table.loadFiles();
	},

	tableChangedPath: function(path){
		this.refs.upload.changePath(path);
	},

	render: function(){

		return (
			<div>
				<RepositoryUpload
					ref="upload"
					path={this.state.path}
					auth_sign_url={this.props.auth_sign_url}
					s3_options={this.props.s3_options}
					logging={this.props.logging}
					onUploadComplete={this.uploadComplete} />
				<hr />
				<RepositoryTable
					ref="table"
					path={this.state.path}
		      url={this.props.files_url}
          create_folder_url={this.props.create_folder_url}
		      onChangePath={this.tableChangedPath} />
      </div>
    )
	}
});
