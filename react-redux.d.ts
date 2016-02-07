/// <reference path="typings/main.d.ts" />

import * as React from "react";
import {IStore, IDispatch} from "redux";

declare module ReactRedux {
	
	export class Provider extends React.Component<{store:IStore<any>},{}>{}	

	export interface IMapStateToProps {
		(state: any, ownProps?: any): Object;
	}

	export interface IMapDispatchToProps {
		(dispatch: IDispatch, ownProps?: any): Object;
	}

	export interface IConnectOptions {
		pure?: boolean;
		withRef?: boolean;
	}

	export function connect<TElement extends Function>(
		mapStateToProps?: IMapStateToProps,
		mapDispatchToProps?: IMapDispatchToProps,
		mergeProps?: (stateProps: Object, dispatchProps: Object, ownProps: Object) => Object,
		options?: IConnectOptions
	): TElement;
}

export = ReactRedux;