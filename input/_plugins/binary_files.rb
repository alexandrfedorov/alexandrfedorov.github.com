module Jekyll
  class Post
    alias_method :read_yaml_old, :read_yaml

    def read_yaml(*args)
      if plaintext?
        read_yaml_old(*args)
      else
        self.data ||= {}
      end
    end

    alias_method :do_layout_old, :do_layout
    def do_layout(*args)
      prefix = self.site.config["destination"].sub(/^\.\//, '')
      if plaintext?
        print '     make ' + prefix + url + "\n"
        do_layout_old(*args)
      else
        self.output = self.content
        @url = self.url.sub(/(\.html)?$/, self.ext)
        print '     move ' + prefix + @url + "\n"
        self
      end
    end

    alias_method :template_old, :template
    def template
      if plaintext?
        template_old
      else
        self.site.config["binarylink"]
      end
    end

    def plaintext?
       %w[.htm .html .md .MD .haml].include?(self.ext)
    end
  end
end


if RUBY_VERSION =~ /1.9/
  Encoding.default_external = Encoding::UTF_8
  Encoding.default_internal = Encoding::UTF_8
end