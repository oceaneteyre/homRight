<?php

require_once("../config/database.php");
require_once("../objects/user.php");
require_once("../errors.php");

//Initialiser la connexion
$db = new Database();

//Vérifier que l'objet n'a pas retourné d'erreur
check_error($db);

//Initialiser l'objet user
$home = new Home($db);

//Vérifier que l'objet n'a pas retourné d'erreur
check_error($home);

//Récupérer les données au format json
$json_data = json_decode(file_get_contents('php://input'), true);

if ($json_data == null) {
    return check_error(errors("Create_get_contents", "Le fichier json est vide"));
}

//Affecter les valeurs 
foreach (array_keys($home->properties) as $column) {
    if (! array_keys_exists($column, $json_data)) {
        $json_data[$column] = null;
    }

    $ret = $home->set_property_value($column, $json_data[$column]);

    //Vérifier que la fonction n'a pas retournée d'erreur
    check_error($ret);
}
check_error($home->create());

success("Maison créé");
