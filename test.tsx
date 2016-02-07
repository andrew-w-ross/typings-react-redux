/// <reference path="./react-redux.d.ts" />
import {Provider, connect} from "./react-redux";
import {createStore, IActionGeneric, combineReducers, IDispatch, bindActionCreators} from "redux";
import * as React from "react";

interface IState {
	greeting: string;
}

function changeGreeting(greeting:string):IActionGeneric<string>{
	return {
		type : "CHANGE_GREETING",
		payload : greeting
	};
}

function greetingReducer(greeting: string = "world", action: IActionGeneric<string>) {
	switch (action.type) {
		case "CHANGE_GREETING": return action.payload;
	}
	
	return greeting;
}

const rootReducer = combineReducers<IState>({
	greeting : greetingReducer
});

const store = createStore(rootReducer)

interface IGreeterProps{
	subject? : string;
	onGreet? : (newGreet:string) => any
};


function mapStateToProps(state:IState):IGreeterProps{
	return {
		subject : state.greeting
	};
}

function mapDispatchToProps(dispatch:IDispatch):IGreeterProps{
	return {
	  onGreet : bindActionCreators(changeGreeting,dispatch)
	};
}

@connect(mapStateToProps, mapDispatchToProps)
class Greeter extends React.Component<IGreeterProps, {}>{
	render(){
		return (
			<div>
				<h1>Hello {this.props.subject}</h1>
				<input type="text" ref="input"/>
				<button onClick={() => this.greet()}></button>
			</div>	
		);
	}
	
	greet(){
		let htmlInput = this.refs["input"] as HTMLInputElement;
		this.props.onGreet(htmlInput.value);
		htmlInput.value = "";
	}
}

//Just trying out the old style and the decorator
const ConnectedGreeter = connect(mapStateToProps, mapDispatchToProps)(Greeter)

const App = () => (
	<Provider store={store}>
		<ConnectedGreeter></ConnectedGreeter>
	</Provider>	
);