'use client';

const InstagramSection = () => {
  const postIds = ['DKdMmUqAH7y', 'DA8lOcXRxAB', 'DBMcK1mRZyy'];

  return (
    <section className="w-full py-12 px-4 bg-gradient-to-tl from-green-950 to-black">
      <div className="max-w-6xl mx-auto text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Siga a gente no Instagram</h2>
        <p className="mb-8">
          Acompanhe as novidades no nosso Instagram:{' '}
          <a
            href="https://instagram.com/imobiliariacaimoveis"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline"
          >
            @imobiliariacaimoveis
          </a>
        </p>

        {/* Grid responsivo com os posts do Instagram */}
        <div className="flex flex-wrap justify-center gap-6">
          {postIds.map((id) => (
            <iframe
              key={id}
              src={`https://www.instagram.com/p/${id}/embed`}
              width="320"
              height="400"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
              className="rounded-lg shadow-lg"
              title={`Instagram Post ${id}`}
            ></iframe>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
