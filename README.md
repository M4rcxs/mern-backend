# Backend - Integração de APIs

Este é o backend do projeto de integração de múltiplas APIs, construído com **Node.js** e **Express**, responsável por processar dados de diferentes fontes externas e fornecer informações de forma segura e eficiente para o frontend.

---

## Tecnologias utilizadas

- **Node.js** e **Express** – Servidor web e roteamento.  
- **Axios** – Para realizar requisições HTTP a APIs externas.  
- **CORS** – Permite requisições cross-origin do frontend.  
- **MongoDB** – Para persistência de dados (opcional).  
- **dotenv** – Gerenciamento de variáveis de ambiente.  

---

## Funcionalidades principais

- Integração com múltiplas APIs externas, combinando dados de diferentes fontes.  
- Cálculo de distâncias geográficas usando a **fórmula de Haversine** para medir a distância real entre coordenadas.  
- Processamento de dados em tempo real para fornecer informações consistentes ao frontend.  
- Estrutura modular que permite fácil expansão para novos endpoints e integrações.  

---

## Fórmula de Haversine

A fórmula de Haversine é utilizada para calcular a distância entre dois pontos na superfície da Terra levando em consideração sua curvatura.  

```js
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // raio da Terra em metros
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const deltaLat = (lat2 - lat1) * Math.PI / 180;
  const deltaLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) ** 2 +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
}
```

## How to Run

Siga os passos abaixo para rodar o backend localmente:

```
npm install
```
```
node index.js
```


