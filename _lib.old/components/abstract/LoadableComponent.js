import Object3Component from "../../Object3Component";

export default class LoadableComponent extends Object3Component {
	render(){
		if(this.state.__isLoaded) return super.render();
		return null;
	}
}