import React from 'react';
import { shallow } from 'enzyme';
import Post from './Post';
import Markdown from 'react-markdown';

describe('Post', () => {
  it('displays passed in content as Markdown', () => {
    const wrapper = shallow(<Post content="someMarkdown"/>);
    const content = wrapper.find('.content');
    expect(content.find(Markdown).props().source).toBe("someMarkdown");
  });

  it('displays passed in last edited date', () => {
    const wrapper = shallow(<Post lastEditedDate="someDate"/>);
    expect(wrapper.find('.last-edited').text()).toBe("someDate");
  });

  it('displays passed in category', () => {
    const wrapper = shallow(<Post category="someCategory"/>);
    expect(wrapper.find('.category').text()).toBe("someCategory");
  });
});