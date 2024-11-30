<?php
    session_start();
    if (!isset($_SESSION['id_crianca'])) {
        header('Location: login_cria.php');
        exit();
    }
    
    include 'config.php';
    $id_crianca = $_SESSION['id_crianca'];

    // Obter dados da requisição
    $media_time = $_POST['media_time']; // Média enviada pelo frontend
    $id_crianca = $_SESSION['id_crianca']; // ID do jogador logado

    // Inserir os dados na tabela desempenho
    $stmt = $conn->prepare("INSERT INTO desempenho (fk_criancas_id_crianca, media_time) VALUES (?, ?)");
    $stmt->bind_param("sd", $id_crianca, $media_time);

    if ($stmt->execute()) {
        echo "Dados inseridos com sucesso!";
    } else {
        echo "Erro ao inserir dados: " . $stmt->error;
    }

    $stmt->close();
?>