import React from 'react';
import rendered from 'react-test-renderer';
import Event from './Event';

it('renders event', () => {
  const event = rendered.create(<Event
    key={0}
    info={
      {
        title: 'Title',
        description: 'description',
        start_date: '2018-10-27 11:11:00',
        end_date: '2018-10-28 11:11:00',
        initials: 'FEUP'
      }
    }
  />);
  let treeList = event.toJSON();
  expect(treeList).toMatchSnapshot();
});