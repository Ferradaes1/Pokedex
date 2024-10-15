import os
import requests

def get_pokemon_id_by_name(pokemon_name):
    # Converte o nome para minúsculas para a consulta na API
    url = f'https://pokeapi.co/api/v2/pokemon/{pokemon_name.lower()}'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return data['id'], data['name']
    else:
        return None, None

def rename_pokemon_files(folder_path):
    for filename in os.listdir(folder_path):
        print(f'Processando arquivo: {filename}')  # Adicionado para depuração
        if filename.endswith('.gif'):  # Verifique a extensão correta
            pokemon_name = filename.split('.')[0]  # Extrair nome do Pokémon do nome do arquivo
            print(f'Nome do Pokémon: {pokemon_name}')  # Adicionado para depuração
            
            # Obter o ID do Pokémon a partir do nome
            pokemon_id, name_corrected = get_pokemon_id_by_name(pokemon_name)
            print(f'ID do Pokémon obtido: {pokemon_id}, Nome corrigido: {name_corrected}')  # Verifique o ID e o nome
            
            if pokemon_id:
                new_name = f"({pokemon_id}) - {name_corrected}.gif"  # Formato desejado
                print(f'Tentando renomear {filename} para {new_name}.')
                
                # Verifica se o novo nome já existe
                if not os.path.exists(os.path.join(folder_path, new_name)):
                    try:
                        os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_name))
                        print(f'Renomeado: {filename} para {new_name}')
                    except Exception as e:
                        print(f'Erro ao renomear {filename}: {e}')
                else:
                    print(f'O arquivo {new_name} já existe, não renomeando {filename}.')
            else:
                print(f'Pokémon {pokemon_name} não encontrado.')

folder_path = r'C:\Users\Ferradaes\Desktop\pokedex-master\Hd-sprites-master'
rename_pokemon_files(folder_path)
