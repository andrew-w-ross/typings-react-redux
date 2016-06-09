import {Provider, connect, IMapDispatchToProps, IMapStateToProps, IConnectOptions} from "./react-redux";
import {createStore, Action, combineReducers, Dispatch, bindActionCreators} from "redux";
import * as React from "react";

interface IState {
	greeting: string;
}

interface IAction extends Action {
	payload: string;
}

function changeGreeting(greeting: string): IAction {
	return {
		type: "CHANGE_GREETING",
		payload: greeting
	};
}

function greetingReducer(greeting: string = "world", action: IAction) {
	switch (action.type) {
		case "CHANGE_GREETING":
			return action.payload;
	}

	return greeting;
}

const rootReducer = combineReducers<IState>({
	greeting: greetingReducer
});

const store = createStore(rootReducer);

interface IGreeterProps {
	subject?: string;
	onGreet?: (newGreet: string) => any
};


function mapStateToProps(state: IState): IGreeterProps {
	return {
		subject: state.greeting
	};
}

function mapDispatchToProps(dispatch: Dispatch<any>): IGreeterProps {
	return {
		onGreet: bindActionCreators(changeGreeting, dispatch)
	};
}

@connect(mapStateToProps, mapDispatchToProps)
class Greeter extends React.Component<IGreeterProps & {mandatory: string}, {}> {
	render() {
		return (
			<div>
				<h1>Hello {this.props.subject}</h1>
				<input type="text" ref="input"/>
				<button onClick={() => this.greet() }></button>
			</div>
		);
	}

	greet() {
		let htmlInput = this.refs["input"] as HTMLInputElement;
		this.props.onGreet(htmlInput.value);
		htmlInput.value = "";
	}
}

<Greeter mandatory="mandatory" />

// Just trying out the old style and the decorator
const ConnectedGreeter = connect(mapStateToProps, mapDispatchToProps)(Greeter)

// Trying out with function components
function FunctionGreeter(props: IGreeterProps) {
	return (
		<div>
			<h1>Hello {props.subject}</h1>
			<input type="text" ref="input"/>
		</div>
	);
}
const ConnectedFunctionGreeter = connect(mapStateToProps, mapDispatchToProps)(FunctionGreeter);

const App = () => (
	<Provider store={store}>
		<ConnectedGreeter mandatory="mandatory" />
		<ConnectedFunctionGreeter />
	</Provider>
);

function connected<P, SP, DP>(
    {defaultProps, mapStateToProps, mapDispatchToProps, mergeProps, options}: {
        defaultProps: P,
        mapStateToProps?: IMapStateToProps<P, SP>,
        mapDispatchToProps?: IMapDispatchToProps<P, DP>,
        mergeProps?: (stateProps: SP, dispatchProps: DP, ownProps: P) => P & DP & SP,
        options?: IConnectOptions
    },
    component: (props: P & SP & DP) => JSX.Element
) {
    component['defaultProps'] = defaultProps;
    return connect<P, SP, DP>(mapStateToProps, mapDispatchToProps, mergeProps, options)(component);
}

const Test = connected({
    defaultProps: {} as {yolo: number},
    mapStateToProps: ({lol}: {lol: string}) => ({lol})
}, function Component({lol, yolo}) {
    return <div>{lol}{yolo}</div>;
});

<Test yolo={3} />;