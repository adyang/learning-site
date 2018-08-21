import React from 'react';
import { shallow } from 'enzyme';
import Post from './Post';

describe('Post', () => {
  it('always renders content', () => {
    const wrapper = shallow(<Post />);
    expect(wrapper.find('.content')).toHaveLength(1);
  });

  it('displays passed in content', () => {
    const wrapper = shallow(<Post content="someContent"/>);
    expect(wrapper.find('.content').text()).toBe("someContent");
  });
});