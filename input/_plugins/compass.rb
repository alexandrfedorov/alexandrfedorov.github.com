begin
  require 'compass'
  require 'compass/exec'
rescue LoadError
  require 'rubygems'
  require 'compass'
  require 'compass/exec'
end
 
module Jekyll
  class Site
    def compile_compass
      begin
        cmd_class = Compass::Commands['compile']
        cmd = cmd_class.new(Dir.getwd, {})
        cmd.execute
 
        if cmd.successful?
          cache_dir = File.join('_cache', 'css')
          if File.exists?(cache_dir)
            entries = Dir.chdir(cache_dir) { Dir['*'] }
            entries.each do |f|
              static_files << StaticFile.new(self, '_cache', 'css', f)
            end
          end
        end
 
        cmd.successful?
      rescue CompassErrorException => e
      end
    end
  end
 
  class CompassErrorException < Exception
  end
 
  AOP.after(Site, :process) do |site_instance, args|
    site_instance.compile_compass
  end
end