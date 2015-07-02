RepositoryTableRowFile = React.createClass({

  render: function() {

  	return (
  		<tr>
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