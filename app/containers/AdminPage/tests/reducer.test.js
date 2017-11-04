
import { fromJS } from 'immutable';
import adminPageReducer from '../reducer';

describe('adminPageReducer', () => {
  it('returns the initial state', () => {
    expect(adminPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
