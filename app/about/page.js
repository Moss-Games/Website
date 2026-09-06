export const metadata = {
  title: "About Us — MossGames",
};

const team = [
  {
    name: "Camille Guerraz",
    bio: "Graduated from MJM Graphic Design school in 2025, specializing in 3D Realization. She handles all the narrative side and the art direction of the project. She also does the sociological interviews.",
  },
  {
    name: "Geremy Cambus",
    bio: "Scientific Baccalaureate in 2018, Bachelor's level in Computer Science/Mathematics in 2022, graduated from MJM Graphic Design school in 2025, specializing in 3D Realization. Currently an instructor at private schools, teaching Rigging and Tech Art courses, as well as C++/Blueprints programming. He handles all the technical and programming aspects of the projects.",
  },
  {
    name: "Tom Merville",
    bio: "Graduated from MJM Graphic Design school in 2025, specializing in 3D Realization, and holding a STD2A Baccalaureate (Technological Sciences of Design and Applied Arts). They oversee the musical, artistic, and visual branches of the projects.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-12 px-6 py-16 text-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-display text-4xl tracking-tight text-zinc-900">
          About Us
        </h1>
        <p className="max-w-md text-lg text-zinc-600">
          We are a small team of game developers based in Toulouse, France.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-10 text-left sm:grid-cols-3 sm:gap-8">
        {team.map((member) => (
          <div key={member.name} className="flex flex-col gap-2">
            <h2 className="font-display text-xl text-zinc-900">
              {member.name}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              {member.bio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
