<?php

    header('Access-Control-Allow-Origin:*');

    header('Content-Type: application/json;charset=UTF-8');
    header('Access-Control-Allow-Methods: DELETE, HEAD, GET, OPTIONS, POST, PUT');
    header('Access-Control-Allow-Headers: : Origin, Content-Type, X-Auth-Token , Authorization');
    header('Access-Control-Max-Age: 1728000');

        require_once("../config/database.php");
        require_once("../objects/user.php");
        require_once("../errors.php");
        

        
        //Initialiser la connexion
        $db = new Database();
        
        //Vérifier que l'objet n'a pas retourné d'erreur
        check_error($db);
        
        //Initialiser l'objet user
        $user = new User($db);
        
        //Vérifier que l'objet n'a pas retourné d'erreur
        check_error($user);
        
        //Récupérer les données au format json
        $json_data = json_decode(file_get_contents('php://input'), true);
        
        if ($json_data == null) {
            return check_error(errors("Create_get_contents", "Le fichier json est vide"));
        }
        
        //Affecter les valeurs 
        foreach (array_keys($user->properties) as $column) {
            var_dump($user->properties);
            return;
            if (! in_array($column, $json_data)) {
                $json_data[$column] = null;
                return check_error(errors("Create_get_contents", "$column n'existe pas"));
            }
            
            $ret = $user->set_property($column, $json_data[$column]);
                
            //Vérifier que la fonction n'a pas retournée d'erreur
            check_error($ret);
            
        }
        
        check_error($user->create());
        
        success();