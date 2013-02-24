module Jekyll

  class CategoryPage < Page
    def initialize(site, base, dir, category, language)
      @site = site
      @base = base
      @dir = '/' + dir
      @name = 'index.html'
      @category = category
      @language = language

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category.haml')
      self.data['category'] = category
      self.data['layout'] = language;
    end

    def to_liquid(*args)
      self.data['posts'] = self.site.posts.select do |post|
        post.categories.include?(@language) && post.categories.include?(@category)
      end
      self.data['all_categories'] = self.site.categories.keys.select do |cat|
        !site.config['languages'].include?(cat) && !site.config['skip_categories'].include?(cat)
      end
      super(*args)
    end

    def transform(*args)
      super(*args)
    end

    def read_yaml(*args)
      super(*args)
      self.content = ::Haml::Engine.new(self.content).render
      self.data
    end
  end

  class CategoryPageGenerator < Generator
    safe true
    
    def generate(site)
      if site.layouts.key? 'category'
        site.config['languages'].each do |language|
          skip = site.config['skip_categories'] || []
          site.categories.keys.each do |category|
            unless skip.include? category
              dir = category
              if site.config['languages'].include? dir
                next if dir != language
              else
                dir = File.join(language, dir) 
              end
              page = CategoryPage.new(site, site.source, dir, category, language)
              print ' generate ' + dir + page.url + "\n"
              site.pages << page
            end
          end
        end
      end
    end
  end

end