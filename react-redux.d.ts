import {Component} from 'react';
import {Store, Dispatch} from "redux";

export class Provider extends Component<{store: Store<any>}, {}> {}

export interface IMapStateToProps<P, SP> {
	(state: any, ownProps?: P): SP;
}

export interface IMapDispatchToProps<P, DP> {
	(dispatch: Dispatch<any>, ownProps?: P): DP;
}

export interface IConnectOptions {
	pure?: boolean;
	withRef?: boolean;
}

interface ComponentConnector<P> {
	(component: ((props: P) => JSX.Element)): ((props: P) => JSX.Element)
	<TFunction extends Function>(component: TFunction): TFunction
}

export function connect<P>(
	mapStateToProps?: IMapStateToProps<P, P>,
	mapDispatchToProps?: IMapDispatchToProps<P, P>,
	mergeProps?: (stateProps: P, dispatchProps: P, ownProps: P) => P,
	options?: IConnectOptions
): ComponentConnector<P>

export function connect<P, SP, DP>(
	mapStateToProps?: IMapStateToProps<P, SP>,
	mapDispatchToProps?: IMapDispatchToProps<P, DP>,
	mergeProps?: (stateProps: SP, dispatchProps: DP, ownProps: P) => P & DP & SP,
	options?: IConnectOptions
): ComponentConnector<P>

