import Promise from "promise";
import { reset } from "redux-form";
import { onSubmitProposal, onChangeUsername, onChangePassword, onFetchProposalComments } from "./api";
import { onFetchProposal as onFetchProposalApi, onSubmitComment as onSubmitCommentApi } from "./api";
import * as sel from "../selectors";
import act from "./methods";
import { TOP_LEVEL_COMMENT_PARENTID } from "../lib/api";

export const CANCEL_SIGNUP = "CANCEL_SIGNUP";
export const SET_REPLY_PARENT = "SET_REPLY_PARENT";

export const onCancelSignup = act.CANCEL_SIGNUP;
export const onSetReplyParent = (parentId = TOP_LEVEL_COMMENT_PARENTID) =>
  (dispatch) => Promise.all([
    dispatch(act.SET_REPLY_PARENT(parentId)),
    dispatch(reset("form/reply"))
  ]);
export const onSaveNewProposal = ({ name, description, files }, _, props) =>
  (dispatch, getState) =>
    dispatch(onSubmitProposal(props.loggedInAsEmail, props.userid, props.username, name, description, files))
      .then(() => sel.newProposalToken(getState()));

export const onSaveChangeUsername = ({ password, newUsername }) =>
  (dispatch, getState) =>
    dispatch(onChangeUsername(password, newUsername))
      .then(() => sel.newProposalToken(getState()));

export const onSaveChangePassword = ({ existingPassword, newPassword }) =>
  (dispatch, getState) =>
    dispatch(onChangePassword(existingPassword, newPassword))
      .then(() => sel.newProposalToken(getState()));

export const onFetchProposal = (token) =>
  (dispatch) => Promise.all([
    dispatch(onFetchProposalApi(token)),
    dispatch(onFetchProposalComments(token))
  ]);

export const onLoadMe = me => dispatch => dispatch(act.LOAD_ME(me));

export const onChangeFilter = (option) => act.CHANGE_FILTER_VALUE(option);

export const onChangeProposalStatusApproved = (status) => act.SET_PROPOSAL_APPROVED(status);

export const setActiveVotesEndHeight = (obj) => act.SET_ACTIVE_VOTES_END_HEIGHT(obj);

export const onSubmitComment = (...args) =>
  (dispatch) =>
    dispatch(onSubmitCommentApi(...args))
      .then(() => dispatch(onSetReplyParent()));
