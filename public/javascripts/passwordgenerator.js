var PasswordOptionSelect = React.createClass({
	getDefaultProps: function () {
		return {optkey: "notset", optval: {title: "Not Set"}}
	},

	render: function () {
		return <option key={this.props.optkey} value={this.props.optkey}>{this.props.optval.title}</option>;
	}
});

var PasswordOptionSelector = React.createClass({
	getDefaultProps: function () {
		return {name: "notAssigned", title: "Default Title", options: {}};
	},

	getInitialState: function () {
		return {value: "null"};
	},

	render: function () {
		var createOption = function (optkey) {
			var optval = this.props.options[optkey];
			return <PasswordOptionSelect optkey={optkey} optval={optval} />
		}.bind(this);
		return (
		<div>
			<label htmlFor={this.props.name}>{this.props.title}</label>
			<select name={this.props.name} value={this.props.value} onChange={this.props.onChange}>
				<PasswordOptionSelect optkey="null" optval={{title: "<Nothing>"}} />
				<PasswordOptionSelect optkey="random" optval={{title: "<Random>"}} />
				{Object.keys(this.props.options).map(createOption)}
			</select>
		</div>);
	}
});

var PasswordGenerator = React.createClass({
	getInitialState: function () {
		return {
			delimiterValue: "null"
		};
	},

	componentDidMount: function () {
		$.getJSON("/characters", function (data) {
			// console.log(data);
			this.setState(data);
		}.bind(this));
	},

	getInitialState: function () {
		return {words: []};
	},

	handleDelimiterChange: function (event) {
		console.log(event);
		this.setState({delimiterValue: event.target.value});
	},

	render: function () {
		var testObj = {
			"ayy": {title: "A"},
			"bee": {title: "B"},
			"see": {title: "C"}
		};
		return (
		<div class="text-center">
			<h2>Password Generator</h2>
			<PasswordOptionSelector name="test" title="Test" options={testObj} value={this.state.delimiterValue} onChange={this.handleDelimiterChange} />
		</div>);
	}
});

$(document).ready(function () {
	React.render(<PasswordGenerator />, $("#passwordgenerator").get(0));
});
