import React, { Component } from 'react';
import './App.css';
import Post from './Post';
import * as contentFetcher from './contentFetcher';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  async componentDidMount() {
    try {
      const posts = await contentFetcher.findAllPosts();
      this.setState({posts});
    } catch (e) {
      console.error('Error finding posts: ', e);
    }
  }

  render() {
    return (
      <div className="App">
        <main>
          {this.state.posts.length
            ? this.state.posts.map(p => <Post key={p.id} {...p} />)
            : 'No posts found.'}
        </main>
      </div>
    );
  }
}

export default App;
