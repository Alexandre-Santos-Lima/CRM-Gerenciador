const API_URL = '/api';

export const fetchColumns = async () => {
  const response = await fetch(`${API_URL}/columns`);
  if (!response.ok) throw new Error('Erro ao buscar colunas');
  return response.json();
};

export const createCard = async (cardData) => {
  const response = await fetch(`${API_URL}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });
  if (!response.ok) throw new Error('Erro ao criar card');
  return response.json();
};

export const moveCard = async (cardId, columnId) => {
  const response = await fetch(`${API_URL}/cards/${cardId}/move`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ column_id: columnId }),
  });
  if (!response.ok) throw new Error('Erro ao mover card');
  return response.json();
};

export const updateCard = async (cardId, cardData) => {
  const response = await fetch(`${API_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });
  if (!response.ok) throw new Error('Erro ao atualizar card');
  return response.json();
};

export const deleteCard = async (cardId) => {
  const response = await fetch(`${API_URL}/cards/${cardId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao deletar card');
  return response.json();
};