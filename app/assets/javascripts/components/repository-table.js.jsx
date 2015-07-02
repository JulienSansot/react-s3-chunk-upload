var RepositoryTable = React.createClass({

  getInitialState: function() {

    var hash_params = $.parseParams((location.hash||'#').split('#')[1]);

    var path = hash_params.path || '';

    return({
      files: [],
      folders:[],
      path: path,
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

  goIntoFolder: function (new_folder, event) {
    event.preventDefault();

    this.setState({
      path: new_folder.full_path
    }, function(){
      window.location = '#path=' + new_folder.full_path;
      this.loadFiles();
    });
  },

  changeFolder: function (new_folder, event) {
    event.preventDefault();

    this.setState({
      path: new_folder.full_path
    }, function(){
      window.location = '#path=' + new_folder.full_path;
      this.loadFiles();
    });
  },

  render: function() {

    var folderRows = this.state.folders.map(function(folder) {
      return (
          <RepositoryTableRowFolder
            key={folder.full_path}
            folder={folder}
            onGoIntoFolder={this.goIntoFolder.bind(this, folder)} />
        )
    }, this);

  	var fileRows = this.state.files.map(function(file) {
		  return <RepositoryTableRowFile key={file.key} file={file} />
    }, this);

    return (
    	<div>
    		<div>
          <RepositoryTablePath
          path={this.state.path}
          onChangeFolder={this.changeFolder} />
        </div>
	      <table style={{marginBottom: 0}} className="table table-bordered table-hover table-condensed">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
            </tr>
          </thead>
	      	<tbody>
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


  // render() {
		// const commentNodes = this.props.data.map((comment, i) => {
  //     return (
  //       <Comment author={comment.author} key={i}>
  //         {comment.text}
  //       </Comment>
  //     )
  //   })

  //   return (
  //     <div className="comment-list">
  //       {commentNodes}
  //     </div>
  //   )
  // }
/*
const React = require('react')
const CommentList = require('./comment-list')
const CommentForm = require('./comment-form')

const CommentBox = React.createClass({
	getInitialState() {
    return { data: [] }
  },

  loadComments() {
    fetch(this.props.url)
      .then(response => response.json())
      .then(data => this.setState({ data: data }))
      .catch(err => console.error(this.props.url, err.toString()))
  },

  componentDidMount() {
		this.loadComments()
    setInterval(this.loadComments, this.props.pollInterval)
  },

  handleCommentSubmit(comment) {
    const comments = this.state.data
    const newComments = comments.concat([ comment ])

    this.setState({ data: newComments })

    fetch(this.props.url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    })
    .then(response => response.json())
    .then(data => this.setState({ data: data }))
    .catch(err => console.error(this.props.url, err.toString()))
  },

  render() {
    return (
      <div className="comment-box">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    )
  }
})

module.exports = CommentBox
*/