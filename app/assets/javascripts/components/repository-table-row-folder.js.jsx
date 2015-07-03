var RepositoryTableRowFolder = React.createClass({

  render: function() {

  	// var styleRow = { cursor: 'pointer' };
  	// var styleText = { textDecoration: 'underline'};

  	return (
  		<tr>
  			<td onClick={this.props.onGoIntoFolder}>
  				<i className='fa fa-folder'></i>&nbsp;
  				<a href="#">{this.props.folder.name}</a>
  			</td>
        <td></td>
  		</tr>
  	);
  }

})