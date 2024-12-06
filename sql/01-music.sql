create table music
(
    id      integer not null
        constraint music_pk
            primary key autoincrement,
    title   text not null,
    artist  text not null,
    year    integer not null,
    genre   text not null
);