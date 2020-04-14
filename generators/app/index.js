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

		//----------------------------------
		// Template main file
		//----------------------------------
		var style = this.answers.style 
		var use_biber = this.answers.bib
		var template_main = () => {
			// use biber 
			var bib_template;
			if (use_biber) {
				bib_template = stripIndent`
				% use biber engine
				\\printbibliography

				% manual bib insertion
				% \\begin{thebibliography}{99} % means 1 digit of entries (<10)
				% \\bibitem{bibref}
				% \tbib information
				% \\end{thebibliography}`.trim()
			} else {
				bib_template = stripIndent`
				% use biber engine
				% \\printbibliography

				manual bib insertion
				\\begin{thebibliography}{99} % means 1 digit of entries (<10)
				\\bibitem{bibref}
				\tbib information
				\\end{thebibliography}`.trim()
			}

			// template main
			this.fs.copyTpl(
				this.templatePath(style + "/" + "main/main.tex"),
				this.destinationPath("main/main.tex"),
				{
					bib: bib_template
				}
			)
		}

		//----------------------------------
		// Copy other boiler main material
		//----------------------------------
		var basic_files = [
			"abstract.tex", 
			"preamble.sty",
			"refextdoc_"+style+".sty",
			"titlepage.tex",
			style!="chapter" ? "custom.sty" : "custom_"+style+".sty",
			style=="chapter" ? "acknowledgements.tex" : ""
		]

		basic_files.forEach((filename) => {
			// remove any underscores to destination path
			var dst_filename = filename.replace(/\_.*\./, ".")
			this.fs.copy(
				this.templatePath("boilerplate/" + filename),
				this.destinationPath("main/" + dst_filename),
			)
		})
		
		//----------------------------------
		// Copy other boiler plate material
		//----------------------------------
		var path_mapping = {
			tables: {src: "boilerplate/tables/*"},
			graphics: {src: "boilerplate/graphics/*"},
			bib: {src: "boilerplate/bib/*"},
		}
		switch (this.answers.style ) {
			case "single":
				path_mapping.tables.dst = style+"/tables/"
				path_mapping.graphics.dst = style+"/graphics/"
				path_mapping.bib.dst = style+"/bib/"
				break
			case "input":
				path_mapping.tables.dst = style+"/tables/"
				path_mapping.graphics.dst = style+"/graphics/"
				path_mapping.bib.dst = style+"/bib/"
				break
			case "include":
				path_mapping.tables.dst = style+"/tables/"
				path_mapping.graphics.dst = style+"/graphics/"
				path_mapping.bib.dst = style+"/bib/"
				break
			case "subfile":
				path_mapping.tables.dst = style+"/tables/"
				path_mapping.graphics.dst = style+"/graphics/"
				path_mapping.bib.dst = style+"/bib/"
				break
			case "chapter":

				break
		}

		//----------------------------------
		// Template some files
		//----------------------------------
		var template_files = () => {
			this.fs.copyTpl(
				this.templatePath(),
				this.destinationPath(),
				{
					key: value
				},
				{},
				{
					globOptions: {
						ignore: ["a", "b"],
						dot: true
					}
				}
			)
		}
		//----------------------------------
		// Write some custom code
		//----------------------------------
		var write_files = () => {
			this.fs.write(
				path.join(__dirname, "file_name"),
				"contents"
			)
		}

		//----------------------------------
		// Use sub-generator to compose with
		//----------------------------------
		var use_subgenerator = () => {
			this.composeWith(
				require.resolve(path.join(__dirname, "..", "sub")),
				{
					option_value: "option_value"
				}
			)
		}

		// call functions (in order)
		template_main()
		// copy_files()
		// template_files()
		// write_files()
		// use_subgenerator()
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