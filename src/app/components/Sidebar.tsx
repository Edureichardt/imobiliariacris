import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 h-auto bg-gradient-to-t from-green-950 to-black text-white p-4 flex flex-col justify-between">
      <nav className="space-y-4">
        <Link href="/admin" className="block hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/novo-imovel" className="block hover:underline">
          Cadastrar Imóvel
        </Link>
        <Link href="/admin/gerenciar-imoveis" className="block hover:underline">
          gerenciar-imoveis
        </Link>
        <Link href="/admin/excluirImovel"className="block hover:underline">
      Excluir imovel
      </Link>
      </nav>
      
      <div>
        <Link href="/">
          <button className="w-full mt-6 px-4 py-2 bg-green-700 rounded hover:bg-green-600">
            Voltar para Home
          </button>
        </Link>
      </div>
    </aside>
  );
}
