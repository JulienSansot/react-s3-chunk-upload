
var RepositoryTableRowFolderCreation = React.createClass({

  initialName: 'new folder',

  constants: {
    ESCAPE_KEY: 27,
    ENTER_KEY: 13
  },

  getInitialState: function() {
    return({
      editing: false,
      folder_name: this.initialName,
      edited: false,
      loading: false
    });
  },

  start: function(){
    this.setState({
      editing: true,
      folder_name: this.initialName,
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

  handleChange: function (event) {
    this.setState({
      folder_name: event.target.value,
      edited: true
    });
  },

  createFolder: function(folder_name){
    this.setState({
      loading: true
    }, function(){

      var folder_path = (this.props.path_prefix||'') + this.props.path + folder_name + '/';

      $.post(this.props.create_folder_url, {
          folder_path: folder_path
        },
        function(response){

        this.setState({
          loading: false
        });

        this.props.onFolderCreated();
        }.bind(this)
      );

    });
  },

  handleSubmit: function (event) {
    this.setState({editing: false});

    if(this.state.edited == false){
      return;
    }

    var folder_name = this.state.folder_name.trim();

    if(folder_name){
      this.createFolder(folder_name);
    }
  },

  handleKeyDown: function (event) {
    if (event.which === this.constants.ESCAPE_KEY) {
      this.setState({editing: false});
    } else if (event.which === this.constants.ENTER_KEY) {
      this.handleSubmit(event);
    }
  },

  render: function() {

    if(this.state.loading)
      return (
      <tr>
        <td>
          <img width="20" height="20" src="/assets/loader.gif" />
        </td>
      </tr>
    );

    if(!this.state.editing)
      return (
      <tr style={{display: 'none'}}></tr>
    );

    return (
      <tr>
        <td></td>
        <td>
          <input ref="editField" className="form-control input-sm"
          value={this.state.folder_name}
          onChange={this.handleChange}
          onBlur={this.handleSubmit}
          onKeyDown={this.handleKeyDown} />
        </td>
        <td></td>
      </tr>
    );
  }

});
