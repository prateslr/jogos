import random

# Dicionário de formas e suas cores
formas = {
    "Círculo": "Vermelho",
    "Quadrado": "Verde",
    "Triângulo": "Azul",
    "Estrela": "Amarelo"
}

def jogar():
    print("Bem-vindo ao Quebra-Cabeça de Formas e Cores!")
    formas_listadas = list(formas.keys())
    random.shuffle(formas_listadas)  # Embaralha as formas

    acertos = 0  # Contador de acertos

    for forma in formas_listadas:
        resposta = input(f"Qual é a cor do '{forma}'? ").strip().capitalize()
        if resposta == formas[forma]:
            print("Muito bem! Você acertou!")
            acertos += 1
        else:
            print(f"Não foi dessa vez! A cor correta é '{formas[forma]}'.")

    print(f"\nParabéns! Você completou o quebra-cabeça com {acertos} acertos de {len(formas_listadas)}!")
    print("Obrigado por jogar!")

# Inicia o jogo
if __name__ == "__main__":
    jogar()
