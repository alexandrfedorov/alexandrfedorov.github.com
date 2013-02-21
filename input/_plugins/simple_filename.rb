module Jekyll
  class Post
    class << self
      attr_accessor :category_indecies
      Post.category_indecies = {}
    end
    
    remove_const :MATCHER
    MATCHER = /^(?:(.*)\/)?(?:(\d+)\. )?(.*)(\.[^.]+)$/
    
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
          self.categories.pop!
        end
      end
      self.date = Time.now - id.to_i
      self.slug = slug
      self.ext = ext
    end
  end
end