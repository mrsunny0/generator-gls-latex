const helpers = require('yeoman-test');
const assert = require('chai')
const { exec } = require("child_process")
const { spawn } = require("child_process")
const config = require("./config.js")
const answerPrompts = config.answerPrompts
const deleteDir = config.deleteDir

describe("Test package installations", () => {

    context("Single files", () => {
        // basic testing of standard templating
        it('single file with bib', () => {
            var answers = {
                style: "single",
                bib: true,
            }
            answerPrompts(answers, {}, [], "test-single")
        })
    })

    context("Module files", () => {
        // basic testing of standard templating
        it('input', () => {
            var answers = {
                style: "input",
                bib: true,
            }
            answerPrompts(answers, {}, [], "test-input")
        })
        // basic testing of standard templating
        it('include', () => {
            var answers = {
                style: "include",
                bib: true,
            }
            answerPrompts(answers, {}, [], "test-include")
        })
        // basic testing of standard templating
        it('subfiles', () => {
            var answers = {
                style: "subfile",
                bib: true,
            }
            answerPrompts(answers, {}, [], "test-subfile")
        })
    })

    context("Chapter files", () => {
        // basic testing of standard templating
        it('chapter', () => {
            var answers = {
                style: "chapter",
            }
            answerPrompts(answers, {}, [], "test-chapter")
        })
    })

})