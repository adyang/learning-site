import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import Post from './Post';
import * as hub from './contentFetcher';

jest.mock('./contentFetcher');

describe('App', () => {
  it('always renders main', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('main')).toHaveLength(1);
  });

  describe('finds all posts', () => {
    const postDataOne = { id: 'id1', content: 'postContent1', category: 'cat1' };
    const postDataTwo = { id: 'id2', content: 'postContent2', category: 'cat2' };
    const promise = Promise.resolve([postDataOne, postDataTwo]);
    hub.findAllPosts.mockImplementation(() => promise);

    it('renders the same number of Post components', async () => {
      const wrapper = shallow(<App />);
      await promise;

      expect(wrapper.find(Post)).toHaveLength(2);
    });

    it('uses id as key', async () => {
      const wrapper = shallow(<App />);
      await promise;

      expect(wrapper.find(Post).map(p => p.key())).toEqual([postDataOne.id, postDataTwo.id]);
    });

    it('renders posts as props on the Posts components', async () => {
      const wrapper = shallow(<App />);
      await promise;

      expect(wrapper.find(Post).map(p => p.props())).toEqual([postDataOne, postDataTwo]);
    });
  });

  describe('unable to find posts', () => {
    it('displays no posts found when no posts', async () => {
      const promise = Promise.resolve([]);
      hub.findAllPosts.mockImplementation(() => promise);

      const wrapper = shallow(<App />);
      await promise;

      expect(wrapper.find('main').text()).toBe('No posts found.');
    });

    it('leaves posts state as empty when error in finding posts', async () => {
      const promise = Promise.reject('Error in finding posts');
      hub.findAllPosts.mockImplementation(() => promise);

      const wrapper = shallow(<App />);

      try {
        await promise;
        throw Error('awaiting on Promise should throw exception.')
      } catch (ignore) {
        expect(wrapper.state().posts).toHaveLength(0);
      }
    });
  });
});