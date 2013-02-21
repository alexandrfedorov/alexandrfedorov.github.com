# Original idea came from https://github.com/codegram/haml-jekyll-extension
# and http://rfelix.com/2010/01/19/jekyll-extensions-minus-equal-pain/ 
#
# This extension allows the use of Haml layout templates in Jekyll.  It has
# the benefit of not requiring the use to generate the html files in the
# source folder. Instead, we generate the HTML into the _cache folder and
# then load the Layout objects from those files.  This does affect any other
# plugin or extension that directly reads the layout files rather than
# referencing the layout objects from the Jekyll site instance.
begin
  require 'haml'
rescue LoadError
  require 'rubygems'
  require 'haml'
end
 
module Jekyll
  class Site
    def compile_haml_layouts
      prefix = self.config["source"].sub(/^\.\//, '')
      Dir.glob(File.join(self.source, "_layouts", "*.haml")).each do |f| 
        begin
          origin = File.open(f).read
          result = Haml::Engine.new(origin).render
          raise HamlErrorException.new if result.empty?
          path = prefix + f.split(self.source)[1]
          puts "   render #{path}"
          output_file_name = File.join("_cache", "_layouts", File.basename(f, '.haml') + '.html')
          FileUtils.mkpath(File.dirname(output_file_name))
          File.open(output_file_name,'w') {|f| f.write(result)} if !File.exists?(output_file_name) or (File.exists?(output_file_name) and result != File.read(output_file_name))
        rescue HamlErrorException => e
        end
      end
    end
  end
 
  class HamlErrorException < Exception
  end
 
  AOP.around(Site, :read_layouts) do |site_instance, args, proceed, abort|
    site_instance.compile_haml_layouts
    old_source = site_instance.source
    site_instance.source = '_cache'
    result = proceed.call
    site_instance.source = old_source
    result
  end
end