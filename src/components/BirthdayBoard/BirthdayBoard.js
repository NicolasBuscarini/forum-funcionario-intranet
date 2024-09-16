import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa os estilos do calendário
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import './BirthdayBoard.css'; // Arquivo de estilo adicional

const BirthdayBoard = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock de aniversariantes para exibição de testes com o novo formato
  const mockBirthdays = [
    { nome: 'João Silva', dia: 5, mes: 9, filial: 'Filial 1', descricao: 'CTT1' },
    { nome: 'Nicolas', Dia: 5, Mes: 9, Filial: 'Filial 2', Descricao: 'CTT2' },
    { nome: 'Ronaldo', Dia: 5, Mes: 9, Filial: 'Filial 3', Descricao: 'CTT3' },
    { nome: 'Maria Santos', Dia: 12, Mes: 9, Filial: 'Filial 1', Descricao: 'CTT1' },
    { nome: 'Carlos Souza', Dia: 20, Mes: 9, Filial: 'Filial 2', Descricao: 'CTT2' },
    { nome: 'Ana Pereira', Dia: 25, Mes: 9, Filial: 'Filial 3', Descricao: 'CTT3' },
  ];

  // Função para buscar os aniversariantes do endpoint
  const fetchBirthdays = async () => {
    try {
      const response = await fetch('https://localhost:5011/api/employees/current-month');
      const data = await response.json();
      setBirthdays(data);
    } catch (error) {
      console.error('Erro ao buscar aniversariantes:', error);
      // Se der erro no fetch, usamos os dados mockados
      setBirthdays(mockBirthdays);
    }
  };

  // Chama a função fetchBirthdays quando o componente é montado
  useEffect(() => {
    fetchBirthdays();
  }, []);

  // Função para marcar as datas de aniversário no calendário
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const day = date.getDate();
      const hasBirthday = birthdays.some(birthday => birthday.Dia === day && birthday.Mes === date.getMonth() + 1);

      if (hasBirthday) {
        return <span role="img" aria-label="birthday">🎂</span>;
      }
    }
    return null;
  };

  // Filtra os aniversariantes para o dia selecionado
  const getBirthdaysForSelectedDate = () => {
    return birthdays.filter(birthday => {
      return (
        birthday.Dia === selectedDate.getDate() &&
        birthday.Mes === selectedDate.getMonth() + 1
      );
    });
  };

  // Calcula o primeiro e o último dia do mês atual
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

  return (
    <Container className="birthday-container">
      <Row>
        <Col className="d-flex justify-content-center">
          <h2 className="birthday-title">Aniversariantes de {selectedDate.toLocaleString('default', { month: 'long' })}</h2>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            minDate={firstDayOfMonth} // Limita ao primeiro dia do mês
            maxDate={lastDayOfMonth} // Limita ao último dia do mês
            prevLabel={null} // Remove o botão de navegação anterior
            nextLabel={null} // Remove o botão de navegação próximo
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="d-flex justify-content-center">
          <h2 className="birthday-title">Aniversariantes do dia {selectedDate.toLocaleDateString()}</h2>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <Col>
          <ListGroup>
            {getBirthdaysForSelectedDate().length > 0 ? (
              getBirthdaysForSelectedDate().map((birthday, index) => (
                <ListGroup.Item key={index} className="text-center">
                  <strong>{birthday.nome}</strong> - Aniversário: {birthday.Dia}/{birthday.Mes} - Filial: {birthday.Filial}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="text-center">Nenhum aniversariante neste dia.</ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default BirthdayBoard;
