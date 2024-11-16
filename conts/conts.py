import random

def fase_adicao():
    print("\n--- Fase 1: Adição ---")
    pontos = 0
    for _ in range(5):  # 5 perguntas
        a, b = random.randint(1, 10), random.randint(1, 10)
        resposta_certa = a + b
        resposta = int(input(f"{a} + {b} = "))
        if resposta == resposta_certa:
            print("Correto!")
            pontos += 1
        else:
            print(f"Incorreto! A resposta certa é {resposta_certa}.")
    return pontos

def fase_subtracao():
    print("\n--- Fase 2: Subtração ---")
    pontos = 0
    for _ in range(5):
        a, b = random.randint(1, 10), random.randint(1, 10)
        if a < b:  # Garante que a subtração não dê resultado negativo
            a, b = b, a
        resposta_certa = a - b
        resposta = int(input(f"{a} - {b} = "))
        if resposta == resposta_certa:
            print("Correto!")
            pontos += 1
        else:
            print(f"Incorreto! A resposta certa é {resposta_certa}.")
    return pontos

def fase_multiplicacao():
    print("\n--- Fase 3: Multiplicação ---")
    pontos = 0
    for _ in range(5):
        a, b = random.randint(1, 10), random.randint(1, 10)
        resposta_certa = a * b
        resposta = int(input(f"{a} * {b} = "))
        if resposta == resposta_certa:
            print("Correto!")
            pontos += 1
        else:
            print(f"Incorreto! A resposta certa é {resposta_certa}.")
    return pontos

def fase_divisao():
    print("\n--- Fase 4: Divisão ---")
    pontos = 0
    for _ in range(5):
        a, b = random.randint(1, 10), random.randint(1, 10)
        resposta_certa = a / b
        resposta = float(input(f"{a} / {b} = "))
        if resposta == resposta_certa:
            print("Correto!")
            pontos += 1
        else:
            print(f"Incorreto! A resposta certa é {resposta_certa:.2f}.")
    return pontos

def jogar():
    print("Bem-vindo ao Desafio Matemático!")
    total_pontos = 0

    total_pontos += fase_adicao()
    total_pontos += fase_subtracao()
    total_pontos += fase_multiplicacao()
    total_pontos += fase_divisao()

    print(f"\nVocê completou todas as fases! Total de pontos: {total_pontos}")

# Inicia o jogo
if __name__ == "__main__":
    jogar()
