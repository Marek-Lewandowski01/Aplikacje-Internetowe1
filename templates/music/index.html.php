<?php

/** @var \App\Model\Music[] $musicList */
/** @var \App\Service\Router $router */

$title = 'Lista utworów';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Lista utworów</h1>

    <a href="<?= $router->generatePath('music-create') ?>">Dodaj nowy utwór</a>

    <ul class="index-list">
        <?php foreach ($musicList as $music): ?>
            <li><h3><?= htmlspecialchars($music->getTitle(), ENT_QUOTES, 'UTF-8') ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('music-show', ['id' => $music->getId()]) ?>">Szczegóły</a></li>
                    <li><a href="<?= $router->generatePath('music-edit', ['id' => $music->getId()]) ?>">Edytuj</a></li>
                    <li>
                        <form action="<?= $router->generatePath('music-delete', ['id' => $music->getId()]) ?>" method="post">
                            <input type="submit" value="Usuń" onclick="return confirm('Czy na pewno chcesz usunąć?')">
                        </form>
                    </li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';