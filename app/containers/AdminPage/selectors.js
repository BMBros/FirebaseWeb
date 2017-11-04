import { createSelector } from 'reselect';

/**
 * Direct selector to the adminPage state domain
 */
const selectAdminPageDomain = (state) => state.get('adminPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by AdminPage
 */

const makeSelectAdminPage = () => createSelector(
  selectAdminPageDomain,
  (substate) => substate.toJS()
);

export default makeSelectAdminPage;
export {
  selectAdminPageDomain,
};
