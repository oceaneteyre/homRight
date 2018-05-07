<?php
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
        
        foreach (array_keys($json_data) as $column) {
            $ret = $user->set_property($column, $json_data[$column]);
                
            //Vérifier que la fonction n'a pas retournée d'erreur
            check_error($ret);
        }
        
        check_error($user->get_by_pseudo_and_password());

