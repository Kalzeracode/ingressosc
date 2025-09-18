
# Requisitos do Sistema de Bilhetes

## 1. Tipos de Bilhetes

O sistema deve suportar diferentes tipos de bilhetes, cada um com suas características:

*   **Bilhete Padrão:** Preço base, sem descontos ou benefícios adicionais.
*   **Bilhete VIP:** Preço mais alto, inclui acesso a áreas exclusivas, brindes, etc.
*   **Bilhete Estudante:** Desconto percentual sobre o preço base, requer validação (simulada).
*   **Bilhete Idoso:** Desconto percentual sobre o preço base, requer validação (simulada).
*   **Bilhete Infantil:** Preço fixo ou gratuito para crianças até uma certa idade.

## 2. Regras de Preço

*   Cada tipo de bilhete terá um preço base configurável.
*   Os preços podem variar de acordo com a data do evento (ex: preço antecipado, preço normal, preço de última hora).
*   Possibilidade de definir preços diferentes para dias da semana e fins de semana.

## 3. Descontos e Promoções

*   **Descontos por Quantidade:** Desconto aplicado ao comprar um certo número de bilhetes (ex: compre 3, ganhe 10% de desconto).
*   **Códigos Promocionais:** Campos para inserção de códigos que aplicam descontos percentuais ou fixos.
*   **Descontos Específicos:** Descontos para grupos (ex: famílias, empresas parceiras).

## 4. Quantidade e Disponibilidade

*   Controle de estoque para cada tipo de bilhete.
*   Limite máximo de bilhetes por compra por usuário.
*   Mensagens de aviso quando os bilhetes estiverem acabando.

## 5. Carrinho de Compras

*   Adicionar/remover bilhetes do carrinho.
*   Atualizar quantidades de bilhetes no carrinho.
*   Exibir subtotal, descontos aplicados e total final.

## 6. Informações do Comprador

*   Formulário para coletar nome, e-mail, telefone.
*   Campos opcionais para informações adicionais (ex: CPF para nota fiscal).

## 7. Pagamento (Simulado)

*   Interface para simular o processo de pagamento.
*   Confirmação da compra e exibição dos detalhes do pedido.

## 8. Interface do Usuário (UI)

*   Design responsivo para desktop e mobile.
*   Navegação intuitiva.
*   Feedback visual para ações do usuário (ex: bilhete adicionado ao carrinho).

## 9. Tecnologias

*   **Frontend:** React.js, HTML, CSS (com pré-processador ou framework CSS como Tailwind CSS/Styled Components).
*   **Gerenciamento de Estado:** Context API ou Redux (para casos mais complexos).
*   **Roteamento:** React Router DOM.
*   **Testes:** Jest, React Testing Library.
*   **Build:** Vite ou Create React App (para iniciar).


