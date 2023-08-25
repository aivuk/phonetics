\set db_user `echo $DB_USER`
\set db_pass `echo $DB_PASS`

drop role if exists :db_user;
create role :db_user with login password :'db_pass';

create database phonetic;
alter database phonetic owner to :db_user;
create table homophones (word1 text, word2 text, lang text);
create index homophones_idx on homophones (word1, word2, lang);


