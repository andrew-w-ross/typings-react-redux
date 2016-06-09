import {Provider, connect, IMapDispatchToProps, IMapStateToProps, IConnectOptions} from "./react-redux";
import {createStore, Action, combineReducers, Dispatch, bindActionCreators} from "redux";
import * as React from "react";

// Setting up the Redux stuff.
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

//////////////////////////////////////////////////

interface IGreeterProps {
	// Injected props
	subject?: string;
	onGreet?: (newGreet: string) => IAction;

	// Other props
	id?: number;
};

// Trying out the decorator.
@connect(
	(state: IState) => ({subject: state.greeting}),
	dispatch => ({onGreet: bindActionCreators(changeGreeting, dispatch)})
)
class Greeter extends React.Component<IGreeterProps, {}> {
	render() {
		return (
			<div>
				<h1>Hello {this.props.subject} from {this.props.id}</h1>
				<input type="text" ref="input"/>
				<button onClick={() => this.greet()}></button>
			</div>
		);
	}

	greet() {
		let htmlInput = this.refs["input"] as HTMLInputElement;
		this.props.onGreet(htmlInput.value);
		htmlInput.value = "";
	}
}

// By defining the methods directly on the decorator, we can infer the type of dispatch. But we still have to define the Props object of the class.

// Works fine.
<Greeter id={1} />

// When using it without the decorator ("old style"), we get the same result.
const ConnectedGreeter = connect(
	(state: IState) => ({subject: state.greeting}),
	dispatch => ({onGreet: bindActionCreators(changeGreeting, dispatch)})
)(Greeter);

<ConnectedGreeter id={1} />

// Trying out with function components
function FunctionGreeter(props: IGreeterProps) {
	return (
		<div>
			<h1>Hello {props.subject}</h1>
			<input type="text" ref="input" />
		</div>
	);
}

const ConnectedFunctionGreeter = connect(
	(state: IState) => ({subject: state.greeting} as IGreeterProps),
	dispatch => ({onGreet: bindActionCreators(changeGreeting, dispatch)} as IGreeterProps)
)(FunctionGreeter);

const App = () => (
	<Provider store={store}>
		<ConnectedFunctionGreeter id={0} />
	</Provider>
);

// The function connect has two signatures:
//  * One with one type parameter, which has to be the type of the unique props object that is used in the component and in both mapStateToProps and mapDispatchToProps.
//    The component props type cannot infer the type of connect, so either you set it explicitely, either you make sure mapDispatchToProps and mapStateToProps
//    properly return that type.
//  * Another with three type parameters, one for each prop object. Since the component one cannot be infered, you have to set all three to use that one.
//    The component props type must NOT contain the injected props, thus the props type which is effectively written on the component parameters must be the intersection
//    of all three. Thanks to this, the connected function won't have the injected props in its props type.


// The second signature isn't terribly useful (and rather complex) on its own, but it can be used to write another connect function that infers everything:
function connectFunction<P, SP, DP>(
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

// Basically, it changes the connect application from `connect(mapStateToProps, mapDispatchToProps)(component)` to `connect({defaultProps, mapStateToProps, mapDispatchToProps}, component)`
// The defaultProps are mandatory since they allow it to infer the component props type.

// An exemple :
const Test = connectFunction({
    defaultProps: {} as {yolo: number}, // This defines the component props.
    mapStateToProps: ({lol}: {lol: string}) => ({lol}), // Injected props from the state.
	mapDispatchToProps: dispatch => ({action: bindActionCreators(changeGreeting, dispatch)}) // Injected actions.
}, function Component({lol, yolo, action}) { // And magically, my props are all there, correctly infered!
    return <div>{lol}{yolo}</div>;
});

<Test yolo={3} />; // And here, the resulted component only has the component props!
