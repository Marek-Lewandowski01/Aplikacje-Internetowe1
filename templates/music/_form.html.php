<?php

/** @var \App\Model\Music $music */

?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="music[title]" value="<?= $music ? $music->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="artist">Artist</label>
    <input type="text" id="artist" name="music[artist]" value="<?= $music ? $music->getArtist() : '' ?>">
</div>

<div class="form-group">
    <label for="genre">Genre</label>
    <input type="text" id="genre" name="music[genre]" value="<?= $music ? $music->getGenre() : '' ?>">
</div>

<div class="form-group">
    <label for="year">Year</label>
    <input type="text" id="year" name="music[year]" value="<?= $music ? $music->getYear() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>