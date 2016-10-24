import ..Highlights.Compiler: NULL_RANGE, Context

function definition(::Type{JuliaLexer})
    local keywords = Base.REPLCompletions.complete_keyword("")
    local char_regex = [
        raw"'(\\.|\\[0-7]{1,3}|\\x[a-fA-F0-9]{1,3}|",
        raw"\\u[a-fA-F0-9]{1,4}|\\U[a-fA-F0-9]{1,6}|",
        raw"[^\\\'\n])'",
    ]
    return Dict(
        :name => "Julia",
        :description => "A lexer for Julia source code.",
        :aliases => ["julia", "jl"],
        :filenames => ["*.jl"],
        :mimetypes => ["text/x-julia", "application/x-julia"],
        :tokens => Dict(
            :root => [
                (r"\n"m, TEXT),
                (r"[^\S\n]+"m, TEXT),
                (r"#=", COMMENT_MULTILINE, :block_comments),
                (r"#.*$"m, COMMENT_SINGLE),
                (r"[\[\]{}(),;]", PUNCTUATION),

                (r"\b(?<![:_.])in\b", KEYWORD_PSEUDO),
                (r"\b(?<![_.])end\b", KEYWORD),
                (r"\b(?<![:_.])(true|false)\b", KEYWORD_CONSTANT),
                (r"\b(?<![:_.])(local|global|const)\b", KEYWORD_DECLARATION),
                (words(keywords, prefix = "\\b(?<![:_.])", suffix = "\\b"), KEYWORD),

                (Regex(join(char_regex)), STRING_CHAR),

                (r"\"\"\"", STRING, :triple_strings),
                (r"\"", STRING, :strings),

                (julia_is_triple_string_macro, STRING_OTHER, :triple_string_macros),
                (julia_is_string_macro, STRING_OTHER, :string_macros),

                (r"`", STRING_BACKTICK, :commands),

                (julia_is_method_call, NAME_FUNCTION),
                (julia_is_identifier, NAME),
                (julia_is_macro_identifier, NAME_DECORATOR),

                (r"(\d+(_\d+)+\.\d*|\d*\.\d+(_\d+)+)([eEf][+-]?[0-9]+)?", NUMBER_FLOAT),
                (r"(\d+\.\d*|\d*\.\d+)([eEf][+-]?[0-9]+)?", NUMBER_FLOAT),
                (r"\d+(_\d+)+[eEf][+-]?[0-9]+", NUMBER_FLOAT),
                (r"\d+[eEf][+-]?[0-9]+", NUMBER_FLOAT),
                (r"0b[01]+(_[01]+)+", NUMBER_BIN),
                (r"0b[01]+", NUMBER_BIN),
                (r"0o[0-7]+(_[0-7]+)+", NUMBER_OCT),
                (r"0o[0-7]+", NUMBER_OCT),
                (r"0x[a-fA-F0-9]+(_[a-fA-F0-9]+)+", NUMBER_HEX),
                (r"0x[a-fA-F0-9]+", NUMBER_HEX),
                (r"\d+(_\d+)+", NUMBER_INTEGER),
                (r"\d+", NUMBER_INTEGER),

                (r"[^[:alnum:]\s()\[\]{},;@_\"\']+", OPERATOR),

                (r"."ms, TEXT),
            ],
            :block_comments => [
                (r"[^#=]", COMMENT_MULTILINE),
                (r"#=", COMMENT_MULTILINE, :__push__),
                (r"=#", COMMENT_MULTILINE, :__pop__),
                (r"[=#]", COMMENT_MULTILINE),
            ],
            :commands => [
                (r"`", STRING_BACKTICK, :__pop__),
                (julia_is_iterp_identifier, STRING_INTERPOL),
                (r"(\$)(\()", (STRING_INTERPOL, PUNCTUATION), :in_interpol),
                (r".|\s"ms, STRING_BACKTICK),
            ],
            :strings => [
                (r"\"", STRING, :__pop__),
                (r"\\([\\\"\'\$nrbtfav]|(x|u|U)[a-fA-F0-9]+|\d+)", STRING_ESCAPE),
                (julia_is_iterp_identifier, STRING_INTERPOL),
                (r"(\$)(\()", (STRING_INTERPOL, PUNCTUATION), :in_interpol),
                (r".|\s"ms, STRING),
            ],
            :triple_strings => [
                (r"\"\"\"", STRING, :__pop__),
                (r"\\([\\\"\'\$nrbtfav]|(x|u|U)[a-fA-F0-9]+|\d+)", STRING_ESCAPE),
                (julia_is_iterp_identifier, STRING_INTERPOL),
                (r"(\$)(\()", (STRING_INTERPOL, PUNCTUATION), :in_interpol),
                (r".|\s"ms, STRING),
            ],
            :string_macros => [
                (r"\"", STRING_OTHER, :__pop__),
                (r"\\\"", STRING_OTHER),
                (r".|\s"ms, STRING_OTHER),
            ],
            :triple_string_macros => [
                (r"\"\"\"", STRING_OTHER, :__pop__),
                (r".|\s"ms, STRING_OTHER),
            ],
            :in_interpol => [
                (r"\(", PUNCTUATION, :__push__),
                (r"\)", PUNCTUATION, :__pop__),
                :root,
            ],
        ),
    )
end

function julia_is_identifier(ctx::Context, prefix = '\0')
    s = ctx.source
    i = ctx.pos[]
    done(s, i) && return NULL_RANGE
    (c, i) = next(s, i)
    if prefix !== '\0'
        (c === prefix && !done(s, i)) || return NULL_RANGE
        (c, i) = next(s, i)
    end
    Base.is_id_start_char(c) || return NULL_RANGE
    local prev_i = i
    while !done(s, i)
        prev_i = i
        (c, i) = next(s, i)
        Base.is_id_char(c) || break
    end
    return ctx.pos[]:prevind(s, prev_i)
end
julia_is_macro_identifier(ctx::Context) = julia_is_identifier(ctx, '@')
julia_is_iterp_identifier(ctx::Context) = julia_is_identifier(ctx, '$')

function julia_is_method_call(ctx::Context)
    local range = julia_is_identifier(ctx)
    range === NULL_RANGE && return range
    i = nextind(ctx.source, last(range))
    done(ctx.source, i) && return NULL_RANGE
    (c, i) = next(ctx.source, i)
    return (c === '(' || c === '{') ? range : NULL_RANGE
end

function julia_is_string_macro(ctx::Context, count::Integer = 1)
    local range = julia_is_identifier(ctx)
    range == NULL_RANGE && return NULL_RANGE
    local s = ctx.source
    local i = prevind(s, ctx.pos[] + length(range) + 1)
    local num = 0
    while num < count && !done(s, i)
        (c, i) = next(s, i)
        c === '"' ? (num += 1) : break
    end
    num == count ? (ctx.pos[]:prevind(s, i)) : NULL_RANGE
end
julia_is_triple_string_macro(ctx::Context) = julia_is_string_macro(ctx, 3)
