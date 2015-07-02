
var RepositoryTablePath = React.createClass({

  changeFolder: function(folder, event){
    this.props.onChangeFolder.apply(this, arguments);
  },
  
  render: function(){

    var folders = [{
      full_path: '',
      name: 'root'
    }];

    var path = this.props.path || '';

    var full_path = '';
    _.each(path.split('/'), function(folder){
      if(folder != ''){        
        full_path += folder + '/'
        folders.push({
          full_path: full_path,
          name: folder
        });
      }
    });

    var folderNodes = folders.map(function(folder){
      return (
         <RepositoryTablePathNode
            key={folder.full_path}
            folder={folder}
            onChangeFolder={this.changeFolder.bind(this, folder)} />
      )
    }, this);

    return (
      <div>
        {folderNodes}
      </div>
    );

  }
});


var RepositoryTablePathNode = React.createClass({
  render: function(){
    return (
      <a href="#" onClick={this.props.onChangeFolder}>
        &nbsp;{this.props.folder.name}/ 
      </a>
    )
  }
});