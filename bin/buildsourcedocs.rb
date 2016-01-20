#!/usr/bin/env ruby

require 'find'
require 'cgi'
require 'coderay'

scriptdir    = File.dirname(__FILE__)
basedir      = File.expand_path(File.join(scriptdir, '..'))
docsdir      = File.join(basedir, 'docs', 'api', 'source')

classesdir      = File.join(basedir, 'classes')
systemdir       = File.join(basedir, 'system')
examplesdir     = File.join(basedir, 'examples')
compositionsdir = File.join(basedir, 'compositions')
appsdir         = File.join(basedir, 'apps')

dirs = [classesdir, systemdir, examplesdir, compositionsdir, appsdir]

dirs.each do |dir|
  Find.find(dir) do |path|
    if !FileTest.directory?(path) && File.extname(path) == '.js'
      name = path[/^.*?([^\/\\]+)\.js$/, 1]
      filedata = File.open(path).read

      outfile = File.join(docsdir, "#{name}.html")
      at = 1
      while (File.exist?(outfile))
        at = at + 1
        outfile = File.join(docsdir, "#{name}#{at}.html")
      end

      puts "Write #{outfile}"
      File.open(outfile, "w") { |f|
        f.puts(CodeRay.scan(filedata, :js).page)
      }
    end
  end

end
