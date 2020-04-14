const Generator = require('yeoman-generator');

module.exports = class extends Generator {
	/*
	 * Constructor
	 */
	constructor(args, opts) {
		super(args, opts);
	}	

	/* 
	 * Install
	 */
	install() {
		// npm install if install flag is present
		if (this.options.install) {
			this.spawnCommandSync(
				"npm",
				["install"]
			)
		}
	}

	/* 
	 * End
	 */
	end() {}
};