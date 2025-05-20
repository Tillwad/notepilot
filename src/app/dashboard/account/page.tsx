export default function AccountPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Dein Konto</h1>
    
        <p className="mb-6">
            Hier kannst du dein Abo verwalten und deine Kontoinformationen
            aktualisieren.
        </p>
    
        <div className="mb-6">
            <p className="text-lg">Aktuelles Abo: Pro (bezahlt)</p>
        </div>
    
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Abo kündigen
        </button>
    </main>
  );
}