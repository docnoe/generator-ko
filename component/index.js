'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var chalk = require('chalk');

var ComponentGenerator = yeoman.generators.NamedBase.extend({

    detectSourceBase: function() {
        var bowerrc = fs.readFileSync(".bowerrc");
        bowerrc = JSON.parse(bowerrc);
        this.sourceBase = bowerrc.directory.split("bower_modules")[0]
    },

    detectCodeLanguage: function() {
        this.usesTypeScript = fs.existsSync(this.sourceBase + 'app/startup.ts')
        this.usesCoffeeScript = fs.existsSync(this.sourceBase + 'app/startup.coffee')
        this.codeFileExtension = ".js";
        if (this.usesTypeScript) {
            this.codeFileExtension = ".ts";
        }
        if (this.usesCoffeeScript) {
            this.codeFileExtension = ".coffee";
        }
    },

    init: function() {
        var codeLanguage = "JavaScript" //this.usesTypeScript ? 'TypeScript' : 'JavaScript';
        if (this.usesTypeScript) {
            codeLanguage = "TypeScript";
        }
        if (this.usesCoffeeScript) {
            codeLanguage = "CoffeeScript";
        }
        console.log('Creating component \'' + this.name + '\' (' + codeLanguage + ')...');
        this.componentName = this.name;
        this.dirname = this.sourceBase + 'components/' + this._.dasherize(this.name) + '/';
        this.filename = this._.dasherize(this.name);
        this.viewModelClassName = this._.classify(this.name);
    },

    template: function() {
        this.copy('view.html', this.dirname + this.filename + '.html');
        this.copy('viewmodel' + this.codeFileExtension, this.dirname + this.filename + this.codeFileExtension);
    },

    addComponentRegistration: function() {
        var startupFile = this.sourceBase + 'app/startup' + this.codeFileExtension;
        readIfFileExists.call(this, startupFile, function(existingContents) {
            var existingRegistrationRegex = new RegExp('\\bko\\.components\\.register\\(\s*[\'"]' + this.filename + '[\'"]');
            if (existingRegistrationRegex.exec(existingContents)) {
                this.log(chalk.white(this.filename) + chalk.cyan(' is already registered in ') + chalk.white(startupFile));
                return;
            }
            var token = '// [Scaffolded component registrations will be inserted here. To retain this feature, don\'t remove this comment.]';
            if (this.usesCoffeeScript) {
                token = '# [Scaffolded component registrations will be inserted here. To retain this feature, don\'t remove this comment.]'
            };
            var regex = new RegExp('^(\\s*)(' + token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + ')', 'm'),
                modulePath = 'components/' + this.filename + '/' + this.filename,
                lineToAdd = this.usesCoffeeScript ? 'ko.components.register \"' + this.filename + '\", \n    require: \'' + modulePath + '\'' : 'ko.components.register(\'' + this.filename + '\', { require: \'' + modulePath + '\' });',
                newContents = existingContents.replace(regex, '$1' + lineToAdd + '\n$&');
            fs.writeFile(startupFile, newContents);
            this.log(chalk.green('   registered ') + chalk.white(this.filename) + chalk.green(' in ') + chalk.white(startupFile));

            if (fs.existsSync('gulpfile.js')) {
                this.log(chalk.magenta('To include in build output, reference ') + chalk.white('\'' + modulePath + '\'') + chalk.magenta(' in ') + chalk.white('gulpfile.js'));
            }
        });
    }

});

function readIfFileExists(path, callback) {
    if (fs.existsSync(path)) {
        callback.call(this, this.readFileAsString(path));
    }
}

module.exports = ComponentGenerator;
