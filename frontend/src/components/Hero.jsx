import React from 'react';

export const Hero = () => {
  const handleScrollDown = () => {
    const nextPage = document.getElementById('nextPage');
    if (nextPage) {
      nextPage.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="text-gray-500 body-font h-screen flex bg-black bg-svg-constellation-gray-100 relative">
      <div className="container mx-auto flex px-5 py-12 items-center justify-center flex-col">
        <div className="lg:w-2/3 w-full animate-fade-in-down">
        <h1 className="md:text-6xl text-3xl mb-2 font-bold text-white tracking-tight leading-tight">
  Welcome to <span className="text-[#E50914]">Emo</span><span className="text-[#1DB954]">Tunes</span>:
</h1>

          <h1 className="md:text-4xl text-3xl mb-4 font-bold text-white tracking-tight leading-tight">
            Your Personalized Entertainment Experience{' '}
            <span className="border-b-4 border-green-400 -mb-20"></span>
            with Music and Movie Recommendations.
          </h1>

          <p className="mt-8 mb-16 md:leading-relaxed leading-normal text-white tracking-tight text-xl">
  Ready to embark on a personalized journey that harmonizes with your emotions? Welcome to EmoTunes, where music and movies converge to curate an immersive experience tailored just for you. Let us be your guide through the realms of sound and cinema, where every recommendation resonates with your soul.
</p>

          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
            <button
              onClick={handleScrollDown}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
