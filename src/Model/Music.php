<?php

namespace App\Model;

use App\Service\Config;

class Music
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $artist = null;
    private ?string $genre = null;
    private ?string $year = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Music
    {
        $this->id = $id;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Music
    {
        $this->title = $title;

        return $this;
    }

    public function getArtist(): ?string
    {
        return $this->artist;
    }

    public function setArtist(?string $artist): Music
    {
        $this->artist = $artist;

        return $this;
    }

    public function getGenre(): ?string
    {
        return $this->genre;
    }

    public function setGenre(?string $genre): Music
    {
        $this->genre = $genre;

        return $this;
    }

    public function getYear(): ?string
    {
        return $this->year;
    }

    public function setYear(?string $year): Music
    {
        $this->year = $year;

        return $this;
    }

    public static function fromArray($array): Music
    {
        $music = new self();
        $music->fill($array);

        return $music;
    }

    public function fill($array): Music
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['artist'])) {
            $this->setArtist($array['artist']);
        }
        if (isset($array['genre'])) {
            $this->setGenre($array['genre']);
        }
        if (isset($array['year'])) {
            $this->setYear($array['year']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM music';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $posts = [];
        $postsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($postsArray as $postArray) {
            $posts[] = self::fromArray($postArray);
        }
        return $posts;
    }

    public static function find($id): ?Music
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM music WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $postArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$postArray) {
            return null;
        }
        $post = Music::fromArray($postArray);

        return $post;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if ($this->getId()) {
            $sql = 'UPDATE music SET title = :title, artist = :artist, genre = :genre, year = :year WHERE id = :id';
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'id' => $this->getId(),
                'title' => $this->getTitle(),
                'artist' => $this->getArtist(),
                'genre' => $this->getGenre(),
                'year' => $this->getYear(),
            ]);
        } else {
            $sql = 'INSERT INTO music (title, artist, genre, year) VALUES (:title, :artist, :genre, :year)';
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'artist' => $this->getArtist(),
                'genre' => $this->getGenre(),
                'year' => $this->getYear(),
            ]);
            $this->setId((int)$pdo->lastInsertId());
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'DELETE FROM music WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute([':id' => $this->getId()]);

        $this->setId(null);
        $this->setArtist(null);
        $this->setTitle(null);
        $this->setGenre(null);
        $this->setYear(null);
    }

    public function validate(): array
    {
        $errors = [];

        if (empty($this->title)) {
            $errors[] = 'Tytuł jest wymagany';
        }

        if (empty($this->artist)) {
            $errors[] = 'Artysta jest wymagany';
        }

        if (empty($this->genre)) {
            $errors[] = 'Gatunek jest wymagany';
        }

        if (empty($this->year) || !is_numeric($this->year)) {
            $errors[] = 'Rok wydania jest wymagany i musi być liczbą';
        }

        return $errors;
    }


}