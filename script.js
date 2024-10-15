let currentPokemonId = 1;

// Função para buscar os dados do Pokémon
function fetchPokemon(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.json())
        .then((data) => {
            const paddedId = data.id.toString().padStart(3, '0'); // Formata o ID com três dígitos
            document.getElementById('pokemon-background-number').textContent = paddedId;
            document.getElementById('pokemon-name').textContent =
                data.name.charAt(0).toUpperCase() + data.name.slice(1);
            document.getElementById('pokemon-image').src = data.sprites.front_default;

            // Exibir os tipos do Pokémon
            const types = data.types.map((typeInfo) => typeInfo.type.name).join(', ');
            document.getElementById('pokemon-type').textContent = types;

            // Exibir o peso do Pokémon (convertido para kg)
            const weight = data.weight / 10;
            document.getElementById('pokemon-weight').textContent = `Weight: ${weight} kg`;

            // Exibir as habilidades do Pokémon
            const abilities = data.abilities.map((abilityInfo) => abilityInfo.ability.name).join(', ');
            document.getElementById('pokemon-abilities').textContent = `Abilities: ${abilities}`;

            // Atualizar o gráfico de status
            updateStatusChart(data.stats);
        })
        .catch((error) => {
            console.error('Erro ao buscar Pokémon:', error);
        });
}

// Função para atualizar o gráfico de status
function updateStatusChart(stats) {
    const ctx = document.getElementById('status-chart').getContext('2d');

    // Extrair os dados e os nomes das estatísticas
    const labels = stats.map(stat => stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1));
    const values = stats.map(stat => stat.base_stat);

    // Destruir o gráfico anterior, se existir
    if (window.pokemonChart) {
        window.pokemonChart.destroy();
    }

    // Obter tipo de gráfico e cor do formulário
    const chartType = document.getElementById('chart-type').value;
    const chartColor = document.getElementById('chart-color').value;

    // Criar um novo gráfico
    window.pokemonChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Stats',
                data: values,
                backgroundColor: chartColor + '20', // Cor com opacidade
                borderColor: chartColor,
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 20, // Ajuste o tamanho do passo das marcas no eixo
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.1 // Efeito de suavização
                }
            }
        }
    });
}

// Funções para navegar entre os Pokémon
function nextPokemon() {
    if (currentPokemonId < 898) { // Limite para o total de Pokémon existentes na PokeAPI
        currentPokemonId++;
        fetchPokemon(currentPokemonId);
    }
}

function previousPokemon() {
    if (currentPokemonId > 1) {
        currentPokemonId--;
        fetchPokemon(currentPokemonId);
    }
}

// Função para atualizar o gráfico quando as opções mudarem
function updateChart() {
    fetchPokemon(currentPokemonId); // Recarregar o Pokémon atual para aplicar as novas opções
}

// Carregar o primeiro Pokémon quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    fetchPokemon(currentPokemonId);
});
