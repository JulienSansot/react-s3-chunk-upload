var RepositoryTable = React.createClass({

  getInitialState: function() {
    return({
      files: [],
      folders:[],
      path: this.props.path,
      loading: false,
      deleting: false
    });
  },

  loadFiles: function(){
    this.setState({
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
      files:[],
      folders:[],
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

  onTriggerDelete: function(event){
    event.preventDefault();

    //select checked items
    var checked_files = _.where(this.state.files, {'checked': true});
    var checked_folders = _.where(this.state.folders, {'checked': true});

    var number_items = checked_files.length + checked_folders.length;

    var to_process = false;
    if(number_items > 1){
      to_process = confirm('Are you sure you want to delete these ' + number_items + ' items?');
    }
    else if(number_items == 1){
      var item = _.find(this.state.files, {'checked': true});
      if(item == null)
        item = _.find(this.state.folders, {'checked': true});

      to_process = confirm('Are you sure you want to delete ' + item.name + '?');
    }

    if(to_process == false)
      return;

    this.setState({deleting: true});
    $.post(this.props.delete_files_url, {
        files: _.pluck(checked_files, 'key'),
        folders: _.pluck(checked_folders, 'full_path')
      },
      function(response){
        this.setState({deleting: false});
        this.loadFiles();
      }.bind(this)
    );

  },

  onFolderCreated: function(){    
    this.loadFiles();
  },

  onCheckItem: function(item, item_type, event){
    event.preventDefault();
    item.checked = !item.checked;

    if(item_type == 'folder')
      this.setState({
        folders: this.state.folders
      });
    else
      this.setState({
        files: this.state.files
      });
  },

  render: function() {

    var folderRows = this.state.folders.map(function(folder) {
      return (
          <RepositoryTableRowFolder
            key={folder.full_path}
            folder={folder}
            onGoIntoFolder={this.onChangeFolder.bind(this, folder)}
            onCheckItem={this.onCheckItem.bind(this, folder, 'folder')} />
        )
    }, this);

  	var fileRows = this.state.files.map(function(file) {
		  return <RepositoryTableRowFile
        key={file.key}
        file={file}
        onCheckItem={this.onCheckItem.bind(this, file, 'file')}/>
    }, this);

    var checkedItems = _.where(this.state.folders.concat(this.state.files), {'checked': true});

    return (
    	<div>
        <button type="button" className="btn btn-primary btn-xs"
          onClick={this.onTriggerCreateFolder}>
          Create Folder
        </button>
        &nbsp;
        <button type="button" className="btn btn-primary btn-xs"
          disabled={checkedItems.length == 0}
          onClick={this.onTriggerDelete}>
          Delete
        </button>
        &nbsp;
        {
          this.state.deleting &&
          <img width="20" height="20" src="/assets/loader.gif" />
        }
    		<div>
          <RepositoryTablePath
          path={this.state.path}
          onChangeFolder={this.onChangeFolder} />
        </div>
	      <table style={{marginBottom: 0}} className="table table-bordered table-hover table-condensed">
          <thead>
            <tr>
              <th style={{width: '25px', padding:'0 0 5px 0'}}>
                {
                    this.state.loading &&
                   <img width="20" height="20" src="/assets/loader.gif" />
                }
              </th>
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