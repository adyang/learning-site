import React, { Component } from 'react';
import './App.css';
import Post from './Post';
import * as contentFetcher from './contentFetcher';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null
    };
  }

  async componentDidMount() {
    const post = await contentFetcher.findPost();
    this.setState({post});
  }

  render() {
    return (
      <div className="App">
        <Post {...this.state.post} />
      </div>
    );
  }
}

export default App;
