const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs-extra');
const { stripIndent } = require("common-tags")

module.exports = class extends Generator {
	/*
	 * Constructor
	 */
	constructor(args, opts) {
		super(args, opts);

		// default answers
		this.option("default", {
			desc: "Default option",
			type: Boolean,
			default: false
		})
	}	

    /*
    * Paths
    */
    paths() {
        // create root template folder path 
		var sourceRoot = this.sourceRoot() 
		sourceRoot = path.join(sourceRoot, "../../_templates")
		this.sourceRoot(sourceRoot)
    }

	/*
	 * Prompt user for input
	 */
	async prompting() {
		const answers = await this.prompt([
		{
			type: "input",
			name: "name",
			message: "Project name",
			default: this.appname // Default to current folder name
		},
		{
			type: "input",
			name: "author",
			message: "Author",
			default: "George L. Sun"
		},
		{
			type: "input",
			name: "description",
			message: "Project description",
			default: "Description of: " + this.appname
		},
		{
			type: "list",
			name: "style",
			message: "which style of organization would you like?",
			choices: ["single", "input", "include", "subfiles", "chapters"],
			default: "single" 
		},
		{
			when: function(response) {
				return response.style != "chapters"
			},
			type: "confirm",
			name: "bib",
			message: "Would you like to include an external bib file?",
			default: true
		},
		]);
	
		// save answers
		this.answers = answers;
	}

	/* 
	 * Compose multiple generators
	 */
	writing() {

		//------------------------------------------
		// Copy files (symbolic links) from template
		//------------------------------------------
		var style = this.answers.style
		var boiler_plate = () => {
			this.fs.copyTpl(
				this.templatePath("boilerplate/*"),
				this.destinationPath(),
				{
					name: this.answers.name,
					author: this.answers.author,
					description: this.answers.description,
				},
				{},
				{
					globOptions: {
						ignore: [],
						dot: true
					}
				}
			)
		}

		//------------------------------------------
		// Copy files (symbolic links) from template
		//------------------------------------------
		var style = this.answers.style
		var copy_files = () => {
			var src_path;
			switch (style) {
				case "single":
					src_path = "single"
				case "input":
					src_path = "input"
				case "include":
					src_path = "include"
				case "subfile":
					src_path = "subfile"
				case "chapter":
					src_path = "chapter"

			}
			this.fs.copy(
				this.templatePath(src_path),
				this.destinationPath()
			)
		}

		//----------------------------------
		// Template some files
		//----------------------------------
		var override_files = () => {
			console.log("will be completed");
			// this.fs.copyTpl(
			// 	this.templatePath(),
			// 	this.destinationPath(),
			// 	{
			// 		key: value
			// 	},
			// 	{},
			// 	{
			// 		globOptions: {
			// 			ignore: ["a", "b"],
			// 			dot: true
			// 		}
			// 	}
			// )
		}
		

		// call functions (in order)
		boiler_plate()
		copy_files()
		override_files()
	}

    /* 
	 * Install
	 */
	install() {
		if (this.options.install === true) {
			this.composeWith(
				require.resolve('../install')
			) 
		}
	}

    /* 
	 * End
	 */
	end() {
		this.log("...tidying up")
	}

};