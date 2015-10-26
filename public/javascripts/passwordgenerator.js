var PasswordOptionSelector = React.createClass({
	getDefaultProps: function () {
		return {key: "defaultkey", title: "Title not assigned", options: []};
	},

	render: function () {
		var createOption = function (opt) {
			return <option key={opt.key} value={opt.key}>{opt.title}</option>;
		};
		return (
		<div>
			<label htmlFor={this.props.name}>{this.props.title}</label>
			<select name={this.props.name} onChange={this.props.onChange}>
				{this.props.options.map(createOption)}
			</select>
		</div>);
	}
});

var PasswordGenerator = React.createClass({
	getDefaultProps: function () {
		return {}; // TODO
	},

	getInitialState: function () {
		return {words: []};
	},

	render: function () {
		var testArr = [{char:'a', name:'Ay'}, {char:'b', name:'Bee'}, {char:'c', name:'See'}];
		return (
		<div class="text-center">
			<h2>Password Generator</h2>
			<PasswordOptionSelector name="test" title="Test" options={testArr} />
		</div>);
	}
});

$(document).ready(function () {
	console.log("Here!");
	React.render(<PasswordGenerator />, $("#passwordgenerator").get(0));
});
