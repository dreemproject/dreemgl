require "jsduck/tag/tag"
require "cgi"

class Attribute < JsDuck::Tag::MemberTag

  def initialize
    @tagname = :attribute
    @repeatable = true
    @pattern = "attribute"
    @member_type = {
        title: "Attributes",
        position: MEMBER_POS_CFG - 0.1,
        icon: File.dirname(__FILE__) + '/attr.png',
        :toolbar_title => "Attributes",
        :subsections => [
            {:title => "Required attributes", :filter => {:required => true}},
            {:title => "Optional attributes", :filter => {:required => false}, :default => true},
        ]
    }
  end

  # @attribute {Type} [name=default] (required) ...
  def parse_doc(p, pos)
    tag = p.standard_tag(tagname: :attribute, type: true, name: true, default: true, optional: true)

    # don't parse (required) after subproperties
    unless tag[:name] =~ /\./
      tag[:optional] = false if parse_required(p)
    end

    tag[:doc] = :multiline
    tag
  end

  def process_doc(h, tags, pos)
    p = tags[0]
    h[:type] = p[:type]
    h[:default] = p[:default]
    h[:required] = true if p[:optional] == false

    # Documentation after the first @attribute is part of the top-level docs.
    h[:doc] += p[:doc]

    nested = JsDuck::Doc::Subproperties.nest(tags, pos)[0]
    h[:properties] = nested[:properties]
    h[:name] = nested[:name]
  end


  def parse_required(p)
    p.hw.match(/\(required\)/i)
  end

  def process_code(code)
    h = super(code)
    h[:type] = code[:type]
    h[:default] = code[:default]
    h[:accessor] = code[:accessor]
    h[:evented] = code[:evented]
    h
  end

  # Do the merging of :type field
  def merge(h, docs, code)
    if h[:type] == nil
      h[:type] = code[:tagname] == :method ? "Function" : "Object"
    end
  end

  def to_html(member, cls)
    member_link(member) + " : " + member[:html_type]
  end

end

module JsDuck::Tag
  class Class < Tag

    def parse_doc(p, pos)
      name = p.ident_chain
      category =if p.look(/\s*\{.*\}.*$/)
        p.match(/\s*\{/)
        p.match(/[^\}]+/)
        p.match(/\}/)
      end

      {
          tagname: :class,
          name: name,
          category: category
      }
    end

  end
end

class License < JsDuck::Tag::Tag
  def initialize
    @tagname = :license
    @pattern = "license"
    @html_position = POS_DOC + 0.1
    @repeatable = true
  end

  def parse_doc(scanner, position)
    text = scanner.match(/.*$/)
    return { :tagname => :license, :text => text }
  end

  def process_doc(context, license_tags, position)
    context[:license] = license_tags.map {|tag| tag[:text] }
  end

  def to_html(context)
    licenses = context[:license].map {|license| "<b>#{license}</b>" }.join(" and ")
    <<-EOHTML
      <p>This software is licensed under: #{licenses}.</p>
    EOHTML
  end
end

