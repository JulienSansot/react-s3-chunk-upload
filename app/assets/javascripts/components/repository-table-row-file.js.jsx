RepositoryTableRowFile = React.createClass({

  render: function() {

    var icon = this.props.file.checked ? 'fa-check-square-o': 'fa-square-o';

  	return (
  		<tr>
        <td onClick={this.props.onCheckItem} ><i className={"fa " + icon}></i></td>
  			<td>
  				<i className='fa fa-file-o'></i>
  				&nbsp;{this.props.file.name}
  			</td>        
        <td>
          {this.props.file.size_pretty}
        </td>
  		</tr>
  	);
  }

})