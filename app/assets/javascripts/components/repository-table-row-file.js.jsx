RepositoryTableRowFile = React.createClass({

  constants: {
    ESCAPE_KEY: 27,
    ENTER_KEY: 13
  },

  getInitialState: function() {
    return({
      editing: false,
      file_name: this.props.file.name,
      edited: false,
      loading: false
    });
  },

  edit: function(){
    this.setState({
      editing: true,
      file_name: this.props.file.name,
      edited: false
    });
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      var node = React.findDOMNode(this.refs.editField);
      node.focus();
      node.setSelectionRange(0, node.value.length);
    }
  },


  handleChange: function(event){
    this.setState({
      file_name: event.target.value,
      edited: true
    });
  },

  renameFile: function(file_name){
    this.setState({
      loading: true,
      file_name: file_name,
      editing: false,
      edited: false
    }, function(){

      var old_key = this.props.file.key;
      var new_key = file_name;

      var indexLastSlash = old_key.lastIndexOf('/');
      if(indexLastSlash > -1){
        new_key = old_key.substr(0, indexLastSlash+1) +  file_name
      }

      $.post(this.props.rename_file_url, {
          old_key: old_key,
          new_key: new_key
        },
        function(response){

          this.setState({
            loading: false
          });

          this.props.onFileRenamed();
        }.bind(this)
      );

    });
  },

  handleSubmit: function (event) {
    this.setState({editing: false});

    if(this.state.edited == false){
      return;
    }

    var file_name = this.state.file_name.trim();

    if(file_name){
      this.renameFile(file_name);
    }
  },

  handleKeyDown: function (event) {
    if (event.which === this.constants.ESCAPE_KEY) {
      this.setState({editing: false});
    } else if (event.which === this.constants.ENTER_KEY) {
      this.handleSubmit(event);
    }
  },

  handleDownload: function (event) {
    event.preventDefault();

    var url = this.props.download_file_url + '?key=' + this.props.file.key;

    $.get(url, function(response) {

      var link = document.createElement('a');
      link.href = response;
      link.tarket = '_blank';
      document.body.appendChild(link);
      link.click();

    });
  },

  render: function() {

    var icon = this.props.file.checked ? 'fa-check-square-o': 'fa-square-o';

    var cell;

    if(this.state.editing){
      cell = (
          <span>
            <i className='fa fa-file-o'></i>
            &nbsp;
            <input ref="editField" className="form-control input-sm"
            value={this.state.file_name}
            onChange={this.handleChange}
            onBlur={this.handleSubmit}
            onKeyDown={this.handleKeyDown} />
          </span>
        )
    }
    else{
      cell = (
          <span>
            <i className='fa fa-file-o'></i>
            &nbsp;{this.state.file_name}
            &nbsp;<i onClick={this.handleDownload} style={{cursor: 'pointer'}} className="file-download fa fa-download"></i>
            {
              this.state.loading &&
              <span>&nbsp;<img width="20" height="20" src="/assets/loader.gif" /></span>
            }
          </span>
        )
    }

  	return (
  		<tr className="file-row" >
        <td onClick={this.props.onCheckItem} ><i className={"fa " + icon}></i></td>
  			<td>
  				{cell}
  			</td>
        <td>
          {this.props.file.size_pretty}
        </td>
  		</tr>
  	);
  }

})
