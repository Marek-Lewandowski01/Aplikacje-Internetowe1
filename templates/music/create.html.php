<?php

/** @var \App\Model\Music $music */
/** @var \App\Service\Router $router */

$title = 'Dodaj utwór';
$bodyClass = 'edit';

ob_start(); ?>
    <h1>Dodaj utwór</h1>
    <form action="<?= $router->generatePath('music-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="music-create">
    </form>

    <a href="<?= $router->generatePath('music-index') ?>">Powrót do listy</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';