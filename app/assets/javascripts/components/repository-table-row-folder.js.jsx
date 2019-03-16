var RepositoryTableRowFolder = React.createClass({

  render: function() {

    // var styleRow = { cursor: 'pointer' };
    // var styleText = { textDecoration: 'underline'};

    var icon = this.props.folder.checked ? 'fa-check-square-o': 'fa-square-o';

    return (
      <tr>
        <td onClick={this.props.onCheckItem}><i className={"fa " + icon}></i></td>
        <td>
          <i onClick={this.props.onGoIntoFolder} className='fa fa-folder'></i>&nbsp;
          <a onClick={this.props.onGoIntoFolder} href="#">{this.props.folder.name}</a>
        </td>
        <td></td>
      </tr>
    );
  }

})
