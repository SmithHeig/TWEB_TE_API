const { ForbiddenError } = require('apollo-server-express');

const checkIfIsAuthenticated = idInContext => (idInContext ? true : new ForbiddenError('Sorry, you need to be authenticated to do that.'));

const checkIfIsYourself = (idInContext, idInArgs) => (idInArgs === idInContext ? true : new ForbiddenError(
  'You can\'t modify information of another user than yourself!'
));

/**
 * Check if the user is authenticated - Not usefull for this app
 * @param idInContext
 * @returns {boolean}
 */
const isAuthenticated = (idInContext) => {
  const result = checkIfIsAuthenticated(idInContext);
  if (result.message != null) {
    throw result;
  }
  return true;
};

/**
 * Check if is autheticated
 * @param idInContext
 * @param idInArgs
 * @returns {boolean}
 */
const isAuthenticatedAndIsYourself = (idInContext, idInArgs) => {
  const resultAuthenticated = checkIfIsAuthenticated(idInContext);
  const resultYourself = checkIfIsYourself(idInContext, idInArgs);
  if (resultAuthenticated.message != null) {
    throw resultAuthenticated;
  }
  if (resultYourself.message != null) {
    throw resultYourself;
  }
  return true;
};

module.exports = {
  isAuthenticated,
  isAuthenticatedAndIsYourself
};
