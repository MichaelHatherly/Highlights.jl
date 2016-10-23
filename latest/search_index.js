var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#Highlights.jl-1",
    "page": "Home",
    "title": "Highlights.jl",
    "category": "section",
    "text": "A source code highlighter for Julia."
},

{
    "location": "index.html#Introduction-1",
    "page": "Home",
    "title": "Introduction",
    "category": "section",
    "text": "This package provides a collection of source code lexers for various languages and markup formats and a selection of themes that can be used to customise the style of the formatted source code. Additional lexer definitions are straightforward to add and are based on the regular expression lexing mechanism used by Pygments."
},

{
    "location": "index.html#Installation-1",
    "page": "Home",
    "title": "Installation",
    "category": "section",
    "text": "Highlights is not yet a registered package and so must be installed viaPkg.clone(\"https://github.com/JuliaDocs/Highlights.jl\")The package has no dependencies other than Julia (0.4 and up) itself."
},

{
    "location": "index.html#Usage-1",
    "page": "Home",
    "title": "Usage",
    "category": "section",
    "text": "See the User Guide for an introduction to using the package;\nthe Theme Guide will explain how to add new themes;\nand the Lexer Guide will walk you through writing new lexer definitions."
},

{
    "location": "man/guide.html#",
    "page": "User Guide",
    "title": "User Guide",
    "category": "page",
    "text": ""
},

{
    "location": "man/guide.html#User-Guide-1",
    "page": "User Guide",
    "title": "User Guide",
    "category": "section",
    "text": "So how do we highlight source code using the Highlights package?Firstly we import the package – assuming it has already been installed following the guidelines found in Installation.using HighlightsThis will make several names available to us for use:highlight colourises and formats strings;\nstylesheet prints out style definitions;\nthe Themes module provides a selection of theme definitions;\nand the Lexers module provides a collection of lexer definitions.Next we need a String to highlight. For this example we will be using the code sample from The Julia Language website.source =\n    \"\"\"\n    function mandel(z)\n        c = z\n        maxiter = 80\n        for n = 1:maxiter\n            if abs(z) > 2\n                return n-1\n            end\n            z = z^2 + c\n        end\n        return maxiter\n    end\n\n    function randmatstat(t)\n        n = 5\n        v = zeros(t)\n        w = zeros(t)\n        for i = 1:t\n            a = randn(n,n)\n            b = randn(n,n)\n            c = randn(n,n)\n            d = randn(n,n)\n            P = [a b c d]\n            Q = [a b; c d]\n            v[i] = trace((P.'*P)^4)\n            w[i] = trace((Q.'*Q)^4)\n        end\n        std(v)/mean(v), std(w)/mean(w)\n    end\n    \"\"\"\nnothing # hideTo highlight source we pass it to highlight along with the output stream, the required output format, the lexer, and, optionally, the theme.open(\"source.html\", \"w\") do stream\n    highlight(stream, MIME(\"text/html\"), source, Lexers.JuliaLexer)\nendThis will print the highlighted version of source to source.html using the JuliaLexer definition and the DefaultTheme. We can also output LaTeX formatted text by using MIME(\"text/latex\") instead.Note though that at this point we have not included any style information needed to colourise and typeset the text that highlight has printed to the file. For that we need to call stylesheet first as follows:open(\"source.html\", \"w\") do stream\n    stylesheet(stream, MIME(\"text/html\"), Lexers.JuliaLexer)\n    highlight(stream, MIME(\"text/html\"), source, Lexers.JuliaLexer)\nendThe highlighted version of source is available from here.stylesheet is passed most of the same information that highlight is aside from the source. We need to pass JuliaLexer to it since otherwise stylesheet will not know which tokens could possibly be generated by the lexer.note: Note\nThe above example will not produce a complete HTML page. No <html>, <head>, or <body> are printed. This is left to the user to decide what approach would suit their usecase best.Also note that if you would like to print the stylesheet to a .css file rather than to the same index.html then you may use:open(\"theme.css\", \"w\") do stream\n    stylesheet(stream, MIME(\"text/css\"), Lexers.JuliaLexer)\nendThat's all there is to it. Have a look at the Theme Guide and Lexer Guide if you would like to define your own themes and lexers. Please consider contributing any that you write back to the package so that all users can benefit from them – no lexer or theme is too obscure to include in Highlights!"
},

{
    "location": "man/theme.html#",
    "page": "Theme Guide",
    "title": "Theme Guide",
    "category": "page",
    "text": ""
},

{
    "location": "man/theme.html#Theme-Guide-1",
    "page": "Theme Guide",
    "title": "Theme Guide",
    "category": "section",
    "text": "This page outlines how to go about adding new theme definitions to Highlights."
},

{
    "location": "man/theme.html#Required-Imports-1",
    "page": "Theme Guide",
    "title": "Required Imports",
    "category": "section",
    "text": "To get started adding a new theme definition you will need to import the following two names from the Highlights module and one from the Highlights.Themes module.import Highlights: AbstractTheme, definition\nimport Highlights.Themes: @S_strIn the next two sections we'll explain the purpose of each of those imports."
},

{
    "location": "man/theme.html#The-AbstractTheme-Type-1",
    "page": "Theme Guide",
    "title": "The AbstractTheme Type",
    "category": "section",
    "text": "AbstractTheme is the super type of all theme definitions in Highlights. A theme is just an abstract type that is a subtype of Highlights.AbstractTheme. For this example we will define a new theme called, very imaginatively, CustomTheme:abstract CustomTheme <: AbstractThemeThat's all there is to the type itself. Next we'll define what colours should be used for each token [1] when we highlight source code using our new theme."
},

{
    "location": "man/theme.html#The-definition-Definition-1",
    "page": "Theme Guide",
    "title": "The definition Definition",
    "category": "section",
    "text": "Now we'll use the definition function to tell Highlights what colours we want different parts of our source code to be highlighted in. We do this by defining a new Method of definition for our CustomTheme type as follows:definition(::Type{CustomTheme}) = Dict(\n    :style => S\"bg: f7f3ee; fg: 605b53\",\n    :tokens => Dict(\n        :text    => S\"\",\n        :keyword => S\"fg: 614c60; bold\",\n        :string  => S\"fg: a1789f\",\n        :comment => S\"fg: ad9c84; italic\",\n    ),\n)\nnothing # hideThere's a couple of things going on up there, so let's split it into sections:The first line is our standard short-form method definition used in Julia. We define a method definition that accepts the type CustomTheme as it's one argument and returns a new Dict that contains our theme definition.\nLine two, i.e. :style => ..., defines the default style for code blocks styled with this theme. The S\" string macro is used to write the nessecary style information. It is a ;-separated string where each part of the string is one of\nbg: <html-color-code> – the background colour as an HTML 3 or 6 digit hex code;\nfg: <html-color-code> – as above, but for the foreground colour;\nbold – boldface text;\nitalic – emphasised text;\nunderline – underlined text.\nLine three, the :tokens line, defines the Dict of token-to-style rules;\nLine four defines what colour default text should be, this must always be included for the theme to work. We set it to S\"\", which is \"no styling\".\nThe rest of the lines just set out rules for other tokens that we would like to emphasise using different colours and font styles."
},

{
    "location": "man/theme.html#Using-the-theme-1",
    "page": "Theme Guide",
    "title": "Using the theme",
    "category": "section",
    "text": "Now that we've written a new theme we might as well try it out. We'll use the new theme to highlight itself:using Highlights\nsource =\n\"\"\"\n# Required imports...\nimport Highlights: AbstractTheme, definition\nimport Highlights.Themes: @S_str\n\n# ... the theme type...\nabstract CustomTheme <: AbstractTheme\n\n# ... and finally the theme definition.\ndefinition(::Type{CustomTheme}) = Dict(\n    :style => S\"bg: f7f3ee; fg: 605b53\",\n    :tokens => Dict(\n        :text    => S\"\",\n        :keyword => S\"fg: 614c60; bold\",\n        :string  => S\"fg: a1789f\",\n        :comment => S\"fg: ad9c84; italic\",\n    ),\n)\n\n# Let's also print it to a file to we can have a look.\nopen(\"custom-theme.html\", \"w\") do stream\n    stylesheet(stream, MIME(\"text/html\"), Lexers.JuliaLexer, CustomTheme)\n    highlight(stream, MIME(\"text/html\"), source, Lexers.JuliaLexer, CustomTheme)\nend\n\"\"\"open(\"custom-theme.html\", \"w\") do stream\n    stylesheet(stream, MIME(\"text/html\"), Lexers.JuliaLexer, CustomTheme)\n    highlight(stream, MIME(\"text/html\"), source, Lexers.JuliaLexer, CustomTheme)\nendThe highlighted code can be found here.[1]: \"Tokens\" refer to the substrings of the input string with an identified \"meaning\". For example :string, :number, :text, or :keyword."
},

{
    "location": "man/lexer.html#",
    "page": "Lexer Guide",
    "title": "Lexer Guide",
    "category": "page",
    "text": ""
},

{
    "location": "man/lexer.html#Lexer-Guide-1",
    "page": "Lexer Guide",
    "title": "Lexer Guide",
    "category": "section",
    "text": "New lexer definitions are added in a similar manner to those for themes. For this guide we'll be creating a really simple lexer that can highlight C/C++ style comments and nested multiline comments."
},

{
    "location": "man/lexer.html#A-Basic-Lexer-1",
    "page": "Lexer Guide",
    "title": "A Basic Lexer",
    "category": "section",
    "text": "First, we import the necessary names from Highlights.using Highlightsimport Highlights: AbstractLexer, definitionThen we define a new type to represent our lexer.abstract CommentLexer <: AbstractLexerFinally we add a method to the definition function.note: Note\ndefinition here is the same function as used for themes in the previous section.We'll list the entire definition and then go over each part individually.definition(::Type{CommentLexer}) = Dict(\n    :name => \"Comments\",\n    :description => \"A C-style comment lexer.\",\n    :tokens => Dict(\n        :root => [\n            (r\"//.*\\n\", :comment_singleline),\n            (r\"/\\*\",    :comment_multiline,   :multiline_comments),\n            (r\"[^/]+\",  :text)\n        ],\n        :multiline_comments => [\n            (r\"/\\*\",     :comment_multiline,  :__push__),\n            (r\"\\*/\",     :comment_multiline,  :__pop__),\n            (r\"[^/\\*]+\", :comment_multiline),\n        ],\n    )\n)\nnothing # hideSo how does it work?Firstly, we define a new method of definition in a similar way to the previous section on themes. This definition returns a Dict containing all the rules and metadata needed to lex a string of source code containing /*, //, and */.:name is a metadata field that provides a human-readable name for the lexer. :description provides some basic details about the lexer and what it is for.:tokens is a Dict of different states that the lexer steps through while trying to determine what to do with each character of a string. In this lexer we have two states – :root and :multiline_comments.note: Note\nThe lexer always starts in the :root state, so this is the only state that needs to be provided. You may find that some lexer definitions can be written with only a :root state, while others may need a significant number of different states to function correctly.Each state is a Vector of rules that are tested against sequentially until one matches the current position in the source code that we are trying to lex. On a successful match we move the current position forward and begin again at the first rule of the current state.In the :root state of our CommentLexer we begin with(r\"//.*\\n\", :comment_singleline)which tests whether the current position in our source code matches the given regular expression r\"//.*\", i.e. a single line comment such as// This is a singleline comment.If it matches then we create a new :comment_singleline token that spans the entire match – from / to . in the above example.When the rule does not match we then move onto the next one:(\"r/\\*\", :comment_multiline, :multiline_comments)which tries to match against a string starting with /*, i.e. the start of a multiline comment such as/*\n   A\n   multiline\n   comment.\n */When this rule is successfully matched we, like in the previous example, create a new :comment_multiline token and move passed the match. Instead of going back to the start of the current state though, we first enter a new state called :multiline_comments. Once that state returns then we jump back to the first rule of the :root state.The last rule of the :root state isn't all that interesting:(r\"[^/]+\", :text)This just matches any non-comment characters and assigns them to a :text token.Now lets look at the :multiline_comments state.(r\"/\\*\", :comment_multiline, :__push__),When the above rule matches, i.e. the start of a multiline comment, then we enter a special state called :__push__. What :__push__ does is just call the current state again, so internally we push a new function call onto the call stack.A similar naming scheme is used for the :__pop__ state, where we return from the current state and so pop the current function call off the call stack:(r\"\\*/\", :comment_multiline, :__pop__),And the last rule, similar to the :text rule in :root, just matches all non multiline comment characters and assigns the result to a :comment_multiline token:(r\"[^/\\*]+\", :comment_multiline),note: Note\nAll the tokens in :multiline_comments are assigned to :comment_multiline. This is because when we are inside a nested comment everything will be a multiline comment.That's all there is to writing a basic lexer. There are a couple of other rule types that can be used to make more complex lexers, which are described at the end of this section of the manual. First, though, we'll highlight some text using this new lexer to see whether it works correctly.source =\n    \"\"\"\n    // A single line comment.\n\n    This is not a comment.\n\n    /*\n       And a multiline one\n       /* with a nested comment */\n       inside.\n     */\n\n    This isn't a comment either.\n\n    // And another single line // comment.\n    \"\"\"\nopen(\"comments-lexer.html\", \"w\") do stream\n    stylesheet(stream, MIME(\"text/html\"), CommentLexer)\n    highlight(stream, MIME(\"text/html\"), source, CommentLexer)\nendThe resulting highlighted text can be see here."
},

{
    "location": "man/lexer.html#Other-Rules-1",
    "page": "Lexer Guide",
    "title": "Other Rules",
    "category": "section",
    "text": "There are several other rules available for building lexers. They are briefly outlined below. To get a better idea of how to use these take a look at some of the lexers that are defined in the src/lexers/ directory."
},

{
    "location": "man/lexer.html#Including-States-1",
    "page": "Lexer Guide",
    "title": "Including States",
    "category": "section",
    "text": ":name_of_stateThis rule copies the contents of the :name_of_state state into another state to help avoid duplicating rules.warning: Warning\nDe not create a cycle between two or more states by including states within each other recursively.(custom_matcher, :token_name)Use a custom function as the matcher rather than a regular expression. This function must take a Compiler.Context object and return a UnitRange{Int} as the result. A range of 0:0 signifies no match.(r\"(group_one)(group_two)\", (:group_one_token, :group_two_token))Assigns two or more tokens at once based on the capture groups present in the regular expression that is used. Token count and group count must match exactly.(r\"...\", OtherLexer)Lexer the source code matched by r\"...\" using a different lexer called OtherLexer.(r\"...\", :token, (:state_3, :state_2, :state_1))Push a tuple of states onto the lexer stack that will be called from right to left.note: Note\nFor all the above rules a regular expression and custom matcher function can be interchanged except for the capture groups rule."
},

{
    "location": "demo/lexers.html#",
    "page": "Lexers",
    "title": "Lexers",
    "category": "page",
    "text": ""
},

{
    "location": "demo/lexers.html#Lexers-1",
    "page": "Lexers",
    "title": "Lexers",
    "category": "section",
    "text": "The following list of pages showcase each of the available lexer definitions using DefaultTheme.Pages = sort([joinpath(\"lexers\", f) for f in readdir(\"lexers\")])"
},

{
    "location": "demo/lexers/julia.html#",
    "page": "Julia",
    "title": "Julia",
    "category": "page",
    "text": ""
},

{
    "location": "demo/lexers/julia.html#Julia-1",
    "page": "Julia",
    "title": "Julia",
    "category": "section",
    "text": "Highlights.Lexers.JuliaLexer – A lexer for Julia source code.\n<style>\npre.hljl {\n    border: 1px solid #ccc;\n    margin: 5px;\n    padding: 5px;\n    overflow-x: auto;\n    color: #444444; background-color: #fbfbfb; }\npre.hljl > span.hljl-keyword_declaration { color: #d66661; font-style: italic; }\npre.hljl > span.hljl-string_backtick { color: #c93d39; }\npre.hljl > span.hljl-string { color: #c93d39; }\npre.hljl > span.hljl-keyword { color: #945bb0; font-weight: bold; }\npre.hljl > span.hljl-name_decorator { color: #d66661; }\npre.hljl > span.hljl-number_hex { color: #3b972e; }\npre.hljl > span.hljl-keyword_pseudo { color: #945bb0; font-weight: bold; }\npre.hljl > span.hljl-string_escape { color: #3b972e; }\npre.hljl > span.hljl-string_char { color: #c93d39; }\npre.hljl > span.hljl-number_integer { color: #3b972e; }\npre.hljl > span.hljl-keyword_constant { color: #3b972e; font-style: italic; }\npre.hljl > span.hljl-text { }\npre.hljl > span.hljl-name_function { color: #4266d5; }\npre.hljl > span.hljl-operator { color: #666666; font-weight: bold; }\npre.hljl > span.hljl-name { }\npre.hljl > span.hljl-number_float { color: #3b972e; }\npre.hljl > span.hljl-comment_singleline { color: #999977; font-style: italic; }\npre.hljl > span.hljl-number { color: #3b972e; }\npre.hljl > span.hljl-comment { color: #999977; font-style: italic; }\npre.hljl > span.hljl-number_bin { color: #3b972e; }\npre.hljl > span.hljl-string_iterpol { }\npre.hljl > span.hljl-string_macro { color: #c93d39; }\npre.hljl > span.hljl-number_oct { color: #3b972e; }\npre.hljl > span.hljl-comment_multiline { color: #999977; font-style: italic; }\npre.hljl > span.hljl-keyword_end { color: #945bb0; font-weight: bold; }\npre.hljl > span.hljl-punctuation { }\n</style>\n\n<pre class='hljl'>\n<span class='hljl-comment_multiline'>#=\nMultiline comments...\n    can be...\n    #= nested #= to =# any depth. =#\n=#</span><span class='hljl-text'>\n\n</span><span class='hljl-comment_singleline'># A single line comment.</span><span class='hljl-text'>\n    </span><span class='hljl-comment_singleline'># And another one.</span><span class='hljl-text'>\n\n</span><span class='hljl-comment_singleline'># Array and tuple literals.</span><span class='hljl-text'>\n</span><span class='hljl-punctuation'>[</span><span class='hljl-number_integer'>1</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-number_integer'>3</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-number_integer'>3</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-number_integer'>4</span><span class='hljl-punctuation'>][</span><span class='hljl-number_integer'>1</span><span class='hljl-operator'>:</span><span class='hljl-keyword_end'>end</span><span class='hljl-punctuation'>]</span><span class='hljl-text'>\n</span><span class='hljl-punctuation'>(</span><span class='hljl-number_integer'>1</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-number_integer'>2</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-number_float'>1.0</span><span class='hljl-punctuation'>)[</span><span class='hljl-number_integer'>1</span><span class='hljl-operator'>:</span><span class='hljl-number_integer'>2</span><span class='hljl-punctuation'>]</span><span class='hljl-text'>\n</span><span class='hljl-punctuation'>[(</span><span class='hljl-number_integer'>1</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-number_integer'>3</span><span class='hljl-punctuation'>),</span><span class='hljl-text'> </span><span class='hljl-punctuation'>(</span><span class='hljl-number_integer'>3</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-number_integer'>4</span><span class='hljl-punctuation'>)][</span><span class='hljl-keyword_end'>end</span><span class='hljl-text'> </span><span class='hljl-operator'>-</span><span class='hljl-text'> </span><span class='hljl-number_integer'>1</span><span class='hljl-punctuation'>]</span><span class='hljl-text'>\n\n</span><span class='hljl-comment_singleline'># Keywords.</span><span class='hljl-text'>\n</span><span class='hljl-keyword'>if</span><span class='hljl-text'> </span><span class='hljl-name'>x</span><span class='hljl-text'> </span><span class='hljl-keyword_pseudo'>in</span><span class='hljl-text'> </span><span class='hljl-name'>y</span><span class='hljl-text'>\n    </span><span class='hljl-comment_singleline'># ...</span><span class='hljl-text'>\n</span><span class='hljl-keyword_end'>end</span><span class='hljl-text'>\n\n</span><span class='hljl-name'>x</span><span class='hljl-text'> </span><span class='hljl-keyword_pseudo'>in</span><span class='hljl-text'> </span><span class='hljl-name'>y</span><span class='hljl-text'> </span><span class='hljl-operator'>?</span><span class='hljl-text'> </span><span class='hljl-keyword_constant'>false</span><span class='hljl-text'> </span><span class='hljl-operator'>:</span><span class='hljl-text'> </span><span class='hljl-keyword_constant'>true</span><span class='hljl-text'>\n\n</span><span class='hljl-keyword'>let</span><span class='hljl-text'> </span><span class='hljl-name'>x</span><span class='hljl-text'> </span><span class='hljl-operator'>=</span><span class='hljl-text'> </span><span class='hljl-number_integer'>1</span><span class='hljl-text'>\n    </span><span class='hljl-keyword_declaration'>local</span><span class='hljl-text'> </span><span class='hljl-name'>t</span><span class='hljl-text'>\n    </span><span class='hljl-keyword_declaration'>global</span><span class='hljl-text'> </span><span class='hljl-name'>s</span><span class='hljl-text'>\n    </span><span class='hljl-name'>t</span><span class='hljl-text'> </span><span class='hljl-operator'>=</span><span class='hljl-text'> </span><span class='hljl-name'>x</span><span class='hljl-text'>\n    </span><span class='hljl-name'>s</span><span class='hljl-text'> </span><span class='hljl-operator'>=</span><span class='hljl-text'> </span><span class='hljl-name'>x</span><span class='hljl-text'>\n</span><span class='hljl-keyword_end'>end</span><span class='hljl-text'>\n\n</span><span class='hljl-keyword'>module</span><span class='hljl-text'> </span><span class='hljl-name'>M</span><span class='hljl-text'> </span><span class='hljl-keyword_end'>end</span><span class='hljl-text'>\n</span><span class='hljl-keyword'>baremodule</span><span class='hljl-text'> </span><span class='hljl-name'>M</span><span class='hljl-text'> </span><span class='hljl-keyword_end'>end</span><span class='hljl-text'>\n\n</span><span class='hljl-keyword'>typealias</span><span class='hljl-text'> </span><span class='hljl-name'>T</span><span class='hljl-text'> </span><span class='hljl-name'>A</span><span class='hljl-text'>\n</span><span class='hljl-keyword'>abstract</span><span class='hljl-text'> </span><span class='hljl-name'>A</span><span class='hljl-text'> </span><span class='hljl-operator'>&lt;:</span><span class='hljl-text'> </span><span class='hljl-name'>T</span><span class='hljl-text'>\n</span><span class='hljl-keyword'>type</span><span class='hljl-text'> </span><span class='hljl-name_function'>Point</span><span class='hljl-punctuation'>{</span><span class='hljl-name'>T</span><span class='hljl-punctuation'>}</span><span class='hljl-text'>\n    </span><span class='hljl-name'>x</span><span class='hljl-operator'>::</span><span class='hljl-name'>T</span><span class='hljl-text'>\n    </span><span class='hljl-name'>y</span><span class='hljl-operator'>::</span><span class='hljl-name'>T</span><span class='hljl-text'>\n\n    </span><span class='hljl-name_function'>Point</span><span class='hljl-punctuation'>(</span><span class='hljl-name'>x</span><span class='hljl-punctuation'>)</span><span class='hljl-text'> </span><span class='hljl-operator'>=</span><span class='hljl-text'> </span><span class='hljl-name_function'>new</span><span class='hljl-punctuation'>(</span><span class='hljl-name'>x</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-number_integer'>2</span><span class='hljl-name'>x</span><span class='hljl-punctuation'>)</span><span class='hljl-text'>\n\n    </span><span class='hljl-name_decorator'>@inline</span><span class='hljl-text'> </span><span class='hljl-keyword'>function</span><span class='hljl-text'> </span><span class='hljl-name_function'>Point</span><span class='hljl-punctuation'>(</span><span class='hljl-name'>x</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-name'>y</span><span class='hljl-punctuation'>)</span><span class='hljl-text'>\n        </span><span class='hljl-keyword'>return</span><span class='hljl-text'> </span><span class='hljl-name_function'>new</span><span class='hljl-punctuation'>(</span><span class='hljl-name'>y</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-name'>x</span><span class='hljl-punctuation'>)</span><span class='hljl-text'>\n    </span><span class='hljl-keyword_end'>end</span><span class='hljl-text'>\n</span><span class='hljl-keyword_end'>end</span><span class='hljl-text'>\n\n</span><span class='hljl-keyword'>immutable</span><span class='hljl-text'> </span><span class='hljl-name_function'>Empty</span><span class='hljl-punctuation'>{</span><span class='hljl-name'>T</span><span class='hljl-punctuation'>}</span><span class='hljl-text'> </span><span class='hljl-keyword_end'>end</span><span class='hljl-text'>\n\n</span><span class='hljl-keyword'>macro</span><span class='hljl-text'> </span><span class='hljl-name_function'>something</span><span class='hljl-punctuation'>(</span><span class='hljl-name'>x</span><span class='hljl-operator'>...</span><span class='hljl-punctuation'>)</span><span class='hljl-text'>\n    </span><span class='hljl-comment_singleline'># ...</span><span class='hljl-text'>\n</span><span class='hljl-keyword_end'>end</span><span class='hljl-text'>\n\n</span><span class='hljl-comment_singleline'># Character literals.</span><span class='hljl-text'>\n</span><span class='hljl-string_char'>&#39; &#39;</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-string_char'>&#39;\\n&#39;</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-string_char'>&#39;\\&#39;&#39;</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-string_char'>&#39;&quot;&#39;</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-string_char'>&#39;\\u1234&#39;</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-string_char'>&#39;⻆&#39;</span><span class='hljl-text'>\n\n</span><span class='hljl-comment_singleline'># String literals.</span><span class='hljl-text'>\n\n</span><span class='hljl-name'>⻪</span><span class='hljl-text'> </span><span class='hljl-operator'>=</span><span class='hljl-text'> </span><span class='hljl-string'>&quot;    &quot;</span><span class='hljl-text'>\n</span><span class='hljl-string'>&quot;&#39;&quot;</span><span class='hljl-text'>\n</span><span class='hljl-string'>&quot;</span><span class='hljl-string_escape'>\\&quot;\\&quot;</span><span class='hljl-string'> ...&quot;</span><span class='hljl-text'>\n</span><span class='hljl-string'>&quot;\na\n&quot;</span><span class='hljl-text'>\n</span><span class='hljl-string'>&quot;&quot;&quot;\n...\n    &quot;&quot;&quot;</span><span class='hljl-text'>\n\n</span><span class='hljl-string'>&quot; </span><span class='hljl-string_iterpol'>$x</span><span class='hljl-string'> </span><span class='hljl-string_iterpol'>$</span><span class='hljl-punctuation'>(</span><span class='hljl-keyword'>let</span><span class='hljl-text'> </span><span class='hljl-name'>x</span><span class='hljl-text'> </span><span class='hljl-operator'>=</span><span class='hljl-text'> </span><span class='hljl-name'>y</span><span class='hljl-text'> </span><span class='hljl-operator'>+</span><span class='hljl-text'> </span><span class='hljl-number_integer'>1</span><span class='hljl-punctuation'>;</span><span class='hljl-text'> </span><span class='hljl-name'>x</span><span class='hljl-operator'>^</span><span class='hljl-number_integer'>2</span><span class='hljl-punctuation'>;</span><span class='hljl-text'> </span><span class='hljl-keyword_end'>end</span><span class='hljl-punctuation'>)</span><span class='hljl-string'> ... </span><span class='hljl-string_escape'>\\n</span><span class='hljl-string'>&quot;</span><span class='hljl-text'>\n\n</span><span class='hljl-string_macro'>r&quot;[a-z]+$xyz&quot;</span><span class='hljl-name'>m</span><span class='hljl-text'>\n\n</span><span class='hljl-string_macro'>raw&quot;\\n\\n\\r\\t...\\b&quot;</span><span class='hljl-text'>\n</span><span class='hljl-string_macro'>raw&quot;&quot;&quot;\\n\\n\\r\\t...\\b&quot;&quot;&quot;</span><span class='hljl-name'>abc</span><span class='hljl-text'>\n\n</span><span class='hljl-string_macro'>v&quot;0.0.2&quot;</span><span class='hljl-text'> </span><span class='hljl-operator'>≥</span><span class='hljl-text'> </span><span class='hljl-string_macro'>v&quot;0.0.1&quot;</span><span class='hljl-text'>\n\n</span><span class='hljl-name_function'>run</span><span class='hljl-punctuation'>(</span><span class='hljl-string_backtick'>`foo </span><span class='hljl-string_iterpol'>$bar</span><span class='hljl-string_backtick'> --baz </span><span class='hljl-string_iterpol'>$</span><span class='hljl-punctuation'>([</span><span class='hljl-name'>a</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-name'>b</span><span class='hljl-punctuation'>,</span><span class='hljl-text'> </span><span class='hljl-name'>c</span><span class='hljl-punctuation'>])</span><span class='hljl-string_backtick'>`</span><span class='hljl-punctuation'>)</span><span class='hljl-text'>\n\n</span><span class='hljl-number_integer'>1_000_000_000</span><span class='hljl-text'> </span><span class='hljl-operator'>+</span><span class='hljl-text'> </span><span class='hljl-number_float'>1.0e-9</span><span class='hljl-text'> </span><span class='hljl-operator'>*</span><span class='hljl-text'> </span><span class='hljl-number_float'>.121</span><span class='hljl-text'> </span><span class='hljl-operator'>/</span><span class='hljl-text'> </span><span class='hljl-number_float'>1121.</span><span class='hljl-text'>\n</span><span class='hljl-number_float'>1f0</span><span class='hljl-text'> </span><span class='hljl-operator'>-</span><span class='hljl-text'> </span><span class='hljl-number_float'>1E-12</span><span class='hljl-text'>\n</span><span class='hljl-number_bin'>0b100_101_111</span><span class='hljl-text'>\n</span><span class='hljl-number_oct'>0o12123535252</span><span class='hljl-text'>\n</span><span class='hljl-number_hex'>0x4312afAfabC</span><span class='hljl-text'>\n</span><span class='hljl-number_integer'>1234</span><span class='hljl-text'>\n</span><span class='hljl-number_integer'>1_2_3_4</span><span class='hljl-text'>\n\n</span></pre>"
},

{
    "location": "lib/public.html#",
    "page": "Public Interface",
    "title": "Public Interface",
    "category": "page",
    "text": ""
},

{
    "location": "lib/public.html#Public-Interface-1",
    "page": "Public Interface",
    "title": "Public Interface",
    "category": "section",
    "text": "Under Construction..."
},

{
    "location": "lib/internals.html#",
    "page": "Package Internals",
    "title": "Package Internals",
    "category": "page",
    "text": ""
},

{
    "location": "lib/internals.html#Package-Internals-1",
    "page": "Package Internals",
    "title": "Package Internals",
    "category": "section",
    "text": "Under Construction..."
},

]}