import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-6">
      <p className="text-6xl font-black text-gray-200">404</p>
      <h1 className="text-xl font-bold text-gray-800">Page introuvable</h1>
      <p className="text-sm text-gray-500">La ressource demandée n&#39;existe pas ou vous n&#39;y avez pas accès.</p>
      <Link href="/" className="text-sm text-blue-600 hover:underline">← Retour à l&#39;accueil</Link>
    </div>
  )
}
