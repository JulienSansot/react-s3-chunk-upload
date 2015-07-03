var RepositoryTable = React.createClass({

  getInitialState: function() {
    return({
      files: [],
      folders:[],
      path: this.props.path,
      loading: false
    });
  },

  loadFiles: function(){
    this.setState({
      files: [],
      folders: [],
      loading: true
    }, function(){

      $.getJSON(this.props.url + "?path=" + this.state.path, function(response) {
        this.setState({
          files: response.files,
          folders: response.folders,
          loading: false
        });
      }.bind(this));
    });

  },

  componentDidMount: function() {
  	this.loadFiles();
  },

  onChangeFolder: function (new_folder, event) {
    event.preventDefault();

    this.setState({
      path: new_folder.full_path
    }, function(){
      window.location = '#path=' + new_folder.full_path;
      this.props.onChangePath(new_folder.full_path);
      this.loadFiles();
    });
  },

  onTriggerCreateFolder: function(event){
    event.preventDefault();

    this.refs.create_folder.start();
  },

  onFolderCreated: function(){    
    this.loadFiles();
  },

  render: function() {

    var folderRows = this.state.folders.map(function(folder) {
      return (
          <RepositoryTableRowFolder
            key={folder.full_path}
            folder={folder}
            onGoIntoFolder={this.onChangeFolder.bind(this, folder)} />
        )
    }, this);

  	var fileRows = this.state.files.map(function(file) {
		  return <RepositoryTableRowFile key={file.key} file={file} />
    }, this);

    return (
    	<div>
        <button type="button" className="btn btn-primary btn-xs" onClick={this.onTriggerCreateFolder}>Create Folder</button>
    		<div>
          <RepositoryTablePath
          path={this.state.path}
          onChangeFolder={this.onChangeFolder} />
        </div>
	      <table style={{marginBottom: 0}} className="table table-bordered table-hover table-condensed">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
            </tr>
          </thead>
	      	<tbody>
            <RepositoryTableRowFolderCreation
              ref="create_folder"
              path={this.state.path}
              create_folder_url={this.props.create_folder_url}
              onFolderCreated={this.onFolderCreated} />
            {folderRows}
		        {fileRows}
	      	</tbody>
	      </table>
        {
            this.state.loading &&
           <img width="20" height="20" src="/assets/loader.gif" />
        }
        {
            !this.state.loading && this.state.files.length == 0 && this.state.folders.length == 0 &&
           <span>&nbsp;Emtpy folder</span>
        }
        {
       //  <br/>
       //  <br/>
       //  <br/>
       //  <br/>
       //  <pre>{JSON.stringify(this.state.files, null, 2)}</pre>
	      // <pre>{JSON.stringify(this.state.folders, null, 2)}</pre>
        }
    	</div>
    )
  }
});