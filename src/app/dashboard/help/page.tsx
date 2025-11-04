import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      {/* SOBRE LOGIN E CADASTRO */}
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Como faço login ou cadastro no sistema?
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Para acessar o sistema, clique em{" "}
            <strong className="text-green-700">“Entrar”</strong> no menu
            inicial. Caso ainda não tenha uma conta, selecione{" "}
            <strong className="text-green-700">“Cadastrar”</strong> e preencha
            as informações solicitadas (nome, e-mail e senha).
          </p>
          <p>
            Após o cadastro, você poderá fazer login normalmente com seu e-mail
            e senha cadastrados. Caso esqueça sua senha, utilize a opção
            <strong className="text-green-700">
              {" "}
              “Esqueci minha senha”
            </strong>{" "}
            para redefinir.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* SOBRE CADASTRO DE TIMES */}
      <AccordionItem value="item-2">
        <AccordionTrigger>
          Como cadastrar, editar ou excluir um time?
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            No menu do dashboard, acesse a opção{" "}
            <strong className="text-green-700">“Times”</strong>. Clique em{" "}
            <strong className="text-green-700">“+ Adicionar”</strong> para
            cadastrar um novo time, preenchendo o nome e a modalidade.
          </p>
          <p>
            Para editar um time existente, clique no ícone de
            <strong className="text-green-700"> lápis</strong> ao lado do nome.
            Caso queira excluir, utilize o ícone de{" "}
            <strong className="text-green-700">lixeira</strong>.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* SOBRE PARTIDAS E CAMPEONATOS */}
      <AccordionItem value="item-3">
        <AccordionTrigger>
          Como funcionam as partidas e campeonatos?
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Cada campeonato é composto por vários times cadastrados. Você pode
            criar novas partidas associando dois times e definindo a data, local
            e resultado (quando disponível).
          </p>
          <p>
            O sistema calcula automaticamente a classificação dos times com base
            nas vitórias, empates e derrotas. Essa tabela é atualizada em tempo
            real conforme os resultados são inseridos.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* SOBRE ERROS E SUPORTE */}
      <AccordionItem value="item-4">
        <AccordionTrigger>
          O que fazer se algo não funcionar corretamente?
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Caso encontre algum erro (por exemplo, ao salvar um time ou carregar
            dados), tente recarregar a página e verificar sua conexão com a
            internet.
          </p>
          <p>
            Se o problema persistir, entre em contato com o suporte técnico pelo
            e-mail{" "}
            <strong className="text-green-700">suporte@sistema.com</strong> ou
            envie uma mensagem através da seção{" "}
            <strong className="text-green-700">“Contato”</strong> no menu
            principal.
          </p>
        </AccordionContent>
      </AccordionItem>

      {/* SOBRE SEGURANÇA E DADOS */}
      <AccordionItem value="item-5">
        <AccordionTrigger>Meus dados estão seguros?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <p>
            Sim. Todas as informações são armazenadas em servidores seguros, com
            comunicação criptografada (HTTPS) e controle de acesso por
            autenticação.
          </p>
          <p>
            Apenas usuários autorizados podem visualizar ou editar informações
            sensíveis, garantindo a privacidade e integridade dos dados.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default function HelpPage() {
  return (
    <main className="flex flex-col items-center p-4 md:px-20">
      <h1 className="w-full text-2xl md:text-3xl font-bold mb-6 text-center text-green-700">
        Central de Ajuda
      </h1>
      <p className="max-w-2xl text-center text-gray-600 mb-6">
        Aqui você encontra respostas para as dúvidas mais comuns sobre o uso do
        sistema. Caso ainda precise de ajuda, entre em contato com o suporte
        técnico.
      </p>
      <AccordionDemo />
    </main>
  );
}
