// need to make sure to import 'redux-thunk/extend-redux' to address the "ThunkAction is not assignable to parameter of type 'AnyAction'"" issue,
// found this solution from this issue: https://github.com/reduxjs/redux-thunk/issues/333#issuecomment-1109308664
// TO-DO: remove this when this issue is addressed by later version of @reduxjs/toolkit
/// <reference types="redux-thunk/extend-redux" />
