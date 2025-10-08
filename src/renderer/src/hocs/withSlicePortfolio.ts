import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators } from "redux";

<<<<<<< HEAD
import { RootState, RootDispatch } from '../store';
import { rootActions } from '../store';
=======
import { RootState, Dispatch } from '../store';
import { actions } from '../store';
>>>>>>> 29ef91f (refactor(auth): ♻️ restructure authentication logic and components)

const mapStateToProps = (state: RootState) => ({
    ...state.auth,
})

<<<<<<< HEAD
const mapDispatchToProps = (dispatch: RootDispatch) => ({
    ...bindActionCreators(rootActions.authActions, dispatch),
=======
const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators(actions.authActions, dispatch),
>>>>>>> 29ef91f (refactor(auth): ♻️ restructure authentication logic and components)
})

const bind = connect(mapStateToProps, mapDispatchToProps, (stateProps, dispatchProps, ownProps) => ({
    state: stateProps,
    actions: dispatchProps,
    ...ownProps,
}));

export const withContainer = bind

export type Bind = ConnectedProps<typeof bind>