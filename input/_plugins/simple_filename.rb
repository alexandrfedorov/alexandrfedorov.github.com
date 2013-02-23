module Jekyll
  class Post
    class << self
      attr_accessor :category_indecies
      Post.category_indecies = {}
    end
    
    remove_const :MATCHER
    MATCHER = /^(?:(.*)\/)?(?:(\d+)\. )?(.*)(\.[^.]+)$/
    LANGUAGES = %[en ru de]
    
    def process(name)
      m, cats, id, slug, ext = *name.match(MATCHER)
      if cats
        bits = cats.split('. ')
        if bits.size > 1
          Post.category_indecies[bits[1]] = bits[0].to_i
          cats = bits[1]
        end
        self.categories = cats.split('/')
        if self.categories.last.match(/index.html?/)
          self.categories.pop
        end
        if LANGUAGES.include? slug
          self.categories.unshift slug
          slug = self.categories.pop
        end
      end
      if %w[.html .htm .md .haml].include?(ext) && slug != 'index'
        self.categories << slug
        slug = 'index'
        self.ext = 'html'
      end
      self.date = Time.now - id.to_i
      self.slug = slug
      self.ext = ext
    end


    alias_method :read_yaml_oldest, :read_yaml

    def read_yaml(*args)
      read_yaml_oldest(*args)
      if LANGUAGES.include? self.categories[0]
        self.data['layout'] ||= self.categories[0]
        if self.categories.size > 1
          self.data['title'] ||= title(self.categories.last)
        end
      end
      self.data
    end

    def skippable?
      (self.categories & self.site.config['skippable']).size > 0 ||
      self.data["skippable"] ||
      title == "Index" 
    end

    def title(data = nil)
      return self.data["title"] if !data && self.data["title"]
      data ||= self.slug
      data.split('-').select {|w| w.capitalize! || w }.join(' ')  
    end

    alias_method :to_liquid_old, :to_liquid
    def to_liquid
      to_liquid_old.deep_merge({
        "skippable" => skippable?,
        "video" => self.categories.include?("video"),
        "formatted_content" => !skippable? && converter.convert(self.content)
      })
    end
  end

  class Page
    alias_method :template_old, :template
    def template
      self.basename != 'index' && self.site.config["pagelink"] || template_old
    end


    alias_method :read_yaml_old, :read_yaml
    def read_yaml(*args)
      read_yaml_old(*args)
      self.data["layout"] ||= (@dir.split('/') & site.config['languages'])[0]
      self.data
    end

    alias_method :to_liquid_old, :to_liquid
    def to_liquid
      to_liquid_old.deep_merge({
        "ext" => @ext,
        "categories" => @dir.split('/')
      })
    end
  end

  class Site

    def read_directories(dir = '')
      base = File.join(self.source, dir)
      entries = Dir.chdir(base) { filter_entries(Dir.entries('.')) }

      self.read_posts(dir)

      entries.each do |f|
        f_abs = File.join(base, f)
        f_rel = File.join(dir, f)
        if File.directory?(f_abs)
          next if self.dest.sub(/\/$/, '') == f_abs
          read_directories(f_rel)
        elsif !File.symlink?(f_abs)
          dirs = f_abs.split('/')
          first3 = File.open(f_abs) { |fd| fd.read(3) }
          if first3 == "---" || (dirs & config['languages']).size > 0
            # file appears to have a YAML header so process it as a page
            pages << Page.new(self, self.source, dir, f)
          else
            # otherwise treat it as a static file
            static_files << StaticFile.new(self, self.source, dir, f)
          end
        end
      end
    end
  end

  module Filters
    def preserve(content)
      content.gsub(/\n/, '\\n')
    end

    def multiline(content)
      "= %{" + preserve(content).gsub(/\}/, '\}') + "}"
    end

    def indent(prefix = "  ")
      content.gsub(/\n/, prefix + "\n")
    end

    def to_class(post)
      ((post["categories"] || []) + [post["slug"]] - ["index"]).compact * " "
    end

    def to_language(url, lang = "en")
      url.sub %r{/(en|ru|de)/}, '/' + lang + '/'
    end

    def to_title(post, default = "Sound magician")
      if (post["skippable"] || !post["title"])
        default
      else
        post["title"]
      end
    end
  end
end