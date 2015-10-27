var PasswordOptionSelect = React.createClass({
	getDefaultProps: function () {
		return {optkey: "notset", optval: {title: "Not Set"}}
	},

	render: function () {
		return <option key={this.props.optkey} value={this.props.optval.char}>{this.props.optval.title}</option>;
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
				<PasswordOptionSelect optkey="" optval={{title: "<Nothing>", char: ""}} />
				<PasswordOptionSelect optkey="random" optval={{title: "<Random>", char: "random"}} />
				{Object.keys(this.props.options).map(createOption)}
			</select>
		</div>);
	}
});

var GeneratedPasswordView = React.createClass({
	render: function () {
		if (!this.props.words) {
			return <div className="generated-password"></div>;
		}
		return (
		<div className="generated-password">
			{this.props.prefix}{this.props.words.join(this.props.delimiter)}{this.props.suffix}
		</div>);
	}
});

var PasswordGenerator = React.createClass({
	getInitialState: function () {
		return {
			words: null,
			delimiterValue: "",
			prefixValue: "",
			suffixValue: "",
			numWords: 4
		};
	},

	componentDidMount: function () {
		$.getJSON("/characters", function (data) {
			this.setState(data);
		}.bind(this));
	},

	handleDelimiterChange: function (event) {
		if (event.target.value == 'random') {
			var randIdx = Math.floor(Math.random() * Object.keys(this.state.delimiters).length);
			var randDelimiterKey = Object.keys(this.state.delimiters)[randIdx];
			var randDelimiterValue = this.state.delimiters[randDelimiterKey].char;
			this.setState({delimiterValue: randDelimiterValue})
		} else {
			this.setState({delimiterValue: event.target.value});
		}
	},

	handlePrefixChange: function (event) {
		if (event.target.value === 'random') {
			var randIdx = Math.floor(Math.random() * Object.keys(this.state.prefixes).length);
			var randPrefixKey = Object.keys(this.state.prefixes)[randIdx];
			var randPrefixValue = this.state.prefixes[randPrefixKey].char;
			this.setState({prefixValue: randPrefixValue})
		} else {
			this.setState({prefixValue: event.target.value});
		}
	},

	handleSuffixChange: function (event) {
		if (event.target.value === 'random') {
			var randIdx = Math.floor(Math.random() * Object.keys(this.state.suffixes).length);
			var randSuffixKey = Object.keys(this.state.suffixes)[randIdx];
			var randSuffixValue = this.state.suffixes[randSuffixKey].char;
			this.setState({suffixValue: randSuffixValue})
		} else {
			this.setState({suffixValue: event.target.value});
		}
	},

	handleNumWordsChange: function (event) {
		this.setState({numWords: Number(event.target.value)});
	},

	handleSubmit: function (event) {
		$.getJSON("/randwords", {num: this.state.numWords}, function (data) {
			this.setState(data);
		}.bind(this));
	},

	render: function () {
		return (
		<div class="text-center">
			<div className="row">
				<div className="col-sm-2">
					<label forHtml="num"># of Words</label>
					<input type="number" name="num" min="3" max="6" value={this.state.numWords} onChange={this.handleNumWordsChange} />
				</div>
				<div className="col-sm-3">
					<PasswordOptionSelector name="prefix" title="Prefix" options={this.state.prefixes} value={this.state.prefixValue} onChange={this.handlePrefixChange} />
				</div>
				<div className="col-sm-4">
					<PasswordOptionSelector name="delimiter" title="Delimiter" options={this.state.delimiters} value={this.state.delimiterValue} onChange={this.handleDelimiterChange} />
				</div>
				<div className="col-sm-3">
					<PasswordOptionSelector name="suffix" title="Suffix" options={this.state.suffixes} value={this.state.suffixValue} onChange={this.handleSuffixChange} />
				</div>
			</div>
			<input type="submit" value="Get New Words" onClick={this.handleSubmit} />
			<GeneratedPasswordView words={this.state.words} delimiter={this.state.delimiterValue} prefix={this.state.prefixValue} suffix={this.state.suffixValue} />
		</div>);
	}
});

$(document).ready(function () {
	React.render(<PasswordGenerator />, $("#passwordgenerator").get(0));
});
