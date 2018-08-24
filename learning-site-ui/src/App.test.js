import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import Post from './Post';
import * as hub from './contentFetcher';

jest.mock('./contentFetcher');

describe('App', () => {
  it('always renders Post', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Post)).toHaveLength(1);
  });

  it('finds Post and passes it to the rendered Post as props', async () => {
    const postData = {content: "postContent"};
    const promise = Promise.resolve(postData);
    hub.findPost.mockImplementation(() => promise);

    const wrapper = shallow(<App />);
    await promise;

    expect(wrapper.find(Post).prop("content")).toEqual("postContent");
  });
});