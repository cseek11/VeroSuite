package test

import future.keywords.if

test_contains_case_sensitive if {
    text := "Reusable component test"
    contains(text, "Reusable component")
}

test_contains_case_insensitive if {
    text := "Reusable component test"
    not contains(text, "reusable component")
}



