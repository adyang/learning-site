import React from 'react';
import Markdown from 'react-markdown';

function Post({content, lastEditedDate, category}) {
  return (
    <div className="post">
      <div className="content">
        <Markdown source={content} />
      </div>
      <div className="last-edited">
        {lastEditedDate}
      </div>
      <div className="category">
        {category}
      </div>
    </div>
  );
}

export default Post;