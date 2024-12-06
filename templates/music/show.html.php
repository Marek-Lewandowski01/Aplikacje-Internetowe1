<?php

/** @var \App\Model\Music $music */
/** @var \App\Service\Router $router */

$title = "{$music->getTitle()} ({$music->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= htmlspecialchars($music->getTitle(), ENT_QUOTES, 'UTF-8') ?></h1>
    <article>
        <p>Artysta: <?= htmlspecialchars($music->getArtist(), ENT_QUOTES, 'UTF-8') ?></p>
<!--        <p>Album: --><?php //= htmlspecialchars($music->getAlbum(), ENT_QUOTES, 'UTF-8') ?><!--</p>-->
        <p>Rok: <?= htmlspecialchars($music->getYear(), ENT_QUOTES, 'UTF-8') ?></p>
        <p>Gatunek: <?= htmlspecialchars($music->getGenre(), ENT_QUOTES, 'UTF-8') ?></p>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('music-index') ?>">Powrót do listy</a></li>
        <li><a href="<?= $router->generatePath('music-edit', ['id' => $music->getId()]) ?>">Edytuj</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';