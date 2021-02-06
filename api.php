<?php

class Api
{
    public function show()
    {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");
        http_response_code(200);

        $connect = $this->connect();
        $query = "SELECT * FROM tasks";
        $param = [];

        $result = $connect->prepare($query);
        $result->execute($param);
        $tasks = [];

        foreach ($result->fetchAll(\PDO::FETCH_ASSOC) as $value) {
            $tasks[$value['id']]['description'] = $value['description'];
            $tasks[$value['id']]['time'] = $value['taskdate'];
            $tasks[$value['id']]['success'] = $value['success'];
        }
        echo json_encode($tasks);
    }

    public function saveData()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json);

        $connect = $this->connect();

        if (count($data->removeTasks) > 0) {
            foreach ($data->removeTasks as $removeTask) {
                $query = "DELETE FROM tasks WHERE id = ?";
                $param = [$removeTask];
                $result = $connect->prepare($query);
                $result->execute($param);
            }
        }

        unset($data->removeTasks);

        $query = "SELECT id FROM tasks";
        $result = $connect->prepare($query);
        $result->execute();
        foreach ($result->fetchAll(\PDO::FETCH_ASSOC) as $id) {
            $ids[] = $id['id'];
        }

        foreach ($data as $key => $value) {

                if(in_array($key, $ids)) {
                    $query = "UPDATE tasks SET description = ?,taskdate = ?,success = ? WHERE id = $key";
                    $param = [$value->description, $value->time, $value->success];
                    $result = $connect->prepare($query);
                    $result->execute($param);

                }else {
                    $query = "INSERT INTO tasks(id,description,taskdate,success) VALUES (?,?,?,?)";
                    $param = [$key, $value->description, $value->time, $value->success];
                    $result = $connect->prepare($query);
                    $result->execute($param);
                }
        }
        echo json_encode(['message' => 'Ok']);
    }

    private function connect()
    {
        $config = require_once(__DIR__ . DIRECTORY_SEPARATOR . 'config.php');
        return $connect = new \PDO($config['dns'], $config['user'], $config['password'], [\PDO::ATTR_PERSISTENT => true]);
    }
}

