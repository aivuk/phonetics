create table homophones (word1 text, word2 text, lang text, pair_count integer default 1);
create index homophones_idx on homophones (word1, word2, lang);


