import random
from flask import Flask, render_template

alfabeto_palavras = {
    'A': 'Abacate',
    'B': 'Bola',
    'C': 'Cachorro',
    'D': 'Dado',
    'E': 'Elefante',
    'F': 'Foca',
    'G': 'Gato',
    'H': 'Hipopótamo',
    'I': 'Igreja',
    'J': 'Jacaré',
    'K': 'Kiwi',
    'L': 'Leão',
    'M': 'Macaco',
    'N': 'Navio',
    'O': 'Ovelha',
    'P': 'Pato',
    'Q': 'Queijo',
    'R': 'Rato',
    'S': 'Sapo',
    'T': 'Tigre',
    'U': 'Urso',
    'V': 'Vaca',
    'W': 'Wolverine',
    'X': 'Xaxim',
    'Y': 'Yeti',
    'Z': 'Zebra'
}

def fase_1():
    print("\n--- Fase 1: Letras do Alfabeto ---")
    letras = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    random.shuffle(letras)
    acertos = 0

    for letra in letras:
        resposta = input(f"Qual palavra que começa com a letra '{letra}'? ").strip().capitalize()
        if resposta.startswith(letra):
            print("Muito bem!")
            acertos += 1
        else:
            print(f"A palavra correta deve começar com '{letra}'. Uma palavra correta é '{alfabeto_palavras[letra]}'.")

    print(f"Você acertou {acertos} de {len(letras)}.")

def fase_2():
    print("\n--- Fase 2: Imagens (Exemplo) ---")
    acertos = 0
    for letra, palavra in alfabeto_palavras.items():
        resposta = input(f"Qual letra começa a palavra '{palavra}'? ").strip().upper()
        if resposta == letra:
            print("Muito bem!")
            acertos += 1
        else:
            print(f"A palavra '{palavra}' começa com a letra '{letra}'.")

    print(f"Você acertou {acertos} de {len(alfabeto_palavras)}.")

def fase_3():
    print("\n--- Fase 3: Frases Curiosas ---")
    letras = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    random.shuffle(letras)
    acertos = 0

    for letra in letras:
        frase = input(f"Crie uma frase usando palavras que começam com a letra '{letra}': ")
        if any(palavra.startswith(letra) for palavra in frase.split()):
            print("Ótima frase! Você usou palavras que começam com a letra!")
            acertos += 1
        else:
            print(f"Tente novamente! Sua frase deve conter palavras que começam com '{letra}'.")

    print(f"Você acertou {acertos} de {len(letras)}.")

def jogar():
    while True:
        print("Bem-vindo ao Alfabeto Mágico!")
        fase_1()
        fase_2()
        fase_3()
        print("\nParabéns! Você completou todas as fases!")
        
        jogar_novamente = input("Você quer jogar novamente? (s/n): ").strip().lower()
        if jogar_novamente != 's':
            print("Obrigado por jogar! Até a próxima!")
            break

if __name__ == "__main__":
    jogar()