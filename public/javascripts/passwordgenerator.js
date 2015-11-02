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

var CapitalizationOptionSelector = React.createClass({
	getInitialState: function () {
		return {value: 0};
	},

	render: function () {
		return (
		<div>
			<label htmlFor="cap">Capitalization</label>
			<select name="cap" value={this.props.value} onChange={this.props.onChange}>
				<option value="0">all lowercase</option>
				<option value="1">ALL UPPERCASE</option>
				<option value="2">Capitalize First Letter</option>
				<option value="3">Capitalize f.l. of first word</option>
				<option value="4">cAPITALIZE sUBSEQUENT lETTERS</option>
				<option value="5">cAPITALIZE s.l. of first word</option>
				<option value="6">rANdOm CApitAlIZatiOn</option>
			</select>
		</div>);
	}
});

var GeneratedPasswordView = React.createClass({
	applyRule: function (words) {
		// words is an array
		words = words.slice();
		switch (Number(this.props.capRule)) {
			case 0:
				for (var i = 0; i < words.length; i++) {
					words[i] = words[i].toLowerCase();
				}
				break;
			case 1:
				for (var i = 0; i < words.length; i++) {
					words[i] = words[i].toUpperCase();
				}
				break;
			case 2:
				for (var i = 0; i < words.length; i++) {
					var wordBuilder = "";
					for (var j = 0; j < words[i].length; j++) {
						if (j == 0) {
							wordBuilder += words[i][j].toUpperCase();
						} else {
							wordBuilder += words[i][j].toLowerCase();
						}
					}
					words[i] = wordBuilder;
				}
				break;
			case 3:
				if (words.length > 0) {
					var wordBuilder = "";
					for (var j = 0; j < words[0].length; j++) {
						if (j == 0) {
							wordBuilder += words[0][j].toUpperCase();
						} else {
							wordBuilder += words[0][j].toLowerCase();
						}
					}
					words[0] = wordBuilder;
				}
				break;
			case 4:
				for (var i = 0; i < words.length; i++) {
					var wordBuilder = "";
					for (var j = 0; j < words[i].length; j++) {
						if (j == 0) {
							wordBuilder += words[i][j].toLowerCase();
						} else {
							wordBuilder += words[i][j].toUpperCase();
						}
					}
					words[i] = wordBuilder;
				}
				break;
			case 5:
				if (words.length > 0) {
					var wordBuilder = "";
					for (var j = 0; j < words[0].length; j++) {
						if (j == 0) {
							wordBuilder += words[0][j].toLowerCase();
						} else {
							wordBuilder += words[0][j].toUpperCase();
						}
					}
					words[0] = wordBuilder;
				}
				break;
			case 6:
				for (var i = 0; i < words.length; i++) {
					var wordBuilder = "";
					for (var j = 0; j < words[i].length; j++) {
						if (Math.random() < 0.5) {
							wordBuilder += words[i][j].toLowerCase();
						} else {
							wordBuilder += words[i][j].toUpperCase();
						}
					}
					words[i] = wordBuilder;
				}
				break;
			default:
				console.log("CapRule: Value is invalid:", this.props.capRule);
		}
		return words;
	},

	render: function () {
		if (!this.props.words) {
			return <div className="generated-password"></div>;
		}
		var words = this.applyRule(this.props.words);
		return (
		<div className="generated-password">
			{this.props.prefix}{words.join(this.props.delimiter)}{this.props.suffix}
		</div>);
	}
});

var PasswordGenerator = React.createClass({
	getInitialState: function () {
		return {
			words: null,
			capRule: 0,
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

	handleCapRuleChange: function (event) {
		this.setState({capRule: event.target.value});
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
		var rowStyle = {"margin-bottom":"5vh"};
		return (
		<div class="text-center">
			<div className="row" style={rowStyle}>
				<div className="col-sm-5">
					<label forHtml="num"># of Words</label>
					<input type="number" name="num" min="3" max="6" value={this.state.numWords} onChange={this.handleNumWordsChange} />
				</div>
				<div className="col-sm-7">
					<CapitalizationOptionSelector onChange={this.handleCapRuleChange} />
				</div>
			</div>

			<div className="row" style={rowStyle}>
				<div className="col-sm-4">
					<PasswordOptionSelector name="prefix" title="Prefix" options={this.state.prefixes} value={this.state.prefixValue} onChange={this.handlePrefixChange} />
				</div>
				<div className="col-sm-4">
					<PasswordOptionSelector name="delimiter" title="Delimiter" options={this.state.delimiters} value={this.state.delimiterValue} onChange={this.handleDelimiterChange} />
				</div>
				<div className="col-sm-4">
					<PasswordOptionSelector name="suffix" title="Suffix" options={this.state.suffixes} value={this.state.suffixValue} onChange={this.handleSuffixChange} />
				</div>
			</div>
			<input type="submit" value="Get New Words" onClick={this.handleSubmit} />
			<GeneratedPasswordView words={this.state.words} delimiter={this.state.delimiterValue} prefix={this.state.prefixValue} suffix={this.state.suffixValue} capRule={this.state.capRule} />
		</div>);
	}
});

$(document).ready(function () {
	React.render(<PasswordGenerator />, $("#passwordgenerator").get(0));
});
